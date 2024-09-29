"use strict";

import { ApiService, SweetAlert, builder, card, createBreadCrumb, headerIconsStatus, alertMsg } from './scripts.js'


export async function iniciarRestore(){

    /* 
    * Cambiar la etiqueta title del HTML (DOM)
    */
    document.title = "Restablecer | ESP32 Admin Tool v3";
    /* 
    * Funcion crear el breadcrum pasando paramétros
    */
    createBreadCrumb('Restablecer configuraciones predeterminadas', 'Dispositivo', 'Restablecer');

    const getRestore = new ApiService('device/status');
    const resp = await getRestore.getApiData();
    //console.log(resp)

    headerIconsStatus(resp.wifiStatus, resp.rssiStatus, resp.mqttStatus);

    const inputsRestore = builder({
        type: 'div',
        props: { class: 'card-body'},
        children: [
            {
                type: 'h5',
                props: {class: 'card-title'},
                children: ['Use este botón para restablecer a los parámetros de fábrica']
            },
            {
                type: 'button',
                props: {
                    class: 'btn btn-primary',
                    onclick:()=>{ restore() }
                },
                children: [
                    {
                        type: 'i',
                        props: { class: 'bi bi-arrow-counterclockwise me-1'},
                        children: []
                    },
                    'Restablecer'
                ]
            },
            {
                type: 'div',
                props: { class: 'restoreLoading', style: 'display:none' },
                children: [
                    {
                        type: 'h5',
                        props: { class: 'card-title mt-2' },
                        children: [ 'Restableciendo...' ]
                    },
                    {
                        type: 'div',
                        props: { class: 'progress'},
                        children:[
                            {
                                type: 'div', 
                                props: {
                                    class: 'progress-bar progress-bar-striped bg-secondary progress-bar-animated',
                                    style: 'width: 100%',
                                    id: 'progressRestore'
                                },
                                children: ['100']
                            }
                        ]
                    }
                ]
            }
        ]
    });

    const section = builder({
        type: 'section',
        props: { class: 'section' },
        children: [
            {
                type: 'div',
                props: { class: 'row' },
                children: [
                    {
                        type: 'div',
                        props: {class: 'col-lg-12'},
                        children: [
                            new card('Restablecer', inputsRestore).buildCard()
                        ]
                    }
                ]
            } 
        ]
    });
    document.querySelector('#main').appendChild(section);

    // función para restablecer el equipo
    const restore=()=>{
        SweetAlert('¿Restablecer?', 'Esta seguro de restablecer a los valores por defecto', 'question', 'device/restore', null);
    }

    /* 
    * Sacar alert superior desde localstorage
    * @param {boolean} var -- localStorage.getItem('save') captura var desde localstorage
    */
    if(localStorage.getItem('save')){
        alertMsg('danger', '¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!');
    }


}