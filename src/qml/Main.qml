import QtQuick 2.9
import Ubuntu.Components 1.3
import QtQuick.Window 2.2
import Morph.Web 0.1
import "UCSComponents"
import QtWebEngine 1.9
import Qt.labs.settings 1.0
import QtSystemInfo 5.5
import Ubuntu.Components.ListItems 1.3 as ListItemm
import Ubuntu.Content 1.3


MainView {
  id: mainView
  property int lastUnreadCount: -1;
  property var lastNotifyTimestamp: 0;  

//Function to allow notification while avoiding flooding at the same time
function notifyOnce(msg) {
    var currentTimestamp=Date.now();  // timestamp en millisecondes
      if (currentTimestamp - lastNotifyTimestamp > 5000) {
          lastNotifyTimestamp=currentTimestamp;  
          notifier.showNotificationMessage(msg);
      }
}

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

      
      
      //Webview-----------------------------------------------------------------------------------------------------
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
          //----------------------------------------------------------------------
          //           Notification based on web desktop notifications
          //----------------------------------------------------------------------   
          onPresentNotification: (notification) => {
                 notifyOnce(notification.title + " : " + notification.message);
          }
        }//End WebEngineProfile
        
        
        anchors {
          fill:parent
          centerIn: parent.verticalCenter
        }
       url: "https://web.whatsapp.com"
      //url: "https://www.bennish.net/web-notifications.html"
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
        //----------------------------------------------------------------------
        //           Notification based on title changed
        //----------------------------------------------------------------------        
        onTitleChanged: {
             // 1a. look for a number inside parentheses at start or end
            var match = title.match(/^\s*\((\d+)\)/);
            var unread = -1;
            if (match && match.length > 1) {
                unread = parseInt(match[1]);
            }
            if ( unread>lastUnreadCount && unread>0  )
              notifyOnce(unread+" whatsapp message unread")
            lastUnreadCount=unread
        }
        //----------------------------------------------------------------------
        //           Notification based on audio sound file played
        //----------------------------------------------------------------------
        onJavaScriptConsoleMessage: function(level, message, line, sourceId) {
            
            if (message.startsWith("[DbgAud]")) {
                // Avoid catching audio messages played in conversation by user
                if (message.contains("static") || !message.contains("blob"))
                {
                  notifyOnce(message);
                  notifyOnce("New Whatsapp Audio Notification");
                }
            }
        }
        
        
      } //End webview--------------------------------------------------------------------------------------------
    
      
    }
  }
}
