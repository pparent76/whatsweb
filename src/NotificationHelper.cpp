

#include <libnotify/notify.h>

#include "NotificationHelper.h"
#include <QDebug>


NotificationHelper::NotificationHelper(QObject *parent)
: QObject(parent)
{
    notify_init("alefnode.whatsweb"); // Initialiser libnotify
}

void NotificationHelper::showNotificationMessage(const QString &message)
{
    const QString icon = "/opt/click.ubuntu.com/.click/users/@all/alefnode.whatsweb/icon.png";

    NotifyNotification *notification = notify_notification_new( message.toStdString().c_str(),nullptr, icon.toStdString().c_str());

    notify_notification_set_urgency(notification, NOTIFY_URGENCY_LOW);

    GError *error = nullptr;
    if (!notify_notification_show(notification, &error)) {
        qWarning() << "Failed to show notification:" << error->message;
     g_error_free(error);
    }

    g_object_unref(G_OBJECT(notification));
}

