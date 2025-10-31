import QtQuick 2.9
import Ubuntu.Components 1.3
import QtQuick.Window 2.2
import Ubuntu.Components.ListItems 1.3 as ListItemm
import Ubuntu.Content 1.3


Item {
    id: notificationsHowto
    width: parent.width
    height: parent.height
    property PageStack pageStack

    opacity: 0   // initialement invisible

    // Timer pour déclencher l'apparition
    Timer {
        interval: 2000  // 2 secondes
        running: true
        repeat: false
        onTriggered: notificationsHowto.opacity = 1
    }

    // Animation du fondu
    Behavior on opacity {
        NumberAnimation { duration: 500 }  // 0.5 secondes
    }
      Image {
            source: "Icons/gear.png"
            id:settingsButton
            width: 25
            height: 25
            anchors {
              top: parent.top
              right: parent.right
              topMargin: units.gu(1)
              rightMargin: units.gu(1)
              }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                  mainPageStack.push(Qt.resolvedUrl("SettingsPage.qml"),{"config":mainView.config})
                }
            }
        } 
        
}
