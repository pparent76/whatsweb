import QtQuick 2.9
import Ubuntu.Components 1.3
import Qt.labs.settings 1.1
import "UCSComponents"

Page {
    id: settingsPage
    title: i18n.tr("Configuration")
    
      header: PageHeader {
                id:header
                title: i18n.tr("Settings")          
                leadingActionBar.actions: 
                [
                    Action {
                    iconName: "back"
                    text: "Retour"
                    onTriggered: {
                        parent.pageStack.pop()
                        }
                    }
                ]
    }    
  Settings {
        id: config
        category: "AppSettings"

        property int webviewWidthPortait: 410
        property int webviewWidthLandscape: 900        
        property int textFontSize: 110
        property int spanFontSize: 104

        property bool enableDesktopNotifications: true
        property bool enableTitleChangeNotifications: true
        property bool enableSoundNotifications: true
        property bool enableNotificationCounter: true

        property bool enableScreensaver: true
        property bool disableBackgroundAudio: true

        property bool enableQuickCopy: true
        property bool enableGpu: true
    }
        
        // Background
            Rectangle {
                anchors.fill: parent
                color: "#ffffff"
            }
 

    Flickable {
    id: flick
     anchors { fill: parent; topMargin: header.height }
    clip: true

    // Dimensions du contenu à défiler
    contentWidth: width
    contentHeight: column.implicitHeight
        Column {
            id:column
            width: parent.width
            spacing: units.gu(2)
            padding: units.gu(1)
            //anchors { fill: parent}
            Row{
            Button {
            text: i18n.tr("Reset to default values")
            onClicked: {
                config.webviewWidthPortait = 410
                webviewWidthPortait.value = 410
                config.webviewWidthLandscape = 900
                webviewWidthLandscape.value = 900
                config.textFontSize = 110
                textFontSize.value = 110
                config.spanFontSize = 104
                spanFontSize.value = 104

                config.enableDesktopNotifications = true
                enableDesktopNotifications.checked = true
                config.enableTitleChangeNotifications = true
                enableTitleChangeNotifications.checked = true
                config.enableSoundNotifications = true
                enableSoundNotifications.checked = true
                config.enableNotificationCounter = true
                enableNotificationCounter.checked = true

                config.enableScreensaver = true
                enableScreensaver.checked = true
                config.disableBackgroundAudio = true
                disableBackgroundAudio.checked = true

                config.enableQuickCopy = true
                enableQuickCopy.checked = true
                config.enableGpu = true
                enableGpu.checked = true
                }
            }
                
            }
            // --- Scaling ---
            Label { text: "Scaling"; font.bold: true; fontSize: "large"; color: UbuntuColors.orange }
            SliderRow { id:webviewWidthPortait; text: "Webview width (portrait)"; value: config.webviewWidthPortait; onValueChanged: config.webviewWidthPortait = value }
            SliderRow { id:webviewWidthLandscape; text: "Webview width (landscape)"; value: config.webviewWidthLandscape; onValueChanged: config.webviewWidthLandscape = value }
            SliderRow { id:textFontSize; text: "Text fontsize (%)"; value: config.textFontSize; onValueChanged: config.textFontSize = value }
            SliderRow { id:spanFontSize; text: "Span fontsize (%)"; value: config.spanFontSize; onValueChanged: config.spanFontSize = value }

            // --- Notifications ---
            Label { text: "Notifications"; font.bold: true; fontSize: "large"; color: UbuntuColors.orange }
            SwitchRow {  id:enableDesktopNotifications; text: "Enable notifications from desktop not."; checked: config.enableDesktopNotifications; onCheckedChanged: config.enableDesktopNotifications = checked }
            SwitchRow { id:enableTitleChangeNotifications; text: "Enable notifications from title change"; checked: config.enableTitleChangeNotifications; onCheckedChanged: config.enableTitleChangeNotifications = checked }
            SwitchRow { id:enableSoundNotifications; text: "Enable notifications from sound event"; checked: config.enableSoundNotifications; onCheckedChanged: config.enableSoundNotifications = checked }
            SwitchRow { id:enableNotificationCounter; text: "Enable notification counter"; checked: config.enableNotificationCounter; onCheckedChanged: config.enableNotificationCounter = checked }

            // --- Background behaviour ---
            Label { text: "Background behaviour"; font.bold: true; fontSize: "large"; color: UbuntuColors.orange }
            SwitchRow { id:enableScreensaver; text: "Enable screensaver"; checked: config.enableScreensaver; onCheckedChanged: config.enableScreensaver = checked }
            SwitchRow {id:disableBackgroundAudio; text: "Disable background audio"; checked: config.disableBackgroundAudio; onCheckedChanged: config.disableBackgroundAudio = checked }

            // --- Tweaking ---
            Label { text: "Tweaking"; font.bold: true; fontSize: "large"; color: UbuntuColors.orange }
            SwitchRow { id:enableQuickCopy; text: "Enable quick copy to clipboard"; checked: config.enableQuickCopy; onCheckedChanged: config.enableQuickCopy = checked }
            SwitchRow {id:enableGpu;  text: "Enable GPU"; checked: config.enableGpu; onCheckedChanged: config.enableGpu = checked }
        }
       }
}
