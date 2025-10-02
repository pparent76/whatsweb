// ==UserScript==
// @name          WhatsApp (Responsive mode)
// @namespace     http://blog.alefnode.com
// @description	  Whats App is now responsive
// @author        Adrian Campos Garrido
// @version       20240930
// @include       https://*.whatsapp.com/*
// ==/UserScript==

// Declare variables
updatenotificacion = 0;
allownotification = 0;
var lastClickContact = 0;


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

// First resize after loading the web
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
    if (document.getElementById("app").getElementsByClassName('two')[0].childNodes.length) {
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

// Analize JS after every click on APP and execute Actions
window.addEventListener("click", function() {
  console.log("Click");
  
  const grid = event.target.closest('[role="grid"]');
  if (grid) {
      lastClickContact=1
      document.getElementById("app").getElementsByClassName('two')[0].childNodes[4].style.display = '';      
      document.getElementById("app").getElementsByClassName('two')[0].childNodes[3].style.display = 'none';
      menu();
  }
  else
  {
      lastClickContact=0
  }
  //if (document.getElementById("app").getElementsByClassName('two')[0].childNodes[2].style.display == 'none') {
  //  navigation();
  //}
	
  // First if to resize when sending a file/image/video/document
  if (document.querySelector('input[accept="image/*,video/mp4,video/3gpp,video/quicktime"]')){
    console.log("Adjust attachment width");
    document.getElementById("app").getElementsByClassName('two')[0].childNodes[1].childNodes[0].style.minWidth = "";
    document.getElementById("app").getElementsByClassName('two')[0].childNodes[1].childNodes[0].style.flex= "0 0 0";
    document.getElementById("app").getElementsByClassName('two')[0].childNodes[1].childNodes[1].style.minWidth = "90%";
  } else if (document.querySelector('input[accept="image/*,video/mp4,video/3gpp,video/quicktime"]') == null && document.getElementById("app").getElementsByClassName('two')[0] !== undefined){
    console.log("Restore profile width");
    // Restore Profile and Settings menu
    document.getElementById("app").getElementsByClassName('two')[0].childNodes[1].childNodes[0].style.minWidth = "100%";
    document.getElementById("app").getElementsByClassName('two')[0].childNodes[1].childNodes[0].style.flex= "0 0 45%";
    document.getElementById("app").getElementsByClassName('two')[0].childNodes[1].childNodes[1].style.minWidth = "";
  } 

  if (document.getElementById("app").getElementsByClassName('three')[0] !== undefined){
    if (document.getElementById("app").getElementsByClassName('three')[0].childNodes[5] !== undefined){
      inchatcontactandgroupinfo();
    }
  }
  if (document.getElementById("app").getElementsByClassName('two')[0] !== undefined){
    //variable para el menu "inchatcontactandgroupinfo"
  	const inchatelements = document.getElementById("app").getElementsByClassName('two')[0].childNodes;
    if (inchatelements.length >= 5){
      restoreinchatcontactandgroupinfo();
    }
  }
  
  
  //if (updatenotificacion == 0 || allownotification == 0){
  //  disablenotifications();
  //}
  
});

// Define all the functions to work on it
function main(){
  console.log("Call main function")
  document.getElementById("app").getElementsByClassName('two')[0].childNodes[4].style.display = 'none';
  // document.getElementById("app").getElementsByClassName('two')[0].childNodes[1].childNodes[2].style.display = 'none';
  document.getElementById("app").getElementsByClassName('two')[0].childNodes[2].style.width = "0%"
  document.getElementById("app").getElementsByClassName('two')[0].childNodes[3].style.minWidth = "100%"
  document.getElementById('app').getElementsByClassName('two')[0].style.minWidth = 'auto';
  document.getElementById('app').getElementsByClassName('two')[0].style.minHeight = 'auto';
  
   if (document.querySelector('header')) {
     document.querySelector('header').style.display = 'none';
   }
   
  // Resize Profile and Settings menu
  document.getElementById("app").getElementsByClassName('two')[0].childNodes[1].childNodes[0].style.minWidth = "100%"

  // document.getElementById("pane-side").addEventListener('click', function(event) {
  //   // Aquí encontramos el DIV más cercano al evento de clic
  //   var clickedDiv = event.target.closest('div');
  // 
  //   // Verificamos si el clic ocurrió en un DIV específico
  //   if (clickedDiv) {
  //     // Aquí puedes hacer algo con el div que capturaste
  //     document.getElementById("app").getElementsByClassName('two')[0].childNodes[3].style.display = 'none';
  //     document.getElementById("app").getElementsByClassName('two')[0].childNodes[4].style.display = '';
  //     menu();
  //   }
  // });
  
  //disablenotifications();
  
  //Avoid opening the keyboard when entering a chat
  document.body.addEventListener('focusin', (event) => {
  const el = event.target;
  if (lastClickContact==1)
    el.blur();
  });

    
}


function navigation() {
  var check = 0;
  var checkExist = setInterval(function() {
    if (document.getElementById("app").getElementsByClassName('two')[0].childNodes[3].style.display === null) {
      console.log("Exists!");
      if ( check == 0 ) {
        clearInterval(checkExist);
        menu();
      }
      check = 1;
    }
  }, 200); 
}

function menu(){

  console.log("Call menu function")
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

  check = 0;
  if ( check == 0 ) {
    addCss(".back_button span { display:block; height: 100%; width: 100%;}.back_button {  z-index:200; width:37px; height:45px; } html[dir] .back_button { border-radius:50%; } html[dir=ltr] .back_button { right:11px } html[dir=rtl] .back_button { left:11px } .back_button path { fill:#000000; fill-opacity:1 } .svg_back { transform: rotate(90deg); height: 100%;}");
    
  	addJS('window.onscroll = function() {myFunction()}; var navbar = document.getElementById("navbar"); var sticky = navbar.offsetTop; function myFunction() { if (window.pageYOffset >= sticky) { navbar.classList.add("sticky") } else { navbar.classList.remove("sticky"); } } ');

    var newHTML         = document.createElement('div');
    newHTML.className += "back_button";
    newHTML.style = "";
    newHTML.addEventListener("click", showchatlist);
    newHTML.innerHTML   = "<span data-icon='left' id='back_button' ><svg class='svg_back' id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 21' width='21' height='21'><path fill='#000000' fill-opacity='1' d='M4.8 6.1l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z'></path></svg></span>";

    // var eElement = document.getElementById("main").childNodes[1];
    // eElement.insertBefore(newHTML, eElement.firstChild);
    document.querySelectorAll('header').forEach(header => {
        // Exemple d'action : changer le background
        if (  header.querySelector('[data-icon="search-refreshed"]') && ! header.querySelector('#back_button') )
          header.prepend(newHTML); 
        // Tu peux mettre ici n'importe quelle action sur chaque header
    });
    check = check + 1;
  }

}

function showchatlist(){
  document.getElementById("app").getElementsByClassName('two')[0].childNodes[3].style.display = 'block';
  document.getElementById("app").getElementsByClassName('two')[0].childNodes[4].style.display = 'none'; 
}

//function disablenotifications(){
  // // Disable update available notification
  // if (document.querySelector('span[data-icon="alert-update"]')) {
  //   document.querySelector('span[data-icon="alert-update"]').parentElement.parentElement.style.display = 'none';
  //   console.log("Disabled update available notification");
  //   updatenotification = 1;
  // }
  // // Disable request to allow notifications
  // if (document.querySelector('span[data-icon="alert-notification"]')) {
  //   document.querySelector('span[data-icon="alert-notification"]').parentElement.parentElement.style.display = 'none'; 
  //   console.log("Disabled request allow notification");
  //   allownotification = 1;
  // }
//}

// function modaldialogresponsive(){
//   if (document.querySelector('[data-animate-dropdown-item]')){
//     var check = 0;
//     var checkExist = setInterval(function() {
//      	if (document.querySelector("[data-animate-modal-backdrop]")) {
//        	// Delete min-width class to center dialog message
//       	document.querySelector("[data-animate-modal-backdrop]").childNodes[0].style.minWidth = "0px";
//         
//       	if ( check == 0 ) {
//         	clearInterval(checkExist);
//         }
//       }
//       check = 1;
//   	}, 300);
// 	} else {
//     document.querySelector("[data-animate-modal-backdrop]").childNodes[0].style.minWidth = "";
//   }
// }

// function startnewchat(){
//   var elems = document.querySelector('[data-testid="contact-list-key"]').getElementsByTagName("DIV");
//   for (var i = 0; i<elems.length; i++) {
//     elems[i].onclick = function() {
// 
//       document.getElementById("app").getElementsByClassName('two')[0].childNodes[2].childNodes[1].style.display = '';
//       document.getElementById("app").getElementsByClassName('two')[0].childNodes[4].style.display = '';
//       document.getElementById("app").getElementsByClassName('two')[0].childNodes[3].style.display = 'none';
//       menu();
// 
//     };
//   }
// }

function settingspanel(){
  if (document.querySelector('[data-testid="settings-drawer"]')){
      document.getElementById("app").getElementsByClassName('two')[0].childNodes[2].childNodes[0].style.maxWidth = "100%";
      document.getElementById("app").getElementsByClassName('two')[0].childNodes[2].childNodes[0].style.flex = "0 0 100%";
  }
}

function inchatcontactandgroupinfo(){
  console.log("inchatcontactandgroupinfo")
  if (document.getElementById("app").getElementsByClassName('three')[0].childNodes[5]){
      document.getElementById("app").getElementsByClassName('three')[0].childNodes[5].style.width = "90%";
      document.getElementById("app").getElementsByClassName('three')[0].childNodes[5].style.maxWidth = "100%"; 
  }


}
function restoreinchatcontactandgroupinfo(){
  console.log("restoreinchatcontactandgroupinfo")
  if (document.getElementById("app").getElementsByClassName('two')[0].childNodes[5] !== null){
    document.getElementById("app").getElementsByClassName('two')[0].childNodes[5].style.width = "";
    document.getElementById("app").getElementsByClassName('two')[0].childNodes[5].style.maxWidth = "";
  }  
}
function clean() {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
          registration.unregister()
  }}).catch(function(err) {
      console.log('Service Worker registration failed: ', err);
  });
}






//Injection AUdio testid

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
