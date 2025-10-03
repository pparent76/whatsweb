#ifndef NOTIFICATIONHELPER_H
#define NOTIFICATIONHELPER_H

#include "pushclient.h"
#include <QObject>
#include <QString>

class NotificationHelper : public QObject
{
Q_OBJECT
public:
explicit NotificationHelper(QObject *parent = nullptr);

Q_INVOKABLE void showNotificationMessage(const QString &title,const QString &message);

private:
    PushClient pushClient;
};

#endif // NOTIFICATIONHELPER_H
 
