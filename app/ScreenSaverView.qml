// ScreenSaverView.qml
import QtQuick 2.15
import QtQuick.Controls 2.15

Rectangle {
    id: root
    anchors.fill: parent
    property alias backgroundSource: screensaverBackground.source
    color: "#f0f0f0"  // gris très clair
    visible: !Qt.application.active  // affiché quand l'application perd le focus

    // --- Image de fond ---
    Image {
        id: screensaverBackground
        source: Qt.resolvedUrl("Backgrounds/screensaver.png")  // ton image de fond
        anchors.centerIn: parent
        width: parent.width
        height: parent.height
        fillMode: Image.PreserveAspectCrop
    }

    // --- Icône centrale ---
    Image {
        id: icon
        source: Qt.resolvedUrl("../icon-splash.png")  // ton icône centrale
        anchors.centerIn: parent
        width: parent.width * 0.5
        height: width
        fillMode: Image.PreserveAspectFit
    }

}
