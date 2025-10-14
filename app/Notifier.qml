// Notifier.qml
import QtQuick 2.15
import QtQuick.Controls 2.15
import Pparent.Notifications 1.0

Item {
    id: root


    // === Propriétés configurables depuis l'extérieur ===
    property string push_app_id: "defaultApp"
    property int floodDelay: 5000   // délai anti-flood (ms)
    property double timer1Interval: 2500
    property double timer2Interval: 1400

    // === Public methods ===
    
    function notifyMain(title, msg) {
        if (!Qt.application.active) {
            lastNotifyTimestamp = Date.now()
            notifier.showNotificationMessage(title, msg)
        }
    }
    
   function triggerDelayedNotification1(customMsg) {
        if (customMsg !== undefined)
            timer1.msg = customMsg
        timer1.restart()
    }    

    function triggerDelayedNotification2(customMsg) {
        if (customMsg !== undefined)
            timer2.msg = customMsg
        timer2.restart()
    }
    
    function updateCount(value)
    {
        notifier.updateCount(value)
    }
    
    // === État interne ===
    property double lastNotifyTimestamp: 0

    // === Notification helper ===
    NotificationHelper {
        id: notifier
        push_app_id: root.push_app_id
    }

    // === Fonctions de notification ===
    function notifyBackup(title, msg) {
        var now = Date.now()
        if (now - lastNotifyTimestamp > floodDelay) {
            if (!Qt.application.active) {
                lastNotifyTimestamp = now
                notifier.showNotificationMessage(title, msg)
            }
        }
    }


    // === Timers exposés ===
    Timer {
        id: timer1
        running: false
        repeat: false
        interval: root.timer1Interval
        property string msg: "notif"        
        onTriggered: {
            root.notifyBackup(msg, "")
            timer1.running = false
        }
    }

    Timer {
        id: timer2
        running: false
        repeat: false
        interval: root.timer2Interval
        property string msg: "notif"
        onTriggered: {
            root.notifyBackup(msg, "")
            timer2.running = false
        }
    }


}
