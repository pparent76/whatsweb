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

    //Send a notification from title and message information
    Q_INVOKABLE void showNotificationMessage(const QString &title,const QString &message);
    
    //Update notification counter on icon
    Q_INVOKABLE bool updateCount(const int count);
    
    // Send a notification based on JSON notification
    bool sendJSON(const QJsonObject &message);

private:
    QJsonObject buildSummaryMessage(const QString &title,const QString &message);
    QByteArray makePath(const QString &appId);

    QDBusConnection m_conn;
    QStringList m_tags;
};

#endif // NOTIFICATIONHELPER_H
 
