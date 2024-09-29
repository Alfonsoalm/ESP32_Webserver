"use strict";

import { url, createHeader, createSidebarNav } from './scripts.js';
import { sidebar } from './template.js';
import { iniciarIndex } from './index.js';
import { iniciarWifi } from './wifi.js';
import { iniciarMqtt } from './mqtt.js';
import { iniciarRestore } from './restore.js';
import { iniciarRestart } from './restart.js';
import { iniciarFirmware } from './firmware.js';
import { iniciarUser } from './admin.js';

// 3 :"/" o '/' o 'esp-admin'

switch (url[3]) {
    case '/':
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarIndex);
        break;
    case '/wifi.html': // desarollo
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarWifi);
        break;
    case '/esp-wifi': // producción
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarWifi);
        break;
    case '/mqtt.html': // desarollo
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarMqtt);
        break;
    case '/esp-mqtt': // producción
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarMqtt);
        break;   
    case '/restore.html': // desarollo
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarRestore);
        break;
    case '/esp-restore': // producción
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarRestore);
        break;  
    case '/restart.html': // desarollo
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarRestart);
        break;
    case '/esp-restart': // producción
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarRestart);
        break; 
    case '/firmware.html': // desarollo
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarFirmware);
        break;
    case '/esp-device': // producción
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarFirmware);
        break; 
    case '/user.html': // desarollo
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarUser);
        break;
    case '/esp-admin': // producción
        createHeader();
        createSidebarNav(sidebar);
        document.addEventListener('DOMContentLoaded', iniciarUser);
        break; 
    default:
        break;
}
// Desde el archivo main.js
/**
 * Easy selector helper function
 */
const select = (el, all = false) => {
    el = el.trim()
    if (all) {
        return [...document.querySelectorAll(el)]
    } else {
        return document.querySelector(el)
    }
}
/**
* Easy event listener function
*/
const on = (type, el, listener, all = false) => {
    if (all) {
        select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
        select(el, all).addEventListener(type, listener)
    }
}
/**
* Easy on scroll event listener 
*/
const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
}
/**
* Back to top button
*/
let backtotop = select('.back-to-top')
if (backtotop) {
    const toggleBacktotop = () => {
        if (window.scrollY > 100) {
            backtotop.classList.add('active')
        } else {
            backtotop.classList.remove('active')
        }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
}
/**
 * Sidebar toggle
 */
if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function (e) {
        select('body').classList.toggle('toggle-sidebar')
    })
}




// EJEMPLO DE CODIGO HTML DESDE JAVASCRIPT
/* 
<div class="progress" style="height: 25px">
    <div id="wifiQuality" class="progress-bar bg-secondary" style="width: 100%">
        <strong><span id="wifiQualitySpan" class="text-white" style="font-size: 20px">100%</span></strong>
    </div>
</div> 
*/
// codigo de ejemplo crear html desde js
/* const contenedor = document.querySelector('#liWiFi');

const progress = document.createElement('div');
progress.classList.add('progress', 'mt-2');
progress.style.height = '25px';

const progressDiv = document.createElement('div')
progressDiv.classList.add('progress-bar', 'bg-primary')
progressDiv.id = 'progress1'
progressDiv.role = 'progressbar'
progressDiv.style.width = '25%'

const strong = document.createElement('strong')
const span = document.createElement('span')

span.classList.add('text-white')
span.style.fontSize = '25px'
span.textContent = '60%'

strong.appendChild(span)

progressDiv.appendChild(strong)

progress.appendChild(progressDiv)

contenedor.appendChild(progress) */