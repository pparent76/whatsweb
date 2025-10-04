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
    
    Q_INVOKABLE bool updateCount(const int count);
    
    // Send a notification
    bool sendJSON(const QJsonObject &message);

private:
    QJsonObject buildSummaryMessage(const QString &title,const QString &message);
    QByteArray makePath(const QString &appId);
    QStringList getPersistent();

    QDBusConnection m_conn;
    QStringList m_tags;
};

#endif // NOTIFICATIONHELPER_H
 
