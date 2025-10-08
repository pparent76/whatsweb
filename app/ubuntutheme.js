// ==UserScript==
// @name          WhatsApp (Responsive mode)
// @namespace     http://blog.alefnode.com
// @description	  Whats App is now responsive
// @author        Adrian Campos Garrido
// @version       20240930
// @include       https://*.whatsapp.com/*
// ==/UserScript==


const X = {
  chatList: () => document.querySelector('.two').childNodes[3],
  chatWindow: () => document.querySelector('.two').childNodes[4],
  leftMenu: () => document.querySelector('header'),
  contactInfo: () => document.getElementById("app").getElementsByClassName('three')[0].childNodes[5],
  smileyPanel: () => document.querySelector('#expressions-panel-container > :first-child > :first-child'),
  settingMenus: () => document.querySelector('.two').childNodes[2]
// ?????= document.querySelector('.two').childNodes[1]  
// ?????= document.getElementById('app').getElementsByClassName('two')[0]
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
  
  function addJS(jsString) {
      var head = document.getElementsByTagName('head')[0];
      var newJS = document.createElement('script');
      newJS.innerHTML = jsString;
      head.appendChild(newJS);
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
    if (document.getElementById('app').getElementsByClassName('landing-wrapper').length) {
      document.getElementById('app').getElementsByClassName('landing-wrapper')[0].style.minWidth = 'auto';
      document.getElementById('app').getElementsByClassName('landing-header')[0].style.display = 'none';
    }
    if (document.querySelector('.two').childNodes.length) {
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
 // X.chatList().style.display = 'none';
  // document.querySelector('.two').childNodes[1].childNodes[2].style.display = 'none';
  X.settingMenus().style.width="0";
  
  showchatlist();  
  X.chatList().style.minWidth = "100%"
  X.chatWindow().style.minWidth = "100%"  
   document.getElementById('app').getElementsByClassName('two')[0].style.minWidth = 'auto';
   document.getElementById('app').getElementsByClassName('two')[0].style.minHeight = 'auto';
//   
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
   
  // Resize Profile and Settings menu
 // document.querySelector('.two').childNodes[1].childNodes[0].style.minWidth = "100%"
    
  //Fix emoticons panel
  const container = document.getElementById('expressions-panel-container');
  if (container) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        
          X.smileyPanel().style.transform= 'scale(0.7)';
          X.smileyPanel().style.left= '2%'; 
          setTimeout(() => {
          X.smileyPanel().style.transformOrigin = "left bottom"; 
          X.smileyPanel().style.transform= 'scale(0.7)';
          X.smileyPanel().style.left= '2%'; 
        
        }, 300);
      }
    });
    observer.observe(container, { childList: true, subtree: true });
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
  if (document.getElementById("app").getElementsByClassName('three')[0] !== undefined){
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
        document.querySelector('.two').childNodes[1].childNodes[0].style.minWidth = "90%"
        X.chatList().style.left= '';
        X.chatList().style.position= 'static';

        document.getElementById('app').getElementsByClassName('two')[0].style.minWidth = '';
        document.getElementById('app').getElementsByClassName('two')[0].style.minHeight = '';
        X.settingMenus().style.width="100%";
        X.settingMenus().style.minWidth = "90%"
        
      }
      else
      {
        document.getElementById('app').getElementsByClassName('two')[0].style.minWidth = 'auto';
        document.getElementById('app').getElementsByClassName('two')[0].style.minHeight = 'auto';
        X.chatList().style.position= 'absolute';
        X.chatList().style.left= '0';
        X.settingMenus().style.minWidth = "0%"
        X.settingMenus().style.width="0%";
        setTimeout(() => {
           X.leftMenu().style.display = 'none';
           document.querySelector('.two').childNodes[1].childNodes[0].style.minWidth = "100%"   
        }, 500);
  
      }
  }
}

//------------------------------------------------------------------------------------
//          Function do add a button to access left menu
//                 inside main chat list header
//------------------------------------------------------------------------------------
function addLeftMenuButtonToChatList(){
    addCss(".added_menu_button span { display:block; height: 100%; width: 100%;}.added_menu_button {  z-index:500; width:50px; height:45px; } html[dir] .added_menu_button { border-radius:50%; } html[dir=ltr] .added_menu_button { right:11px } html[dir=rtl] .added_menu_button { left:11px } .added_menu_button path { fill:#000000; fill-opacity:1 } .svg_back { transform: rotate(90deg); height: 100%;}");

    var newHTML         = document.createElement('div');
    newHTML.className += "added_menu_button";
    newHTML.style = "";
    newHTML.addEventListener("click", toggleLeftMenu);    
    newHTML.innerHTML   = '<a href="javascript:void(0);" ><span class="html-span" style="height:50px; width:60px;"><div class="html-div" style="padding:10px; --x-transform: none;"><div aria-expanded="false" aria-haspopup="menu" aria-label="MenuLeft" class=""><div class="html-div"><span aria-hidden="true" data-icon="more-refreshed" ><svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>more-refreshed</title><path d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z" fill="currentColor"></path></svg></span></div><div class="html-div" role="none" data-visualcompletion="ignore" style="inset: 0px;"></div></div></div></span></a>';
    
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

    addCss(".back_button span { display:block; height: 100%; width: 100%;}.back_button {  z-index:200; width:37px; height:45px; } html[dir] .back_button { border-radius:50%; } html[dir=ltr] .back_button { right:11px } html[dir=rtl] .back_button { left:11px } .back_button path { fill:#000000; fill-opacity:1 } .svg_back { transform: rotate(90deg); height: 100%;}");
    
    var newHTML         = document.createElement('div');
    newHTML.className += "back_button";
    newHTML.style = "";
    newHTML.addEventListener("click", showchatlist);
    newHTML.innerHTML   = "<span data-icon='left' id='back_button' ><svg class='svg_back' id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 21' width='21' height='21'><path fill='#000000' fill-opacity='1' d='M4.8 6.1l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z'></path></svg></span>";

    document.querySelectorAll('header').forEach(header => {
        if (  header.querySelector('[data-icon="search-refreshed"]') && ! header.querySelector('#back_button') )
          header.prepend(newHTML); 
    });
}


