#ifndef NOTIFICATIONHELPER_H
#define NOTIFICATIONHELPER_H

#include <QObject>
#include <QString>
#include <QDBusConnection>
#include <QJsonObject>

class NotificationHelper : public QObject
{
Q_OBJECT
public:
    
    explicit NotificationHelper(QObject *parent = 0);

    Q_INVOKABLE void showNotificationMessage(const QString &title,const QString &message);


    Q_INVOKABLE bool send(const QString &title,const QString &message);
    
    // Send a notification
    bool sendJSON(const QJsonObject &message);
    // Update a notification
    bool update(const QString &tag, const QJsonObject &message);

    bool hasTag(const QString &tag);
    bool clearPersistent(const QString &tag);
    bool updateCount(const QString &tag = QString(), const bool remove = false);

private:
    QJsonObject buildSummaryMessage(const QString &title,const QString &message);
    QByteArray makePath(const QString &appId);
    QStringList getPersistent();

    QDBusConnection m_conn;
    QStringList m_tags;
};

#endif // NOTIFICATIONHELPER_H
 
