#include "NotificationHelper.h"
#include <QDebug>
#include <QDBusInterface>
#include <QDBusReply>
#include <QPointer>
#include <QByteArray>
#include <QDBusMessage>
#include <QJsonDocument>
#include <QDebug>
#include <QJsonArray>

#define PUSH_APP_ID "whatsweb.pparent_whatsweb"
#define PUSH_SERVICE "com.lomiri.PushNotifications"
#define POSTAL_SERVICE "com.lomiri.Postal"
#define PUSH_PATH "/com/lomiri/PushNotifications"
#define POSTAL_PATH "/com/lomiri/Postal"
#define PUSH_IFACE "com.lomiri.PushNotifications"
#define POSTAL_IFACE "com.lomiri.Postal"



QJsonObject NotificationHelper::buildSummaryMessage(const QString &title,const QString &message) {


    QString icon = QString("/opt/click.ubuntu.com/whatsweb.pparent/current/icon.png");

    QJsonObject c;
    c["summary"] = title;
    if (message.length()>0)
        c["body"] = message;
    c["popup"] = true;
    c["persist"] = true;
    c["icon"] = icon;
    QJsonArray actions = QJsonArray();
    QString actionUri = QStringLiteral("appid://whatsweb.pparent/whatsweb/current-user-version");
    actions.append(actionUri);
    c["actions"] = actions;

    QJsonObject notification;
    notification["card"] = c;
    notification["sound"] = true;
    notification["vibrate"] = true;
    QJsonObject res;
    res["notification"] = notification;
    return res;
}

bool NotificationHelper::send(const QString &title,const QString &message)
{
return sendJSON(buildSummaryMessage(title,message));
}


//shamelessly stolen from accounts-polld
bool NotificationHelper::sendJSON(const QJsonObject &message)
{
    QDBusMessage msg = QDBusMessage::createMethodCall(POSTAL_SERVICE,
                                                      makePath(PUSH_APP_ID),
                                                      POSTAL_IFACE,
                                                      "Post");
    msg << PUSH_APP_ID;
    QByteArray data = QJsonDocument(message).toJson(QJsonDocument::Compact);
    msg << QString::fromUtf8(data);

    qDebug() << "[POST] >>  " << msg;

    QDBusMessage reply = m_conn.call(msg);
    if (reply.type() == QDBusMessage::ErrorMessage) {
        qDebug() << "[POST ERROR] " << reply.errorMessage();
        return false;
    }
    qDebug() << "[POST SUCCESS] >> Message posted.";
    QJsonObject n = message.value("notification").toObject();
    QString tag = n.value("tag").toString();
    updateCount(tag);
    return true;
}

bool NotificationHelper::update(const QString &tag, const QJsonObject &message)
{
    if (hasTag(tag)) {
        clearPersistent(tag);
    }
    return sendJSON(message);
}

bool NotificationHelper::hasTag(const QString &tag)
{
    return m_tags.contains(tag);
}

bool NotificationHelper::clearPersistent(const QString &tag)
{
    if (m_tags.contains(tag)) {
        qDebug() << "[REMOVE] >> Removing message: " << tag;
        QDBusMessage message = QDBusMessage::createMethodCall(POSTAL_SERVICE,
                                                              makePath(PUSH_APP_ID),
                                                              POSTAL_IFACE,
                                                              "ClearPersistent");
        message << PUSH_APP_ID;
        message << tag;

        QDBusMessage reply = m_conn.call(message);
        if (reply.type() == QDBusMessage::ErrorMessage) {
            qDebug() << "[REMOVE ERROR] " << reply.errorMessage();
            return false;
        }
        qDebug() << "[REMOVE SUCCESS] Notification removed";
        return updateCount(tag, true);
    }
    return false;
}

bool NotificationHelper::updateCount(const QString &tag, const bool remove)
{
    qDebug() << "[COUNT] >> Updating launcher count";
    if (!tag.isEmpty()) {
        if (!remove && !m_tags.contains(tag)) {
            qDebug() << "[COUNT] >> Tag not yet in persistent list. adding it now: " << tag;
            m_tags << tag;
        }

        if (remove && m_tags.contains(tag)) {
            qDebug() << "[COUNT] >> Removing tag from persistent list: " << tag;
            m_tags.removeAll(tag);
        }
    }

    bool visible = m_tags.count() != 0;
    QDBusMessage message = QDBusMessage::createMethodCall(POSTAL_SERVICE,
                                                          makePath(PUSH_APP_ID),
                                                          POSTAL_IFACE,
                                                          "SetCounter");
    message << PUSH_APP_ID << m_tags.count() << visible;
    bool result = m_conn.send(message);
    if (result) {
        qDebug() << "[COUNT] >> Updated.";
    }
    return result;
}

//shamelessly stolen from accounts-polld
QByteArray NotificationHelper::makePath(const QString &appId)
{
    QByteArray path(QByteArrayLiteral("/com/lomiri/Postal/"));

    QByteArray pkg = appId.split('_').first().toUtf8();
    for (int i = 0; i < pkg.count(); i++) {
        char buffer[10];
        char c = pkg[i];
        switch (c) {
        case '+':
        case '.':
        case '-':
        case ':':
        case '~':
        case '_':
            sprintf(buffer, "_%.2x", c);
            path += buffer;
            break;
        default:
            path += c;
        }
    }
    qDebug() << "[PATH] >> " << path;
    return path;
}

QStringList NotificationHelper::getPersistent()
{
    QDBusMessage message = QDBusMessage::createMethodCall(POSTAL_SERVICE,
                                                          makePath(PUSH_APP_ID),
                                                          POSTAL_IFACE,
                                                          "ListPersistent");
    message << PUSH_APP_ID;
    QDBusMessage reply = m_conn.call(message);
    if (reply.type() == QDBusMessage::ErrorMessage) {
        qDebug() << reply.errorMessage();
        return QStringList();
    }
    QStringList tags = reply.arguments()[0].toStringList();
    qDebug() << "[TAGS] >> " << tags;
    return tags;
}

NotificationHelper::NotificationHelper(QObject *parent) : QObject(parent),
    m_conn(QDBusConnection::sessionBus())
{
    //    m_tags = getPersistent();
    updateCount();
}


void NotificationHelper::showNotificationMessage(const QString &title,const QString &message)
{
    send(title,message);
}

