"use strict";
import { createBreadCrumb, ApiService, headerIconsStatus, card, builder, SweetAlert, alertMsg } from "./scripts.js";

export async function iniciarRestart(){
    /* 
    * Cambiar la etiqueta title del HTML (DOM)
    */
    document.title = "Reiniciar | ESP32 Admin Tool v3";
    /* 
    * Funcion crear el breadcrum pasando paramétros
    */
    createBreadCrumb('Reiniciar el dispositivo', 'Dispositivo', 'Reiniciar');
    const getRestart = new ApiService('device/status');
    const resp = await getRestart.getApiData();
    //console.log(resp)
    headerIconsStatus(resp.wifiStatus, resp.rssiStatus, resp.mqttStatus);

    const inputsRestart = builder({
        type: 'div',
        props: { class: 'card-body'},
        children: [
            {
                type: 'h5',
                props: {class: 'card-title'},
                children: ['Use este botón para reiniciar el dispositivo']
            },
            {
                type: 'button',
                props: {
                    class: 'btn btn-warning',
                    onclick:()=>{ restart() }
                },
                children: [
                    {
                        type: 'i',
                        props: { class: 'bi bi-arrow-clockwise me-1'},
                        children: []
                    },
                    'Reiniciar'
                ]
            },
            {
                type: 'div',
                props: { class: 'restartLoading', style: 'display:none' },
                children: [
                    {
                        type: 'h5',
                        props: { class: 'card-title mt-2' },
                        children: [ 'Reiniciando...' ]
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
                                    id: 'progressRestart'
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
                            new card('Reiniciar', inputsRestart).buildCard()
                        ]
                    }
                ]
            } 
        ]
    });
    document.querySelector('#main').appendChild(section);

    /* 
    * Funcion para reiniciar el dispositivo
    */
    const restart=()=>{               
        SweetAlert('¿Reiniciar?', 'Esta seguro de reiniciar el dispositivo', 'question', 'device/restart', null);
    }

     /* 
    * Sacar alert superior desde localstorage
    * @param {boolean} var -- localStorage.getItem('save') captura var desde localstorage
    */
    if(localStorage.getItem('save')){
        alertMsg('danger', '¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!');
    }


}