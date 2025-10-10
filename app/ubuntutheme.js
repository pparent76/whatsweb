// ==UserScript==
// @name          WhatsApp (Responsive mode)
// @description	  WhatsApp web is now responsive
// @authors       Adrian Campos Garrido, Pierre Parent
// @version       20251009
// @include       https://*.whatsapp.com/*
// ==/UserScript==


const X = {
  //MainWrapper stuff (element class two)----------------------------------------------------
  mainWrapper: () => document.querySelector('.two'),  
    unkownSection1: () => document.querySelector('.two').childNodes[1],
      unkownSection2: () => document.querySelector('.two').childNodes[1].childNodes[0],  
    overlayMenus: () => document.querySelector('.two').childNodes[2],
      uploadPannel: () => document.querySelector('.two').childNodes[2].childNodes[1], //(to upload photos/videos/document)    
      leftSettingPannel: () => document.querySelector('.two').childNodes[2].childNodes[0], // leftMenus (Settings, status, community, profile, ...)
    chatList: () => document.querySelector('.two').childNodes[3],
    chatWindow: () => document.querySelector('.two').childNodes[4],
  //-------------------------------------------------------------------------------------------

  upperWrapper: () => document.querySelector('.three'),
    contactInfo: () => document.querySelector('.three').childNodes[5],
      
  leftMenu: () => document.querySelector('header'),

  
  smileyWrapper: () => document.getElementById('expressions-panel-container'),
  smileyPanel: () => document.querySelector('#expressions-panel-container > :first-child > :first-child'),
  
  newChatButton: () => document.querySelector('[data-icon="new-chat-outline"]').parentElement.parentElement,
  archivedChatButton: () => document.querySelector('#pane-side').childNodes[0], 
  
  //Landing elements (Only present temporarilly while whatsapp is loading)
  landingWrapper: () => document.querySelector('.landing-wrapper'),
  landingHeader: () => document.querySelector('.landing-header')
  
};

//-------------------------------------------------------------------------------------
//                             Quick ClipBoard code
//-------------------------------------------------------------------------------------

// Ensemble pour garder la trace des div déjà sélectionnées
var copiedMessage1;
var copiedMessage2;

document.addEventListener("touchend", () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (selectedText.length > 0) {
  const node = selection.anchorNode;
  const div = node?.nodeType === 1 ? node.closest("div") : node?.parentElement?.closest("div");
  
 
    if (div && !div.isContentEditable && copiedMessage1!=div&& copiedMessage2!=div) {
          copiedMessage1=div;
          copiedMessage2=div;
          const range = document.createRange();
          range.selectNodeContents(div);
          selection.removeAllRanges();
          selection.addRange(range);
          const originalHTML = div.innerHTML;
          div.querySelectorAll('img').forEach(img => {
              const altText = img.getAttribute('alt') || '';
              const textNode = document.createTextNode(altText);
            img.replaceWith(textNode);
          });          
          console.log("[ClipBoardCopy]" + window.getSelection().toString());
          div.innerHTML=originalHTML;
          selection.removeAllRanges();
    }
  }

  
});
    
    
// Declare variables
updatenotificacion = 0;
allownotification = 0;
var lastClickContact = 0;
var lastClickEditable = 0;

//-----------------------------------------------------
//Request by default webnofications permission
//-----------------------------------------------------
Notification.requestPermission();


//-----------------------------------------------------
//            Usefull functions
//-----------------------------------------------------
  function addCss(cssString) {
      var head = document.getElementsByTagName('head')[0];
      var newCss = document.createElement('style');
      newCss.type = "text/css";
      newCss.innerHTML = cssString;
      head.appendChild(newCss);
  }
  
// Listeners to startup APP
window.addEventListener("load", function(event) {
    console.log("Loaded");
    main();
});

document.addEventListener('readystatechange', event => {
    console.log(event.target.readyState);
    if (event.target.readyState === "complete") {
        console.log("Completed");
    }
});

