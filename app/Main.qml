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
import Pparent.Notifications 1.0


MainView {
  id: mainView
  property int lastUnreadCount: -1;
  property var lastNotifyTimestamp: 0;  

  //Object from notification module
  NotificationHelper {
        id: notifier
        push_app_id:"whatsweb.pparent_whatsweb"
  }
    
  //Function to allow notification while avoiding flooding at the same time
  function notifyBackup(title,msg) {
      var currentTimestamp=Date.now();  // timestamp en millisecondes
        if (currentTimestamp - lastNotifyTimestamp > 5000) {
            //Send notifications only if app is not active
            if (!(Qt.application.active))
            {
              lastNotifyTimestamp=currentTimestamp;  
              notifier.showNotificationMessage(title,msg);
            }
        }
  }
  
  function notifyMain(title,msg) {
      if (!(Qt.application.active))
      { 
        lastNotifyTimestamp=Date.now();  // timestamp en millisecondes
        notifier.showNotificationMessage(title,msg);
      }
  }  


  Timer {
    id: timer1
    running: false
    repeat: false
    interval: 2000
    onTriggered: function() {
    notifyBackup("New Whatsapp Audio Notification","")
    timer1.running = false;
    }
  }
  
  Timer {
    id: timer2
    running: false
    repeat: false
    interval: 1100
    property string msg: "notif"    
    onTriggered: function() {
    notifyBackup(msg,"")
    timer2.running = false;
    }
  }


  ScreenSaver {
    id: screenSaver
    screenSaverEnabled: !(Qt.application.active)
  }
  objectName: "mainView"
  //theme.name: "Ubuntu.Components.Themes.SuruDark"
  applicationName: "whatsweb.pparent"
  backgroundColor : "transparent"


  property list<ContentItem> importItems

  PageStack {
    id: mainPageStack
    anchors.fill: parent
    Component.onCompleted: mainPageStack.push(pageMain)


    Page {
      id: pageMain
      anchors.fill: parent
      

    Rectangle {
        visible: !Qt.application.active
        anchors.fill: parent
        color: "#f0f0f0"  // gris très clair
        Image {
            id: screensaverBackground
            source: "../screensaver.png"  // Mets ici ton icône
            anchors.centerIn: parent

            // 50% de la largeur de l'écran
            width: parent.width
            height: parent.height  // Pour rester carré
            
        }
        Image {
            id: icon
            source: "../icon-splash.png"  // Mets ici ton icône
            anchors.centerIn: parent

            // 50% de la largeur de l'écran
            width: parent.width * 0.5
            height: width  // Pour rester carré

            fillMode: Image.PreserveAspectFit
        }
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
        
        onKeyboardSizeChanged: {
        // Échapper correctement les quotes si nécessaire
        const jsCode = `document.querySelector('footer').style.paddingBottom = "${keyboardSize}px"`;
        webview.runJavaScript(jsCode);
        }
        
        profile:  WebEngineProfile {
          id: webContext
          httpUserAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.144 Safari/537.36"
          storageName: "Storage"
          downloadPath: "/home/phablet/.cache/whatsweb.pparent/Download/"
          persistentStoragePath: "/home/phablet/.cache/whatsweb.pparent/QtWebEngine"
          //----------------------------------------------------------------------
          //  Notification based on web desktop notifications (Higher priority)
          //----------------------------------------------------------------------   
          onPresentNotification: (notification) => {
                 notifyMain(notification.title, notification.message);
          }
          
          onDownloadRequested: {
                //toast.show("Téléchargement demandé : " + downloadItem.url)
                // On choisit un chemin temporaire
                //downloadItem.path = "/home/phablet/.cache/whatsweb.pparent/Download/" + downloadItem.downloadFileName
                downloadItem.accept()
                //downloadItem.finished.connect(function() {
                //console.log("Téléchargement terminé :", downloadItem.path)
                //Qt.openUrlExternally("file://" + downloadItem.path)
                //})
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
            toast.show(String(fileUrl).replace("file://", ""));
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
        //   Notification based on title changed (Medium priority wait 100ms)
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
              //Send notification in 25ms through timer2
              timer2.msg = unread+" whatsapp message unread";
              timer2.running = true;
            }
            lastUnreadCount=unread
            if (unread > 0)
              notifier.updateCount(unread)
            else
              notifier.updateCount(0)
        }
        //----------------------------------------------------------------------------
        //  Notification based on audio sound file played (LOWER PRIORITY wait 300ms)
        //----------------------------------------------------------------------------
        onJavaScriptConsoleMessage: function(level, message, line, sourceId) {
            
            if (message.startsWith("[DbgAud] https://static.whatsapp.net/")) {
                //Send notification in 50ms through timer1
                timer1.running = true;
            }
            if (message.startsWith("[ClipBoardCopy]")) {
                //Send notification in 50ms through timer1
                textEdit.text = message.replace(/^\[ClipBoardCopy\]\s*/, "")
                //textEdit.text = message
                textEdit.selectAll()
                textEdit.copy()
                toast.show("Message copied to clipboard!")
            }
            if (message.startsWith("[ShowDebug]")) {
                toast.show(message.replace(/^\[ShowDebug\]\s*/, ""))
            }            
        }
        
      } //End webview--------------------------------------------------------------------------------------------
     TextEdit{
        id: textEdit
        visible: false
      }
Rectangle {
    id: toast
    radius: 8
    color: "#d9fdd3"
    z:100
    opacity: 0
    visible: false
    anchors.bottom: parent.bottom
    anchors.left: parent.left 
    anchors.bottomMargin: 14
    anchors.leftMargin: 100
   // La taille s'adapte automatiquement au texte
    implicitWidth: toastRow.width + 24
    implicitHeight: toastRow.height + 3

    Row {
        id: toastRow
        anchors.centerIn: parent
        spacing: 7 // espace entre icône et texte
        padding: 12

        Image {
            id: toastIcon
            source: Qt.resolvedUrl("Icons/check.png")  // ton icône ici
            width: 20
            height: 20
            visible: source !== ""
        }

        Text {
            id: toastText
            color: "black"
            font.pixelSize: 14
            font.bold: true
        }
    }

    Behavior on opacity {
        NumberAnimation { duration: 300 }
    }

    Timer {
        id: timer
        repeat: false
        interval: 2000
        onTriggered: { toast.opacity = 0; Qt.callLater(() => toast.visible = false) }
    }

    function show(msg) {
        toastText.text = msg
        toast.visible = true
        toast.opacity = 1
        timer.restart()
        shown()
    }
  }
      
    }
    
  }
}
