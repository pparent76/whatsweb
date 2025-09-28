#ifndef NOTIFICATIONHELPER_H
#define NOTIFICATIONHELPER_H

#include <QObject>
#include <QString>

class NotificationHelper : public QObject
{
Q_OBJECT
public:
explicit NotificationHelper(QObject *parent = nullptr);

Q_INVOKABLE void showNotificationMessage(const QString &message);

};

#endif // NOTIFICATIONHELPER_H
 
