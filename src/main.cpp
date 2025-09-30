#include <QGuiApplication>
#include <QObject>
#include <QString>
#include <QDir>
#include <QQmlApplicationEngine>
#include <QStandardPaths>
#include <QDir>
#include <QFile>
#include <QTextStream>
#include <QThread>

#include "pushclient.h"
#include "NotificationHelper.h"
#include <QDBusInterface>
#include <QDBusReply>
#include <QDBusConnectionInterface>

#include <QQuickView>
#include <QQmlContext>
#include <QScreen>

void vibrate(int ms) {
    QDBusInterface iface("com.lomiri.Vibrator",
                         "/com/lomiri/Vibrator",
                         "com.lomiri.Vibrator",
                         QDBusConnection::systemBus());

    if (iface.isValid()) {
        iface.call("Vibrate", ms);
    }
}

int main(int argc, char *argv[])
{

vibrate(3000);
QObject test;
NotificationHelper notifiyer(&test);
QCoreApplication::setOrganizationName("alefnode");
QCoreApplication::setApplicationName("whatsweb");

QGuiApplication app(argc, argv);

QQuickView * m_view = new QQuickView();
m_view->setMinimumSize(QSize(300, 600));
m_view->setTitle("Messaging");
m_view->rootContext()->setContextProperty("application", &app);
m_view->setResizeMode(QQuickView::SizeRootObjectToView);

m_view->engine()->rootContext()->setContextProperty("notifier", &notifiyer);
const QUrl url("qrc:/qml/Main.qml");
m_view->setSource(url);

m_view->show();

return app.exec();
}



//--------------------------------------------------------------------------
// Old Testing code
//-------------------------------------------------------------------------
//    PushClient notif;
//    notif.send("Whatsapp test");
//    QThread::sleep(2);


//    notifiyer.showNotificationMessage("Whatsweb Started!");
//    QThread::sleep(2);

//    QDBusConnection::sessionBus().registerService("alefnode.whatsweb");
//    QDBusInterface postal(
//            "com.lomiri.Postal",                       // destination
//            "/com/lomiri/Postal/alefnode_2ewhatsweb", // object path
//            "com.lomiri.Postal",                       // interface
//            QDBusConnection::sessionBus()
//        );
//    QString node = "alefnode.whatsweb_whatsweb";
//    QString jsonMessage = R"({"message": "foobar", "notification":{"card": {"summary": "Sofla", "body": "hello", "popup": true, "persist": true}, "tag":"chat","sound":"buzz.mp3", "vibrate":{"pattern":[200,100],"duration":200,"repeat":2}}})";

//    QDBusReply<void> reply = postal.call("Post", node, jsonMessage);
//        if (!reply.isValid()) {
//            qDebug() << "Erreur Post:" << reply.error().message();
//            notifiyer.showNotificationMessage("reply.error().message().QString()");
//        }

//    QDBusReply<QStringList> popReply = postal.call("PopAll", node);
//        if (popReply.isValid()) {
//            QStringList popped = popReply.value();
//            qDebug() << "Notifications poppées:" << popped;
//            notifiyer.showNotificationMessage(popped.join(", "));
//        } else {
//            qDebug() << "Erreur PopAll:" << popReply.error().message();
//            notifiyer.showNotificationMessage("popReply.error().message().QString()");
//        }

////QDBusConnection::sessionBus().registerService("alefnode.whatsweb");
////send notification

//notifiyer.showNotificationMessage("Dbus done");

//QThread::sleep(2);
//Start QML application

