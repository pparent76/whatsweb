import QtQuick 2.9
import Ubuntu.Components 1.3
import QtQuick.Window 2.2
import Ubuntu.Components.ListItems 1.3 as ListItemm
import Ubuntu.Content 1.3

Item {
    id: notificationsHowto
    width: parent.width
    height: parent.height

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
    // Propriété pour recevoir le PageStack
    property PageStack pageStack

    Column {
        spacing: 8
        width: parent.width * 0.8
        height: implicitHeight
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottom: parent.bottom
        anchors.bottomMargin: parent.height * 0.12

        // Image de cloche
        Image {
            source: "Icons/bell.png"
            width: 25
            height: 25
            anchors.horizontalCenter: parent.horizontalCenter
        }

        // Texte en gras
        Text {
            text: "This application supports notifications."
            font.pixelSize: 14
            font.bold: false
            color: "#666666"   // gris intermédiaire visible sur clair et sombre
            wrapMode: Text.WordWrap
            horizontalAlignment: Text.AlignHCenter
            anchors.horizontalCenter: parent.horizontalCenter
        }

        Label {
            text: "Show me how!"
            font.pixelSize: 14
            color: "#37a5e8"  // Couleur bleu typique des liens
            anchors.horizontalCenter: parent.horizontalCenter

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                if (notificationsHowto.pageStack) {
                    notificationsHowto.pageStack.push(Qt.createQmlObject(`
                        import QtQuick 2.9
                        import Ubuntu.Components 1.3
                        import QtQuick.Window 2.2
                        import Ubuntu.Components.ListItems 1.3 as ListItemm
                        import Ubuntu.Content 1.3

                        Page {
                            // Background
                            Rectangle {
                                anchors.fill: parent
                                color: "#7dbe8a"
                            }

                            PageHeader {
                                title: i18n.tr("Notifications how-to")          
                                leadingActionBar.actions: [
                                Action {
                                iconName: "back"
                                text: "Retour"
                                onTriggered: {
                                    parent.pageStack.pop()
                                    }
                                }
                                ]
                                
                            }

                            Image {
                                anchors.horizontalCenter: parent.horizontalCenter
                                anchors.top: parent.top
                                anchors.topMargin: parent.height * 0.12
                                width: parent.width
                                fillMode: Image.PreserveAspectFit
                                source: "Backgrounds/Notifications-howto.jpg"
                            }
                        }
                    `, notificationsHowto.pageStack))
                }
            }
        }
        }
    }
}
