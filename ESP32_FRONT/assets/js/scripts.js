"use strict";

const urlActual = window.location;
export const url = /^(\w+):\/\/([^\/]+)([^]+)$/.exec(urlActual);
export const host = url[2] === '127.0.0.1:5500' ? '192.168.30.108' : url[2]; // ip - mdns


// Función para construir codigo html desde JS
export function builder(Node) {
    // si el node viene indefinido
    if (typeof Node === "undefined") {
        return document.createTextNode("");
    }
    // si el node es un string lo dibujamos
    if (typeof Node === "string") {
        return document.createTextNode(Node);
    }
    // si es un html comparamos por tagname y retorno el mismo hmtl
    if (Node.tagName) {
        return Node;
    }
    // si enviamos un Objeto de JS
    const element = document.createElement(Node.type);
    // si llega props
    if (Node.props) {
        for (const prop in Node.props) {
            if (typeof Node.props[prop] === 'function' || typeof Node.props[prop] === 'object') {
                element[prop] = Node.props[prop];
            } else if (prop.includes('bs')) { // data-bs-toggle = toggle
                element.dataset[prop] = Node.props[prop]
            } else {
                element.setAttribute(prop, Node.props[prop]);
            }
        }
    }
    // si llegan hijos
    if (Node.children) {
        Node.children.map(builder).forEach(Child => element.appendChild(Child));
    }
    // eventos
    if (Node.events) {
        for (const event in Node.events) {
            element.addEventListener(event, Node.events[event](), false);
        }
    }
    return element;
}
// definir función para crear el Header desde js
export function createHeader() {
    const contenedor = document.querySelector('#header');
    const div = builder({
        type: 'div',
        props: { class: 'd-flex align-items-center justify-content-between' },
        children: [
            {
                type: 'a',
                props: { class: 'logo d-flex align-items-center', href: '/' },
                children: [
                    {
                        type: 'img',
                        props: { src: 'assets/img/logo.png', alt: 'logo' },
                    },
                    {
                        type: 'span',
                        props: { class: 'd-none d-lg-block' },
                        children: ['ESP32Tools v3']
                    }
                ]
            },
            {
                type: 'i',
                props: { class: 'bi bi-list toggle-sidebar-btn' }
            }
        ]
    });
    contenedor.appendChild(div);
    // crear nav
    const nav = builder({
        type: 'nav',
        props: { class: 'header-nav ms-auto' },
        children: [
            {
                type: 'ul',
                props: { class: 'd-flex align-items-center' },
                children: [
                    {
                        type: 'li',
                        props: { class: 'nav-item dropdown' },
                        children: [
                            {
                                type: 'a',
                                props: {
                                    class: 'nav-link nav-icon',
                                    href: '#',
                                    bsToggle: 'dropdown'
                                },
                                children: [
                                    {
                                        type: 'i',
                                        props: {
                                            class: 'bi',
                                            bsToggle: 'tooltip',
                                            bsPlacement: 'bottom',
                                            bsOriginalTitle: 'Conexión WiFi',
                                            id: 'wifiStatus'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'li',
                        props: { class: 'nav-item dropdown' },
                        children: [
                            {
                                type: 'a',
                                props: {
                                    class: 'nav-link nav-icon',
                                    href: '#',
                                    bsToggle: 'dropdown'
                                },
                                children: [
                                    {
                                        type: 'i',
                                        props: {
                                            class: 'bi',
                                            bsToggle: 'tooltip',
                                            bsPlacement: 'bottom',
                                            bsOriginalTitle: 'WiFi RSSI',
                                            id: 'rssiStatus'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'li',
                        props: { class: 'nav-item dropdown' },
                        children: [
                            {
                                type: 'a',
                                props: {
                                    class: 'nav-link nav-icon',
                                    href: '#',
                                    bsToggle: 'dropdown'
                                },
                                children: [
                                    {
                                        type: 'i',
                                        props: {
                                            class: 'bi',
                                            bsToggle: 'tooltip',
                                            bsPlacement: 'bottom',
                                            bsOriginalTitle: 'Conexión MQTT',
                                            id: 'mqttStatus'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'li',
                        props: { class: 'nav-item dropdown pe-3' },
                        children: [
                            {
                                type: 'a',
                                props: {
                                    class: 'nav-link nav-profile d-flex align-items-center pe-0',
                                    href: '#',
                                    bsToggle: 'dropdown'
                                },
                                children: [
                                    {
                                        type: 'span',
                                        props: { class: 'd-none d-md-block dropdown-toggle ps-2' },
                                        children: ['Admin']
                                    }
                                ]
                            },
                            {
                                type: 'ul',
                                props: { class: 'dropdown-menu dropdown-menu-end dropdown-menu-arrow profile' },
                                children: [
                                    {
                                        type: 'li',
                                        props: { class: 'dropdown-header' },
                                        children: [
                                            {
                                                type: 'h6',
                                                children: ['Admin']
                                            },
                                            {
                                                type: 'span',
                                                children: ['Administrador del sistema']
                                            }
                                        ]
                                    },
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'hr',
                                                props: { class: 'dropdown-divider' }
                                            }
                                        ]
                                    },
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'a',
                                                props: { class: 'dropdown-item d-flex align-items-center', href: 'esp-admin' },
                                                children: [
                                                    { type: 'i', props: { class: 'bi bi-person' } },
                                                    { type: 'span', children: ['Perfil'] }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'hr',
                                                props: { class: 'dropdown-divider' }
                                            }
                                        ]
                                    },
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'a',
                                                props: { class: 'dropdown-item d-flex align-items-center', href: 'esp-device' },
                                                children: [
                                                    { type: 'i', props: { class: 'bi bi-gear' } },
                                                    { type: 'span', children: ['Configuración'] }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'hr',
                                                props: { class: 'dropdown-divider' }
                                            }
                                        ]
                                    },
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'a',
                                                props: {
                                                    class: 'dropdown-item d-flex align-items-center',
                                                    href: 'https://electroniciot.com',
                                                    target: '_blank'
                                                },
                                                children: [
                                                    { type: 'i', props: { class: 'bi bi-question-circle' } },
                                                    { type: 'span', children: ['Ayuda?'] }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'hr',
                                                props: { class: 'dropdown-divider' }
                                            }
                                        ]
                                    },
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'a',
                                                props: {
                                                    class: 'dropdown-item d-flex align-items-center',
                                                    href: 'esp-logout',
                                                    id: 'logoutHeader'
                                                },
                                                children: [
                                                    { type: 'i', props: { class: 'bi bi-box-arrow-right' } },
                                                    { type: 'span', children: ['Salir'] }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    contenedor.appendChild(nav);
    // iniciar los toolstips
    initTooltips();
    // capturar el evento click
    document.getElementById('logoutHeader').addEventListener('click', evento =>{
        evento.preventDefault();
        //console.log('click')
        SweetAlert('Salir', '¿Realmente desea cerrar la sesión?', 'question', 'esp-logout', '');
    });
}
// definir la función de crear el sidebar
export function createSidebarNav(list) {

    const contenedor = document.querySelector('.sidebar-nav');

    list.forEach(element => {
        if (element.collapsed) {
            // definir el URL
            let ulContainer = {
                type: 'ul',
                props: {
                    class: 'nav-content collapse',
                    bsParent: '#sidebar-nav',
                    id: `${element.name}-nav`
                },
                children: []
            }
            // recorrer cada collapsed en true
            element.link.forEach(link => {

                const li = {
                    type: 'li',
                    children: [
                        {
                            type: 'a',
                            props: { class: url[3] === `/` + link.url ? 'active' : '', href: link.url },
                            children: [
                                { type: 'i', props: { class: 'bi bi-circle' } },
                                { type: 'span', children: [link.text] }
                            ]
                        }
                    ]
                }

                if (ulContainer.props.class != 'nav-content collapse show')
                    ulContainer.props.class = url[3] === `/` + link.url ? 'nav-content collapse show' : 'nav-content collapse'

                ulContainer.children.push(li);

            });
            // crear el li
            const li = builder({
                type: 'li',
                props: { class: ' nav-item' },
                children: [
                    {
                        type: 'a',
                        props: {
                            class: ulContainer.props.class === 'nav-content collapse show' ? 'nav-link' : 'nav-link collapsed',
                            bsTarget: `#${element.name}-nav`,
                            bsToggle: 'collapse',
                            href: '#'
                        },
                        children: [
                            { type: 'i', props: { class: `bi bi-${element.icon}` } },
                            { type: 'span', children: [element.name] },
                            { type: 'i', props: { class: 'bi bi-chevron-down ms-auto' } }
                        ]
                    },
                    ulContainer
                ]
            });

            contenedor.appendChild(li);

        } else {
            const li = builder({
                type: 'li',
                props: { class: 'nav-item' },
                children: [
                    {
                        type: 'a',
                        props: {
                            class: url[3] === `/`+element.url ? 'nav-link' : 'nav-link collapsed', 
                            href: element.url === '' ? '/' : element.url,
                            id: element.name === 'Salir' ? 'logout' : ''
                        },
                        children: [
                            { type: 'i', props: { class: `bi bi-${element.icon}` } },
                            { type: 'span', children: [element.name] }
                        ]
                    }
                ]
            });

            contenedor.appendChild( li );
        }
    });
    // capturar el evento click
    document.getElementById('logout').addEventListener('click', evento =>{
        evento.preventDefault();
        //console.log('click')
        SweetAlert('Salir', '¿Realmente desea cerrar la sesión?', 'question', 'esp-logout', '');
    });
}
// función para crear el breadcrum
export function createBreadCrumb(title, funcion, link){
    const contenedor = document.querySelector('.pagetitle');
    // H1
    const h1 = builder({
        type: 'h1', children:[title]
    });
    // nav
    const nav = builder({
        type: 'nav', 
        children:[
            {
                type: 'ol',
                props: {class: 'breadcrumb'},
                children:[
                    {
                        type: 'li',
                        props: {class: 'breadcrumb-item'},
                        children:[{type: 'a', props:{href: '/'}, children:['Inicio']}]
                    },
                    {
                        type: 'li',
                        props: {class: 'breadcrumb-item'},
                        children:[funcion]
                    },
                    {
                        type: 'li',
                        props: {class: 'breadcrumb-item active'},
                        children:[link]
                    }
                ]
            }
        ]
    });
    contenedor.appendChild(h1);
    contenedor.appendChild(nav)
}
// POO para la api service
export class ApiService{

    constructor( path, data ){
        this.path = path;
        this.data = data;
    }
    // método para hacer el GET de la información
    async getApiData(){
        try {
            const get = `http://${host}/api/${this.path}`; // url
            const response = await fetch( get,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );
            const json = await response.json();
            return await json;
        } catch (error) {
            console.log(error);
        }
    }
    // método para ejecutar el POST a la API
    async postApiData(){
        try {
            const get = `http://${host}/api/${this.path}`; // url
            const response = await fetch( get,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.data)
                }
            );
            const json = await response.json();
            return await json;
        } catch (error) {
            console.log(error);
        }
    }
    // post firmware, Método para subir el firmware o el spiffs
    async postFirmware(){
        try {
            const post = `http://${host}/api/${this.path}`;
            const myHeaders = new Headers();
            myHeaders.append(
                "Accept", "application/json",
                "Content-Type", "application/octet-stream"
            )
            const formdata = new FormData();
            formdata.append("", this.data, this.data.name);
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata
            }
            const response = await fetch(post,requestOptions);
            const json = await response.json();
            return await json;
        } catch (error) {
            console.log(error);
        }
    }
    // post subir archivos json
    async postFileApi(){
        try {
            const post = `http://${host}/api/${this.path}`;
            const myHeaders = new Headers();
            myHeaders.append(
                "Accept", "application/json",
                "Content-Type", "application/json"
            )
            const formdata = new FormData();
            formdata.append("", this.data, this.data.name);
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata
            }
            const response = await fetch(post,requestOptions);
            const json = await response.json();
            return await json;
        } catch (error) {
            console.log(error);
        }
    }
}
// crear card para el index
export function createCard(padre, classCard, title, icon = 'cpu', id, value, titleSmall){
    const contenedor = document.querySelector(padre);
    const card = builder({
        type: 'div',
        props: { class: `card info-card ${classCard}` },
        children:[
            {
                type: 'div',
                props: {class: 'card-body'},
                children: [
                    {
                        type: 'h5',
                        props: {class: 'card-title text-start'},
                        children: [`${title}`]
                    },
                    {
                        type: 'div',
                        props: {class: 'd-flex align-items-center'},
                        children: [
                            {
                                type: 'div',
                                props: { class: 'card-icon rounded-circle d-flex align-items-center justify-content-center'},
                                children: [
                                    {
                                        type: 'i',
                                        props: {class: `bi bi-${icon}`}
                                    }
                                ]
                            },
                            {
                                type: 'div',
                                props: {class: 'ps-1'},
                                children:[
                                    {
                                        type: 'h6',
                                        props: {id: `${id}`, class: 'text-start ps-0'},
                                        children: [`${value}`]
                                    },
                                    {
                                        type: 'span',
                                        props: {class: 'text-muted small pt-2 ps-0'},
                                        children: [`${titleSmall}`]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    contenedor.appendChild( card );
}
// crear card para tablas wifi, mqtt, info - con opción de filtro o sin filtro
export function createCardTable(padre, filter, filterText, filterHref, filterHrefText, cardBodyH5Text, cardBodySpanText = " | Conexión", tableID, data){
    const entriesData = Object.entries(data);
    let tbody = { type: 'tbody', props: { id: tableID}, children: [] }

    entriesData.forEach(row =>{

        let tr = { type: 'tr', children:[] };
        let th = { type: 'th', props: { scope: 'row' }, children: [ ` ${row[0].replace(/_/g, ' ')}: ` ] };
        let td = { type: 'td', props: { id: `${row[0]}` }, children: [`${row[1]}`] };

        tr.children.push(th);
        tr.children.push(td);
        tbody.children.push(tr);

    });

    // si tiene filtro
    let filterContainer;

    if(filter){
        filterContainer = {
            type: 'div',
            props: {class: 'filter'},
            children:[
                {
                    type: 'a',
                    props: { class: 'icon show', href: '#', bsToggle: 'dropdown' },
                    children: [ {type: 'i', props: {class: 'bi bi-three-dots'} } ]
                },
                {
                    type: 'ul',
                    props: {class: 'dropdown-menu dropdown-menu-end dropdown-menu-arrow'},
                    children:[
                        {
                            type: 'li',
                            props: { class: 'dropdown-header text-start'},
                            children: [ { type: 'h6', children: [ filterText ] } ]
                        },
                        {
                            type: 'li',
                            props: { class: 'dropdown-item' },
                            children: [
                                {
                                    type: 'a',
                                    props: { class: 'dropdown-item', href: filterHref },
                                    children: [ filterHrefText ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }

    // contener padre
    const contenedor = document.querySelector(padre);

    const card = builder({
        type: 'div',
        props: {class: 'card'},
        children: [
            filterContainer,
            {
                type: 'div',
                props: {class: 'card-body'},
                children: [
                    {
                        type: 'h5',
                        props: {class: 'card-title'},
                        children: [
                            `${cardBodyH5Text}`,
                            {
                                type: 'span',
                                children: [`${cardBodySpanText}`]
                            }
                        ]
                    },
                    {
                        type: 'div',
                        props: { class: 'table-responsive'},
                        children: [
                            { 
                                type: 'table',
                                props: {class: 'table table-borderless datatable align-middle'},
                                children: [ tbody ]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    contenedor.appendChild(card);

}
// crear relays desde la api
export function createCardRelays(padre, data){

    let relaysContainer = {
        type: 'div',
        props: { class: 'row text-center'},
        children: []
    }

    data.forEach( relay =>{
        const relays = {
            type: 'div',
            props: {class: 'col-md-12 pb-2 mb-2'},
            children: [
                {
                    type: 'li',
                    props: {class: 'list-group-item d-flex align-items-center justify-content-between'},
                    children: [
                        {
                            type: 'h4',
                            props: {class: 'mt-3'},
                            children: [
                                {
                                    type: 'span',
                                    props: {class: 'badge border-primary border-1 text-secondary'},
                                    children: [
                                        relay.name+' ',
                                        {
                                            type: 'i',
                                            props: {
                                                class: relay.status ? 'bi bi-alt' : 'bi bi-option',
                                                id: relay.name+'_Icon' // RELAY01_Icon
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'div',
                            props: {class: 'form-check form-switch card-icon rounded-circle d-flex align-items-center justify-content-center'},
                            children: [
                                {
                                    type: 'input',
                                    props: relay.status ?
                                    {
                                        // si es verdadero
                                        id: relay.name,
                                        class: 'form-check-input',
                                        type: 'checkbox',
                                        checked:'',
                                        onchange:()=>{ switchRelay( relay.name )} 
                                    } :
                                    {
                                        // si es falso
                                        id: relay.name,
                                        class: 'form-check-input',
                                        type: 'checkbox',
                                        onchange:()=>{ switchRelay( relay.name )} 
                                    },
                                    children: []
                                }
                            ]
                        },
                        {
                            type: 'div',
                            props: {class: 'card-icon rounded-circle d-flex align-items-center'},
                            children: [
                                {
                                    type: 'i',
                                    props: {
                                        id: relay.name+'_Status',
                                        class: relay.status ? 'bi bi-lightbulb-fill text-warning' : 'bi bi-lightbulb-fill text-danger'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }

        relaysContainer.children.push(relays);
    });

    // contenedor padre
    const contenedor = document.querySelector(padre);

    const card = builder({
        type: 'div',
        props: {class: 'card'},
        children:[
            {
                type: 'div',
                props: {class: 'card-body'},
                children: [
                    {
                        type: 'h5',
                        props: {class: 'card-title'},
                        children: [
                            'Control de relays ',
                            { type: 'span', children:['ON/OFF ', {type: 'i', props:{class: 'bi bi-toggles'} } ] }
                        ]
                    },
                    relaysContainer
                ]
            }
        ]
    });

    contenedor.appendChild(card);
}
// funcion para ejecutar los controles a los relays - RELAY03
const switchRelay = ( name ) => {

    const status = document.querySelector(`#${name}`).checked;
    //console.log(status)

    // {"protocol": "MQTT", "output": "RELAY1", "value": true }
    const toSend = {
        protocol: 'API',
        output: name,
        value: status
    }
    //console.log(toSend)
    const path = 'device/relays';
    // función para ejecutar los POST
    ejecutarPost( path, toSend );

}
// ejecutar POST a la API
export async function ejecutarPost( path, data ){
    const postAPI = new ApiService(path, data );
    const resp = await postAPI.postApiData();

    if( resp.relay ){
        //console.log(resp)
        const relayStatus = document.querySelector(`#${resp.name}_Status`);
        const relayIcon = document.querySelector(`#${resp.name}_Icon`);
        // función para cambiar los estados de los relays
        relayStatusChange(relayStatus, relayIcon, resp.status);
    }else if(resp.save){
        SweetAlertMsg('top-end', 'success', '¡Configuración guardada correctamente!', 5000);
        // crear el alert y salvar en localstorage si no está guardado
        if(!localStorage.getItem('save')){
            alertMsg('danger', '¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!');
        }
    }else if(resp.restore){
        SweetAlertMsg('top-end', 'success', '¡Dispositivo restablecido!', 5000);
        const div = document.querySelector('.restoreLoading');
        const time = new RestoreRestart(10);
        time.runTime('#progressRestore', div);
        // función para recargar la pagina
        reloadPage('', 10000);
    }else if(resp.restart){
        SweetAlertMsg('top-end', 'success', '¡Dispositivo reiniciado!', 5000);
        const div = document.querySelector('.restartLoading');
        const time = new RestoreRestart(10);
        time.runTime('#progressRestart', div);
        // función para recargar la pagina
        reloadPage('', 10000);
    }else if( !resp.session ){ 
        // manejo  de la respuesta de la sesión | mensaje superior y recargar pagina en 5s
        SweetAlertMsg('top-end', 'warning', `${resp.msg}` , 5000);
        // Recargar la pagina
        reloadPage('', 6000);
    }else{
        // Alert superior de error solo para el cambio de la contraseña
        SweetAlertMsg('top-end', 'error', `${resp.msg}` , 5000);
    }
}
// función de cambio de estados de los relays
const relayStatusChange=(relayStatus, relayIcon, status)=>{
    if(status){
        relayStatus.classList.remove('text-danger')
        relayStatus.classList.add('text-warning');
        relayIcon.classList.remove('bi-option')
        relayIcon.classList.add('bi-alt');
    }else{
        relayStatus.classList.remove('bi', 'bi-lightbulb-fill', 'text-warning');
        relayStatus.classList.add('bi', 'bi-lightbulb-fill', 'text-danger');
        relayIcon.classList.remove('bi-alt')
        relayIcon.classList.add('bi-option');
    }
}
// función card de los progressbar
export function createProgressBar(padre, type, idProgress, idSpan, value){
    const contenedor = document.querySelector(padre);

    const progress = builder({
        type: 'div',
        props: {class: 'progress', style: 'height: 25px'},
        children: [
            {
                type: 'div',
                props: {
                    id: idProgress,
                    class: `progress-bar ${type}`,
                    style: `width: ${value}%`,
                },
                children: [
                    {
                        type: 'strong',
                        children:[
                            {
                                type: 'span',
                                props: {
                                    id: idSpan,
                                    class: 'text-white',
                                    style: 'font-size: 20px'
                                },
                                children: [`${value}%`]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    contenedor.appendChild(progress);

}
// actualizar los estados de los iconos del header
export function headerIconsStatus(wifiStatus, rssiStatus, mqttStatus){

    // capturar los contenedores por ID
    let elementWifi = document.getElementById('wifiStatus');
    let elementRssi = document.getElementById('rssiStatus');
    let elementMQTT = document.getElementById('mqttStatus');

    // estado del wifi
    if(wifiStatus){
        elementWifi.className = ''; // elimina todas las clases
        elementWifi.classList.add('bi', 'bi-wifi', 'text-success');
    }else{
        elementWifi.className = ''; // elimina todas las clases
        elementWifi.classList.add('bi', 'bi-wifi-off', 'text-danger');
        rssiStatus = -200;
        mqttStatus = false
    }

    // Estado del rssi
    if(rssiStatus >= -55){
        elementRssi.className = '' // quitar todas las clases
        elementRssi.classList.add('bi', 'bi-reception-4', 'text-success')
    }else if (rssiStatus <= -56 && rssiStatus > -89) {
        elementRssi.className = '' // quitar todas las clases
        elementRssi.classList.add('bi', 'bi-reception-3', 'text-success');
    }else if (rssiStatus <= -90 && rssiStatus > -97) {
        elementRssi.className = '' // quitar todas las clases
        elementRssi.classList.add('bi', 'bi-reception-2', 'text-warning');
    }else if (rssiStatus <= -98 && rssiStatus > -103) {
        elementRssi.className = '' // quitar todas las clases
        elementRssi.classList.add('bi', 'bi-reception-1', 'text-warning');
    }else{
        elementRssi.className = '' // quitar todas las clases
        elementRssi.classList.add('bi', 'bi-reception-0', 'text-danger');
    }

    // estados para el MQTT
    if(mqttStatus){
        elementMQTT.className = ''; // quitar clases
        elementMQTT.classList.add('bi', 'bi-cloudy-fill', 'text-success');
    }else{
        elementMQTT.className = ''; // quitar clases
        elementMQTT.classList.add('bi', 'bi-cloud-slash-fill', 'text-danger');
    }

}
// crear input segun el tipo
export function createInputType(padre, id, type, label, placeholder, value, classe){
    const contenedor = document.querySelector(padre);
    const divRow = builder({
        type: 'div',
        props: {class: 'row mb-3 mt-3'},
        children: [
            {
                type: 'label',
                props: {class: 'col-sm-4 col-form-label mt-2', for: id},
                children: [label]
            },
            {
                type: 'div',
                props: {class: 'col-sm-8 mt-2'},
                children: [
                    { 
                        type: 'input', 
                        props: {class: `form-control ${classe}`, type: type, placeholder: placeholder, id: id, name: id, value: value}, 
                        children:[]
                    }
                ]
            }
        ]
    });
    contenedor.appendChild(divRow);
}
// crear funci+on si es un switch
export function createSwitch(padre, id, type, label1, label2, value, classe){
    const contenedor = document.querySelector(padre);
    const divRow =  builder({
        type: 'div', 
        props: {class: 'row mb-3 mt-3'}, 
        children:[
            {
                type: 'label',
                props: {class: 'col-sm-4 col-form-label', for: id},
                children: [label1]
            },
            {
                type: 'div',
                props: {class: 'col-sm-8 mt-2'},
                children: [
                    {
                        type: 'div',
                        props: {class: 'form-check form-switch'},
                        children: [
                            { 
                                type: 'input', 
                                props: value ? { // si value es true
                                    class: `form-check-input ${classe}`, 
                                    type: type, 
                                    id: id, 
                                    name: id,
                                    checked: '',
                                    onchange:()=>{ switchChange( id ) } // funcion para bloquear los switch si estoy en cliente => ap,  ap => cliente TODO: implementar
                                } : { // si value es false
                                    class: `form-check-input ${classe}`, 
                                    type: type, 
                                    id: id, 
                                    name: id,
                                    onchange:()=>{ switchChange( id ) }
                                }, 
                                children: []
                            },
                            { type: 'label', props: {class: `form-check-label switch_${id}`, for: id }, children: [label2]} // SI / NO
                        ]
                    }
                ]
            }
        ]
    });
    contenedor.appendChild(divRow);
    // Todo: llamar la función 
    switchChange( id );
}
// crear input tipo select
export function createSelectType(padre, id, type, label, label2, options, value, classe){
    const contenedor = document.querySelector(padre);

    let select = {
        type: type,
        props: { class: `form-select ${classe}`,  id: id, name: id },
        children: []
    }
    // 0,1,2
    options.forEach( option =>{
        const opt = {
            type: 'option',
            props: option === value ? { value : option, select: ''} : { value: option},
            children: [`${label2} ${option}`] // QoS 0, 1, 2
        }
        select.children.push( opt );
    });

    const divRow = builder({
        type: 'div',
        props: { class: 'row mb-3 mt-3' },
        children: [
            { 
                type: 'label',
                props: {class: 'col-sm-4 col-form-label', for: id},
                children: [label]
            },
            {
                type: 'div',
                props: { class: 'col-sm-8' },
                children: [ select ]
            }
        ]
    });
    contenedor.appendChild( divRow );
}
// crear una tarjeta desde una clase
export class card{
    constructor(textHeaer, body){
        this.textHeaer = textHeaer;
        this.body = body;
    }
    buildCard(){
        return builder({
            type: 'div',
            props: {class: 'card'},
            children: [
                {
                    type: 'div',
                    props: {class: 'card-header'},
                    children: [ this.textHeaer ]
                },
                this.body
            ]
        });
    }
}
// Manipular los switch
const switchChange=( id )=>{
    if(document.querySelector(`#${id}`).checked){

        document.querySelector(`.switch_${id}`).innerHTML = id === 'wifi_mode' ? 'Cliente' : 'SI';
        //console.log('true')
        if(id === 'wifi_mode'){
            formDisable("ap", true);
            formDisable("client", false); 
        }else if( id === 'wifi_ip_static'){
            formDisable('ip', false);
        }else if( id === 'mqtt_enable'){
            formDisable('mq', false);
        }else{}
    }else{

        document.querySelector(`.switch_${id}`).innerHTML = id === 'wifi_mode' ? 'AP' : 'NO';
        //console.log('false')
        if (id === 'wifi_mode') {
            formDisable("ap", false);
            formDisable("client", true);            
        } else if( id === 'wifi_ip_static' ) {
            formDisable('ip', true);
        } else if(id === 'mqtt_enable') {
            formDisable('mq', true);
        }else{}
    }
}
// habilitar / quitar el disabled de los inputs
export function formDisable(clase, boolean){
    //console.log(clase, boolean);
    const formElement = document.querySelectorAll(`.${clase}`);
    //console.log(formElement);
    for(let i = 0; i < formElement.length; i++){
        formElement[i].disabled = boolean;
    }
}
/**
 * Initiate tooltips
 */
export const initTooltips=()=>{
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}
// crear un sweetalert
export function SweetAlert(title, text, icon, path, data) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: 'rgb(65, 184, 130)',
        cancelButtonColor: 'rgb(255, 118, 116)',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {           
            ejecutarPost(path, data);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            history.go(0);
        }
    })
}
// crear sweetalert de mensaje
export const SweetAlertMsg = (position, icon, title, timer) => {
    Swal.fire({
        position: position,
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: timer
    });
};
// crear el alert desde localstorage
export const alertMsg = (type, amsg) =>{
    const msg = builder({
        type: 'div',
        props: {class: `alert alert-${type} alert-dismissible fade show`, role: 'alert'},
        children: [
            {type: 'i', props: { class: 'bi bi-exclamation-octagon me-1' }, children:[]},
            `${amsg}`,
            {type: 'button', props: { 
                class: 'btn-close', 
                type: 'button', 
                bsDismiss: 'alert',
                onclick:()=>{clearLocalStorage('save');},
            }, children:[]},
        ]
    });
    // inserta el alert en la posición #1 del contenedor id='main'
    const contenedor = document.querySelector('#main');
    contenedor.insertBefore(msg, contenedor.children[0]);
    // salvar en localstorage
    localStorage.setItem('save', true);
}
// limpiar el localstorage
const clearLocalStorage = (key) => {
    localStorage.removeItem(key);
}
// Clase para botones
export class btnSend{
    constructor(type, text){
        this.type = type;
        this.text = text;
    }
    // crear un boton según los parametos del constructor
    btnSendSettings(){
        return builder({
            type: 'div',
            props: { class: 'col-sm-10'},
            children:[
                {
                    type: 'button',
                    props: { class: `btn btn-${this.type}`, type: 'submit' },
                    children: [ `${this.text}` ]
                }
            ]
        });
    }
}
// crear clase para reinicio y restauración
class RestoreRestart{
    constructor(time){
        this.time = time;
    }
    runTime(progres, div){
        div.style.cssText = 'display:block;';
        this.time --;
        document.querySelector(progres).style.width = this.time * 10 + '%';
        document.querySelector(progres).innerHTML = this.time * 10 + '%';
        if(this.time === 0){
            this.time = 10;
            div.style.cssText = 'display:none;';
        }else{
            setTimeout(()=>{
                clearTimeout(this.runTime(progres, div));
            }, 1000);
        }
    }
}
// función para recargar la pagina
export const reloadPage = (url, time)=>{
    localStorage.clear();
    const timeOut = setTimeout(()=>{
        window.location = `/${url}`;
        clearTimeout(timeOut);
    }, time)
}