//-----------------------------------------------------------------------------
//         Function to show main chat list view
//----------------------------------------------------------------------------
function showchatlist(){
   document.activeElement.blur();
  
   //X.chatList().style.visibility = 'visible';
  X.chatList().style.transition= "left 0.30s ease-in-out";
   X.chatList().style.position= 'absolute';
   X.chatList().style.left= '0';

}

function showchatWindow(){
   document.activeElement.blur();
  
   //X.chatList().style.visibility = 'hidden'; 
   X.chatList().style.transition= "left 0.30s ease-in-out";
   X.chatList().style.position= 'absolute'; 
   X.chatList().style.left= "-100%";
   
  //Hide left menu
   X.leftMenu().style.display = 'none';
   document.querySelector('.two').childNodes[1].childNodes[0].style.minWidth = "100%"    
   document.getElementById('app').getElementsByClassName('two')[0].style.minWidth = 'auto';
   document.getElementById('app').getElementsByClassName('two')[0].style.minHeight = 'auto';
   X.settingMenus().style.minWidth = "0%"
   X.settingMenus().style.width="0%";   

}

//-----------------------------------------------------------------------------
//         Functions to handle contactInfo pannel
//----------------------------------------------------------------------------

function inchatcontactandgroupinfo(){
  // console.log("inchatcontactandgroupinfo")
  if (X.contactInfo()){
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
      // try {
      //   // log creation + src
      //  // logAudioEvent("Audio constructed src=" + (src || ""));
      // } catch(e){}
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
      };
      // also listen to src changes (attribute)
      const origSetAttribute = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, value) {
        try {
          if ((this.tagName || "").toLowerCase() === "audio" && name === "src") {
            logAudioEvent(value);
          }
        } catch(e){}
        return origSetAttribute.apply(this, arguments);
      };
      // intercept setting .src
      try {
        const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
        if (desc && desc.set && !desc.set.__hooked__) {
          const origSetter = desc.set;
          desc.set = function(v) {
            try { logAudioEvent(v); } catch(e){}
            return origSetter.call(this, v);
          };
          Object.defineProperty(HTMLMediaElement.prototype, 'src', desc);
          desc.set.__hooked__ = true;
        }
      } catch(e){}
    }
  } catch(e){}

  // 3) Intercepter WebAudio: AudioContext.prototype.createBufferSource + start()
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      const origCreate = AC.prototype.createBufferSource;
      AC.prototype.createBufferSource = function() {
        const srcNode = origCreate.apply(this, arguments);
        try {
          const origStart = srcNode.start;
          srcNode.start = function(/*when, offset, duration*/) {
            try {
              // attempt to describe the buffer (duration) or associated info
              const dur = srcNode.buffer ? srcNode.buffer.duration : "unknown";
              logAudioEvent("WebAudio start bufferDuration=" + dur);
            } catch(e){}
            return origStart.apply(this, arguments);
          };
        } catch(e){}
        return srcNode;
      };
    }
  } catch(e){}

  // 4) MutationObserver to catch dynamically added <audio> elements
  try {
    const mo = new MutationObserver(function(mutations) {
      for (const m of mutations) {
        for (const n of m.addedNodes || []) {
          try {
            if (n && n.tagName && n.tagName.toLowerCase() === 'audio') {
              const a = n;
              logAudioEvent( (a.currentSrc || a.src || ""));
              a.addEventListener('play', function(){ logAudioEvent((a.currentSrc||a.src||"")); }, {passive:true});
            }
          } catch(e){}
        }
      }
    });
    mo.observe(document, { childList: true, subtree: true });
  } catch(e){}

  // 5) Optional: intercept creation via createElement
  try {
    const origCreate = Document.prototype.createElement;
    Document.prototype.createElement = function(tagName) {
      const node = origCreate.apply(this, arguments);
      try {
        if ((tagName||"").toLowerCase() === 'audio') {
          node.addEventListener('play', function(){ logAudioEvent(  (node.currentSrc||node.src||"")); }, {passive:true});
        }
      } catch(e){}
      return node;
    };
  } catch(e){}
})();