//-----------------------------------------------------
//         First resize after loading the web 
//    (temporary timeout only running at the begining)
//------------------------------------------------------
var check = 0;
var checkExist = setInterval(function() {
  
  if (document.getElementById('app').getElementsByClassName('browser')[0]) {
    clean();
    location.reload();
  } else {
    if (X.landingWrapper()) {
      X.landingWrapper().style.minWidth = 'auto';
      X.landingHeader().style.display = 'none';
    }
    if (X.mainWrapper().childNodes.length) {
      console.log("Exists!");
      if ( check == 0 ) {
        clearInterval(checkExist);
        clean();
        main();
        check = 1;
      }
    }
  }
}, 1000);

//----------------------------------------------------------------------
//            Define all the functions to work on it
//           (Called one time when main app is loaded)
//----------------------------------------------------------------------
function main(){
  console.log("Call main function")
  X.overlayMenus().style.width="0";
  
  showchatlist();  
  X.chatList().style.minWidth = "100%"
  X.chatWindow().style.minWidth = "100%"  
   X.mainWrapper().style.minWidth = 'auto';
   X.mainWrapper().style.minHeight = 'auto';
   
  //Avoid opening the keyboard when entering a chat
  document.body.addEventListener('focusin', (event) => {
  const el = event.target;
    if ( lastClickEditable == 0 && el.isContentEditable)
    {
      el.blur();
    }
  });

  addLeftMenuButtonToChatList();
  
   if (X.leftMenu()) {
     X.leftMenu().style.display = 'none';
   }
    
  //Fix emoticons panel
  if (X.smileyWrapper()) {
    const observer = new MutationObserver((mutationsList) => {
          X.smileyPanel().style.transformOrigin = "left bottom"; 
          X.smileyPanel().style.transform= 'scale(0.7)';
          X.smileyPanel().style.left= '2%'; 
          setTimeout(() => {
          X.smileyPanel().style.transform= 'scale(0.7)';
          }, 300);
          setTimeout(() => {
          X.smileyPanel().style.transform= 'scale(0.7)';
          }, 1000);          
    });
    observer.observe(X.smileyWrapper(), { childList: true, subtree: true });
  }
  
  //Send theme information to mainView
  console.log("[ThemeBackgroundColorDebug]"+getComputedStyle(X.leftMenu()).getPropertyValue('--WDS-surface-default').trim());

  //Open menu for new chat list
  X.newChatButton().addEventListener('click', () => {
    if ( X.leftMenu().style.display == 'none' )
        toggleLeftMenu();
  });
  
  //Open menu for new chat list
  if (X.archivedChatButton().tagName.toLowerCase() === 'button') {
    X.archivedChatButton().addEventListener('click', () => {
      if ( X.leftMenu().style.display == 'none' )
          toggleLeftMenu();
    });  
  }
  
  //Request by default webnofications permission
  Notification.requestPermission();
}

//------------------------------------------------------------
//  Analize JS after every click on APP and execute Actions
//------------------------------------------------------------
window.addEventListener("click", function() {
    console.log("Click")
  
  lastClickEditable=0
  const grid = event.target.closest('[role="grid"]');
  if (grid) {
      if (lastClickContact==0)
      {
        showchatWindow();
        setTimeout(() => {
        addBackButtonToChatView();
          }, 200);

        setTimeout(() => {
        addBackButtonToChatView();
          }, 1500);        
      }
      lastClickContact=1
  }
  else
  {
      lastClickContact=0
      const el=event.target;
      if ( el && el.isContentEditable) 
      {
      lastClickEditable=1;
      }
  }

  // Handle contactInfo Openned panel
  if (X.upperWrapper() !== undefined){
    if (X.contactInfo() !== undefined){
      inchatcontactandgroupinfo();
    }
  }
  
  //For Quick Copy to ClipBoard system
  if ( lastClickContact != 1 )
  {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText.length == 0) {
      if (copiedMessage1) copiedMessage1 = null;
      else copiedMessage2 = null;
    }
  }

  
});

