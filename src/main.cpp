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

#include "NotificationHelper.h"
#include <QDBusInterface>
#include <QDBusReply>
#include <QDBusConnectionInterface>

#include <QQuickView>
#include <QQmlContext>
#include <QScreen>


int main(int argc, char *argv[])
{

//QDBusConnection::sessionBus().registerService("alefnode.whatsweb");
//send notification
QObject test;
NotificationHelper notifiyer(&test);
notifiyer.showNotificationMessage("Whatsapp started");

QThread::sleep(2);
//Start QML application

QCoreApplication::setOrganizationName("alefnode");
QCoreApplication::setApplicationName("whatsweb");

QGuiApplication app(argc, argv);

QQuickView * m_view = new QQuickView();
m_view->setMinimumSize(QSize(300, 600));
m_view->setTitle("Messaging");
m_view->rootContext()->setContextProperty("application", &app);
m_view->setResizeMode(QQuickView::SizeRootObjectToView);

const QUrl url("qrc:/qml/Main.qml");
m_view->setSource(url);

m_view->show();

return app.exec();
}

