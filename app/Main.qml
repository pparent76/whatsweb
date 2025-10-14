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
import Pparent.DownloadHelper 1.0  


MainView {
  id: mainView
  
  property var appID: "whatsweb.pparent";
  property var hook: "whatsweb";  
  property var localStorage: "/home/phablet/.cache/whatsweb.pparent/QtWebEngine";  
  
  
  property int lastUnreadCount: -1;
  property var lastNotifyTimestamp: 0;  

    
 DownloadHelper {
        id: downloadHelper
        blob_path: localStorage+"/IndexedDB/https_web.whatsapp.com_0.indexeddb.blob/"
    }   
    
    
 Notifier {
    id: notifier
     push_app_id: appID + "_" + hook
 }


  objectName: "mainView"
  //theme.name: "Ubuntu.Components.Themes.SuruDark"
  applicationName: appID
  backgroundColor : "transparent"


  property list<ContentItem> importItems

  
  ScreenSaver {
    id: screenSaver
    screenSaverEnabled: !(Qt.application.active)
  }
  
  PageStack {
    id: mainPageStack
    anchors.fill: parent
    Component.onCompleted: mainPageStack.push(pageMain)


    Page {
      id: pageMain
      anchors.fill: parent
      
      
      ScreenSaverView {
          id: screenSaverView
      }
      
      //Webview-----------------------------------------------------------------------------------------------------
      WebEngineView {
        id: webview
        audioMuted: !Qt.application.active
        visible: Qt.application.active
        property int keyboardSize: UbuntuApplication.inputMethod.visible ? 10+UbuntuApplication.inputMethod.keyboardRectangle.height/(units.gridUnit / 8) : 0
        anchors{ fill: parent }
        focus: true
        property var currentWebview: webview
        settings.pluginsEnabled: true
        zoomFactor: mainView.width<mainView.height ? Math.round(100 * mainView.width / 410 ) / 100 : Math.round(100 * mainView.width / 900 ) / 100
        
        onKeyboardSizeChanged: {
        // Échapper correctement les quotes si nécessaire
        var realKeyboardSize=keyboardSize/zoomFactor
        const jsCode = `document.querySelector('footer').style.paddingBottom = "${realKeyboardSize}px"`;
        webview.runJavaScript(jsCode);
        }
        
        profile:  WebEngineProfile {
          id: webContext
          httpUserAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.144 Safari/537.36"
          storageName: "Storage"
          persistentStoragePath: localStorage
          //----------------------------------------------------------------------
          //  Notification based on web desktop notifications (Higher priority)
          //----------------------------------------------------------------------   
          onPresentNotification: (notification) => {
                notifier.notifyMain(notification.title, notification.message);
          }
          
          onDownloadRequested: {
              //Not working for now in Qt5
          }
        
        }//End WebEngineProfile
        
  
        
        anchors {
          fill:parent
          centerIn: parent.verticalCenter
        }
       url: "https://web.whatsapp.com"
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
            console.log(String(fileUrl).replace("file://", ""))
            request.dialogAccept(String(fileUrl).replace("file://", ""));
            mainPageStack.pop(importPage)
          })
          importPage.cancel.connect(function() {
            request.dialogAccept("")
            mainPageStack.pop(importPage)
          })          
        }
        onNewViewRequested: {
            request.action = WebEngineNavigationRequest.IgnoreRequest
            //toast.show(request.requestedUrl);
            if(request.userInitiated) {
                Qt.openUrlExternally(request.requestedUrl)
            }
        }
        onFeaturePermissionRequested: {
	    grantFeaturePermission(securityOrigin, feature, true);
        }
        //----------------------------------------------------------------------
        //   Notification based on title changed (medium priority)
        //----------------------------------------------------------------------        
        onTitleChanged: {
             // 1a. look for a number inside parentheses at start or end
            var match = title.match(/^\s*\((\d+)\)/);
            var unread = -1;
            if (match && match.length > 1) {
                unread = parseInt(match[1]);
            }
            if ( unread>lastUnreadCount && unread>0  )
            {
              notifier.triggerDelayedNotification2(unread+" whatsapp message unread");
            }
            lastUnreadCount=unread
            if (unread > 0)
              notifier.updateCount(unread)
            else
              notifier.updateCount(0)
        }
        


        onJavaScriptConsoleMessage: function(level, message, line, sourceId) {
          //----------------------------------------------------------------------------
          //  Notification based on audio sound file played (Low priority)
          //---------------------------------------------------------------------------
            if (message.startsWith("[DbgAud] https://static.whatsapp.net/")) {
                //Send notification in 50ms through timer1
                notifier.triggerDelayedNotification1("New Whatsapp audio notification");
            }
            if (message.startsWith("[ClipBoardCopy]")) {
                //Send notification in 50ms through timer1
                textEdit.text = message.replace(/^\[ClipBoardCopy\]\s*/, "")
                //textEdit.text = message
                textEdit.selectAll()
                textEdit.copy()
                toast.show("Message copied!")
            }
            if (message.startsWith("[ShowDebug]")) {
                toast.show(message.replace(/^\[ShowDebug\]\s*/, ""))
            }  
            
            //Handle Download when Js tells us a file has been saved to local storage
            if (message.startsWith("[DownloadBlob]")) {
                let output = downloadHelper.getLastDownloaded()
                var exportPage = mainPageStack.push(Qt.resolvedUrl("ExportPage.qml"),{"url": Qt.resolvedUrl("file://"+output),"contentType": ContentType.All})
            } 
            
            if (message.startsWith("[ThemeBackgroundColorDebug]")) {
              
              
              if ( message.replace(/^\[ThemeBackgroundColorDebug\]\s*/, "") == "#FFFFFF" )
              {
               screenSaverView.backgroundSource="Backgrounds/screensaver.png";
              }
              else
               screenSaverView.backgroundSource="Backgrounds/screensaver-black.png" ;
            }
        }
        
 

      } //End webview--------------------------------------------------------------------------------------------
      

      //Dummy textedit to me able to copy to ClipBoard
     TextEdit{
        id: textEdit
        visible: false
      }
      
    Toast {
    id: toast
    }

      
    }
    
  }
}
