import QtQuick 2.9
import Ubuntu.Components 1.3
import QtQuick.Window 2.2
import Morph.Web 0.1
import "UCSComponents"
import QtWebEngine 1.7
import Qt.labs.settings 1.0
import QtSystemInfo 5.5
import Ubuntu.Components.ListItems 1.3 as ListItemm
import Ubuntu.Content 1.3


MainView {
  id: mainView
  property int lastUnreadCount: -1;

  ScreenSaver {
    id: screenSaver
    screenSaverEnabled: !(Qt.application.active)
  }
  objectName: "mainView"
  //theme.name: "Ubuntu.Components.Themes.SuruDark"
  applicationName: "alefnode.whatsweb"
  backgroundColor : "transparent"
  anchors {
    fill: parent
    bottomMargin: UbuntuApplication.inputMethod.visible ? UbuntuApplication.inputMethod.keyboardRectangle.height : 0
    // Behavior on bottomMargin {
    //     NumberAnimation {
    //         duration: 175
    //         easing.type: Easing.OutQuad
    //     }
    // }
  }


 // anchorToKeyboard: true


  property list<ContentItem> importItems

  PageStack {
    id: mainPageStack
    anchors.fill: parent
    Component.onCompleted: mainPageStack.push(pageMain)


    Page {
      id: pageMain
      anchors.fill: parent

      WebEngineView {
        zoomFactor: 2.5
        id: webview
        anchors{ fill: parent }
        focus: true
        property var currentWebview: webview
        settings.pluginsEnabled: true

        profile:  WebEngineProfile {
          id: webContext
          httpUserAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.144 Safari/537.36"
          storageName: "Storage"
          persistentStoragePath: "/home/phablet/.cache/alefnode.whatsweb/alefnode.whatsweb/QtWebEngine"
        }
        anchors {
          fill:parent
          centerIn: parent.verticalCenter
        }
        url: "https://web.whatsapp.com"
      // url: "https://www.bennish.net/web-notifications.html"
      // url: "https://librecalc.fr/test3.html"
        userScripts: [
          WebEngineScript {
            injectionPoint: WebEngineScript.DocumentCreation
            worldId: WebEngineScript.MainWorld
            name: "QWebChannel"
            sourceUrl: "ubuntutheme.js"
          }
          ]
        onFileDialogRequested: function(request) {
          request.accepted = true;
          var importPage = mainPageStack.push(Qt.resolvedUrl("ImportPage.qml"),{"contentType": ContentType.All, "handler": ContentHandler.Source})
          importPage.imported.connect(function(fileUrl) {
            console.log(String(fileUrl).replace("file://", ""));
            request.dialogAccept(String(fileUrl).replace("file://", ""));
            mainPageStack.push(pageMain)
          })
        }
        onNewViewRequested: {
            request.action = WebEngineNavigationRequest.IgnoreRequest
            if(request.userInitiated) {
                Qt.openUrlExternally(request.requestedUrl)
            }
        }
        onFeaturePermissionRequested: {
	    grantFeaturePermission(securityOrigin, feature, true);
        }
        onLoadingChanged: function(loadRequest) {
            if (loadRequest.status === WebEngineLoadRequest.LoadSucceededStatus) {
                webview.runJavaScript(`
                    (function() {
                        const OriginalNotification = window.Notification;
                        window.Notification = function(title, options) {
                            console.log("[MyNotifDebug] " + title);
                            return new OriginalNotification(title, options);
                        };
                        window.Notification.prototype = OriginalNotification.prototype;
                        Object.assign(window.Notification, OriginalNotification);
                    })();
                `);
            }
        }
        onTitleChanged: {
             // 1a. look for a number inside parentheses at start or end
            var match = title.match(/^\s*\((\d+)\)/);
            var unread = -1;
            if (match && match.length > 1) {
                unread = parseInt(match[1]);
            }
            if (unread>lastUnreadCount)
              notifier.showNotificationMessage(unread+" whatsapp message unread")
            if (unread != -1 )
              lastUnreadCount=unread
        }
        onJavaScriptConsoleMessage: function(level, message, line, sourceId) {
            if (message.startsWith("[MyNotifDebug]")) {
                // Nettoyer le message si nécessaire
                var cleanMsg = message.replace("[MyNotifDebug]", "").trim()

                // Appel direct vers C++ exposé (cf. plus haut)
                notifier.showNotificationMessage(cleanMsg)
            }
        }
      }
    
      
    }
  }
}