//------------------------------------------------------------------------------------
//          Function To display or hide left menu
//------------------------------------------------------------------------------------
function toggleLeftMenu(){
  if (X.leftMenu()) {
      if ( X.leftMenu().style.display == 'none' )
      {
        X.leftMenu().style.display = 'block';
        X.unkownSection2().style.minWidth = "90%"
        X.chatList().style.left= '';
        X.chatList().style.position= 'static';

        X.overlayMenus().style.width="100%";
        X.overlayMenus().style.minWidth = "90%"
        
        
        X.uploadPannel().style.width="";
        X.uploadPannel().style.minWidth="";   
        X.leftSettingPannel().style.display="";
        X.leftSettingPannel().style.maxWidth="85%";            
        X.leftSettingPannel().style.minWidth="85%";    
        
      }
      else
      {
        X.chatList().style.position= 'absolute';
        X.chatList().style.left= '0';
        X.overlayMenus().style.minWidth = "0%"
        X.overlayMenus().style.width="0%";
        setTimeout(() => {
           X.leftMenu().style.display = 'none';
           X.unkownSection2().style.minWidth = "100%"   
        }, 500);
        //Send theme information to mainView when closing menus
          console.log("[ThemeBackgroundColorDebug]"+getComputedStyle(X.leftMenu()).getPropertyValue('--WDS-surface-default').trim());
      }
  }
}

//------------------------------------------------------------------------------------
//          Function do add a button to access left menu
//                 inside main chat list header
//------------------------------------------------------------------------------------
function addLeftMenuButtonToChatList(){
    addCss(".added_menu_button span { display:block; height: 100%; width: 100%;}.added_menu_button {  z-index:500; width:50px; height:45px; } html[dir] .added_menu_button { border-radius:50%; } html[dir=ltr] .added_menu_button { right:11px } html[dir=rtl] .added_menu_button { left:11px } .added_menu_button path { fill:var(--panel-header-icon); fill-opacity:1 } .svg_back { transform: rotate(90deg); height: 100%;}");

    var newHTML         = document.createElement('div');
    newHTML.className += "added_menu_button";
    newHTML.style = "";
    newHTML.addEventListener("click", toggleLeftMenu);    
    newHTML.innerHTML   = '<a href="javascript:void(0);" ><span class="html-span" style="height:50px; width:60px;"><div class="html-div" style="padding:10px; --x-transform: none;"><div aria-expanded="false" aria-haspopup="menu" aria-label="MenuLeft" class=""><div class="html-div"><span aria-hidden="true" data-icon="more-refreshed" ><svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>more-refreshed</title><path d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z" fill="currentColor"></path></svg></span></div><div class="html-div" role="none" data-visualcompletion="ignore" style="inset: 0px;"></div></div></div></span></a>';
    
    //Insert it, TODO improve the way it is inserted
    document.querySelectorAll('header').forEach(header => {
        if (  header.querySelector('[data-icon="new-chat-outline"]') && ! header.querySelector('#added_menu_button') )
        {
         if ( header.firstChild.firstChild )
            header.firstChild.firstChild .style.width="calc(100% - 40px)";
          header.prepend(newHTML); 
        }
    });
}



//-----------------------------------------------------------------------------
//         Function to add a back button in chat view header
//              To go back to main chat list view
//----------------------------------------------------------------------------
function addBackButtonToChatView(){

    addCss(".back_button span { display:block; height: 100%; width: 100%;}.back_button {  z-index:200; width:37px; height:45px; } html[dir] .back_button { border-radius:50%; } html[dir=ltr] .back_button { right:11px } html[dir=rtl] .back_button { left:11px } .back_button path { fill:var(--panel-header-icon); fill-opacity:1 } .svg_back { transform: rotate(90deg); height: 100%;}");
    
    var newHTML         = document.createElement('div');
    newHTML.className += "back_button";
    newHTML.style = "";
    newHTML.addEventListener("click", showchatlist);
    newHTML.innerHTML   = "<span data-icon='left' id='back_button' ><svg class='svg_back' id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 21' width='21' height='21'><path fill='#000000' fill-opacity='1' d='M4.8 6.1l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z'></path></svg></span>";

    //Insert it, TODO improve the way it is inserted    
    document.querySelectorAll('header').forEach(header => {
        if (  header.querySelector('[data-icon="search-refreshed"]') && ! header.querySelector('#back_button') )
        {
          header.prepend(newHTML);
        }
    });
}


