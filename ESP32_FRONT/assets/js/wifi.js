"use strict";
import { ApiService, createBreadCrumb, headerIconsStatus, createSwitch, createInputType, formDisable, builder, initTooltips, SweetAlert, alertMsg} from './scripts.js';
import { wifiMainInput } from './template.js';


export async function iniciarWifi() {
    // Cambiar la etiqueta de titulo
    document.title = "WIFI | ESP32 Admin Tool v3";
    // creamos el breadcrum
    createBreadCrumb('Configuración del WiFi', 'Conexiones', 'WiFi');
    // peticion a la api para el wifi
    const getWifi = new ApiService('connection/wifi');
    const resp = await getWifi.getApiData();
    //console.log(resp);
    // pasar valores a los iconos del header
    headerIconsStatus(resp.wifiStatus, resp.rssiStatus, resp.mqttStatus);
    // Asignar el valor al input según lo que nos llega de la API
    wifiMainInput.forEach((inputValue, index) => {
        if (inputValue.inputId === Object.keys(resp.wifi)[index]) {
            inputValue.value = resp.wifi[inputValue.inputId]; // resp.wifi['ap_connect'] = 2
            //console.log(Object.keys(resp.wifi)[index]);
            //console.log(resp.wifi[inputValue.inputId]);
        }
    });
    // Dibujar los input según corresponda
    wifiMainInput.forEach(input => {
        if (input.switch) {
            createSwitch(input.parentId, input.inputId, input.type, input.label1, input.label2, input.value, input.classe);
        } else {
            createInputType(input.parentId, input.inputId, input.type, input.label1, input.label2, input.value, input.classe);
        }
    });
    /* Habilitar input WIFI/AP segun estado auto-ejecutable*/
    (function wifi() {
        //console.log('funcion auto')
        const ip = document.querySelector("#wifi_ip_static");
        const ap = document.querySelector("#wifi_mode");
        // modo
        if (ap.checked) {
            formDisable("ap", true);
            formDisable("client", false);
        } else {
            formDisable("ap", false);
            formDisable("client", true);
        }
        // dhcp
        if (ip.checked) {
            formDisable("ip", false);
        } else {
            formDisable("ip", true);
        }

    })();
    // escaneo de las redes wifi
    // crear la tarjeta de escanear redes
    function buildcard() {

        const card = builder({
            type: 'card',
            props: { class: 'card' },
            children: [
                {
                    type: 'div',
                    props: { class: 'card-body bg-secondary-light', id: 'scanBody' },
                    children: [
                        {
                            type: 'div',
                            props: { class: 'badge bg-primary text-uppercase mt-3' },
                            children: ['0 Redes encontradas']
                        },
                        {
                            type: 'div',
                            props: { class: 'text-center mt-5 text-lg fs-4' },
                            children: [
                                {
                                    type: 'i',
                                    props: { class: 'bi bi-wifi text-success', style: 'font-size: 100px' }
                                },
                                {
                                    type: 'div',
                                    props: { class: 'text-center py-5' },
                                    children: [
                                        {
                                            type: 'h4',
                                            props: {
                                                class: 'fw-bold text-success text-uppercase mb-0', id: 'scanH4'
                                            },
                                            children: ['NINGUNA RED WIFI ENCONTRADA']
                                        }
                                    ]
                                },
                                {
                                    type: 'button',
                                    props: {
                                        class: 'btn btn-success me-1 mb-3',
                                        onclick: () => { scan(); },
                                        id: 'scanBtn'
                                    },
                                    children: [
                                        {
                                            type: 'i',
                                            props: { class: 'bi bi-fw bi-search opacity-50 me-1' }
                                        },
                                        'Escanear'
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        });
        const contenedor = document.querySelector('#cardScan');
        contenedor.innerHTML = '';
        contenedor.appendChild(card);
    }
    buildcard();
    // función para escaneo
    const scan = async ()=>{

        document.querySelector('#scanH4').innerHTML = 'ESCANEANDO REDES WIFI CERCANAS';
        document.querySelector('#scanBtn').disabled = true;
        document.querySelector('#scanBtn').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Escaneando...';

        // crear la peticion a la API
        const getScan = new ApiService('connection/wifi-scan');
        const resp = await getScan.getApiData();
        //console.log(resp);

        if(resp.code !== 0){

            let tbody = { type: "tbody", children: [] };

            for(const { n, ssid, rssi, secure, bssid, channel } of resp.data){
                let tr = { 
                    type: "tr", 
                    children: [
                        { type: "td", children: [`${n}`] },
                        { type: "td", children: [`${ssid}`] },
                        { type: "td", children: [`${rssi}`] },
                        { type: "td", children: [`${bssid} / ${secure}`] },
                        { type: "td", children: [`${channel}`] },
                        { 
                            type: "td",                          
                            children: [ 
                                { 
                                    type: 'button', 
                                    props: {
                                        class: 'btn btn-success btn-sm',
                                        onclick:()=>{ select(`${ssid}`); }, // para poner el ssid en el input 
                                        bsToggle: 'tooltip',
                                        bsPlacement: 'top',
                                        bsOriginalTitle: `Seleccionar la red "${ssid}"`
                                    }, 
                                    children:[
                                        {type: 'i', props:{class: 'bi bi-check-circle'}}
                                    ]
                                }
                            ] 
                        },
                    ] 
                } 
                tbody.children.push(tr); 
            }

            const scanBody = document.querySelector('#scanBody');
            scanBody.innerHTML = '';
            // crear el span segun cantidad de redes
            const scanSpan = builder(
                {
                    type: 'div', 
                    props: {class: 'badge bg-primary text-uppercase mt-3', id: 'scanH4'}, 
                    children: [`${resp.meta.count} Redes encontradas`]
                }
            );
            // crear la tabla segun las redes encontradas
            const scanTable = builder(
                {
                    type:'div',
                    props:{ class: 'table-responsive' },
                    children:[
                        {
                            type:'table',
                            props:{ class:'table table-borderless datatable align-middle' },
                            children:[
                                {
                                    type: 'thead', 
                                    children: [
                                        {
                                            type: 'tr', 
                                            children: [
                                                {type: 'th', props: {scope: 'col'}, children: ['#']},
                                                {type: 'th', props: {scope: 'col'}, children: ['SSID']},
                                                {type: 'th', props: {scope: 'col'}, children: ['Señal (dBm)']},
                                                {type: 'th', props: {scope: 'col'}, children: ['BSSID/Secure']},
                                                {type: 'th', props: {scope: 'col'}, children: ['Canal']},
                                                {type: 'th', props: {scope: 'col'}, children: ['Acción']},
                                            ]
                                        }
                                    ]
                                },
                                tbody                                    
                            ]
                        },
                        { 
                            type: 'button', 
                            props: {
                                class: 'btn btn-success me-1 mb-3',
                                onclick:()=> { buildcard(); },
                            }, 
                            children: [{type: 'i', props:{class: 'bi bi-fw bi-search opacity-50 me-1'}}, 'Volver a escanear']
                        }
                    ]
                }
            ); 

            scanBody.appendChild ( scanSpan );
            scanBody.appendChild ( scanTable ); 

            // inicializar los tooltips
            initTooltips();

        }else{
            document.querySelector('#scanH4').innerHTML = 'NINGUNA RED WIFI ENCONTRADA';
            document.querySelector('#scanBtn').disabled = false;
            document.querySelector('#scanBtn').innerHTML = '<i class="bi bi-fw bi-search opacity-50 me-1"></i> Escanear';
        }

    }
    // poner el ssid seleccionado en el input
    const select = (ssid)=>{
        document.getElementById('wifi_ssid').value = ssid
    }
    // crear el boton para enviar la data
    const btnSendWifi = builder(
        {
            type: 'div',
            props: { class: 'col-sm-10' },
            children: [
                {
                    type: 'button',
                    props: {
                        class: 'btn btn-primary', 
                        id: 'submitWifi',
                        type: 'submit'
                    },
                    children: ['Enviar']            
                }
            ]
        }
    );
    document.querySelector('#btnSendWifi').appendChild(btnSendWifi);

    // capturar el evento submit del formulario
    const form = document.querySelector('#form');
    form.addEventListener('submit', event =>{
        event.preventDefault();
        const wifi = document.querySelectorAll('.wifi');
        //console.log(wifi)
        let data = {
            wifi_mode: '',
            wifi_ssid: "",
            wifi_password: "",
            wifi_ip_static: '',
            wifi_ipv4: "",
            wifi_subnet: "",
            wifi_gateway: "",
            wifi_dns_primary: "",
            wifi_dns_secondary: "",
            ap_ssid: "",
            ap_password: "",
            ap_visibility: '',
            ap_chanel: '',
            ap_connect: ''
        };
        // capturar los valores de los input para enviar por post
        wifi.forEach((inputValue, index) =>{
            //console.log(Object.keys(data)[index]);
            //console.log(inputValue.id);
            if(inputValue.id === Object.keys(data)[index])
                data[inputValue.id] = inputValue.type === 'checkbox' ? inputValue.checked : inputValue.value;
        });
        //console.log(data);
        // sacar alert de consulta
        SweetAlert('¿Desea guardar?', 'La configuración del WiFi', 'question', 'connection/wifi', data);
    });
    // sacar alert superior desde localstorage
    if(localStorage.getItem('save')){
        alertMsg('danger', '¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!');
    }

}