

#include <libnotify/notify.h>

#include "NotificationHelper.h"
#include <QDebug>
#include <QDBusInterface>
#include <QDBusReply>


NotificationHelper::NotificationHelper(QObject *parent)
: QObject(parent)
{
    notify_init("whatsweb.pparent"); // Initialiser libnotify
}


void NotificationHelper::showNotificationMessage(const QString &title,const QString &message)
{
    pushClient.send(title,message);
}