//-----------------------------------------------------------------------------
//         Function to show main chat list view
//----------------------------------------------------------------------------
function showchatlist(){
  //Make sure to unfocus any focused élément of previous view  
  document.activeElement.blur();
  
  //Slide back Chatlist panel to main view  
  X.chatList().style.transition= "left 0.30s ease-in-out";
  X.chatList().style.position= 'absolute';
  X.chatList().style.left= '0';

}

function showchatWindow(){
  //Make sure to unfocus any focused élément of previous view
   document.activeElement.blur();
   
   //Slide Chatlist panel to the left
   X.chatList().style.transition= "left 0.30s ease-in-out";
   X.chatList().style.position= 'absolute'; 
   X.chatList().style.left= "-100%";
   
  //Hide left menu (in case it was oppened)
   X.leftMenu().style.display = 'none';
   X.unkownSection2().style.minWidth = "100%"    
   X.overlayMenus().style.minWidth = "100%"
   X.overlayMenus().style.width="100%"; 
   
   //Activate Upload Panel, in case the user will upload some files
    X.uploadPannel().style.width="100%";
    X.uploadPannel().style.minWidth="100%";   
    X.leftSettingPannel().style.display="none"; 

}

//-----------------------------------------------------------------------------
//         Functions to handle contactInfo pannel
//----------------------------------------------------------------------------

function inchatcontactandgroupinfo(){
  // console.log("inchatcontactandgroupinfo")
  if (X.contactInfo()){
      //We need for this section to use absolute postion
      X.contactInfo().style.position= "absolute";
      X.contactInfo().style.width = "100%";
      X.contactInfo().style.maxWidth = "100%";  
      X.contactInfo().style.pointerEvents="none";
  }
}



//-----------------------------------------------------------------------------
//                           Clean
//----------------------------------------------------------------------------

function clean() {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
          registration.unregister()
  }}).catch(function(err) {
      console.log('Service Worker registration failed: ', err);
  });
}


//-----------------------------------------------------------------------
//                     End of main thing
//-----------------------------------------------------------------------

//-----------------------------------------------------------------------
//              Detect Audio évents to trigger Notifications
//-----------------------------------------------------------------------
(function() {
  if (window.__my_audio_hook_installed) return;
  window.__my_audio_hook_installed = true;

  function logAudioEvent(info) {
    try {
      console.log("[DbgAud] " + info);
    } catch (e) { /* safe */ }
  }

  // 1) Intercepter constructeur Audio (alias de HTMLAudioElement)
  try {
    const OrigAudio = window.Audio;
    window.Audio = function(src) {
      const a = new OrigAudio(src);
      // attach listeners to catch play
      a.addEventListener('play', function(){ logAudioEvent((a.currentSrc || a.src || "")); }, {passive:true});
      a.addEventListener('playing', function(){ logAudioEvent((a.currentSrc || a.src || "")); }, {passive:true});
      return a;
    };
    // preserve prototype / static props
    window.Audio.prototype = OrigAudio.prototype;
    Object.getOwnPropertyNames(OrigAudio).forEach(function(k){
      try { if (!(k in window.Audio)) window.Audio[k] = OrigAudio[k]; } catch(e){}
    });
  } catch(e) {}

  // 2) Intercepter HTMLAudioElement / HTMLMediaElement.play
  try {
    const mp = HTMLMediaElement && HTMLMediaElement.prototype;
    if (mp && !mp.__play_hooked__) {
      const origPlay = mp.play;
      mp.__play_hooked__ = true;
      mp.play = function() {
        try {
          const src = this.currentSrc || this.src || "";
          logAudioEvent( src);
        } catch(e){}
        return origPlay.apply(this, arguments);
      }
    }
  } catch(e){}

})();
