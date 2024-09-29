"use strict";

import {ApiService, SweetAlert, builder, createBreadCrumb, headerIconsStatus, alertMsg} from './scripts.js'


export async function iniciarUser(){

    /* 
    * Cambiar la etiqueta title del HTML (DOM)
    */
    document.title = "Admin | ESP32 Admin Tool v3";
    /* 
    * Funcion crear el breadcrum pasando paramétros
    */
    createBreadCrumb('Administrador del sistema', 'Información', 'Admin');

    const getInfo = new ApiService('device/status');
    const resp = await getInfo.getApiData();
    /* 
    * Funcion para actualizar los estados de los iconos según la respuesta del GET
    */
    headerIconsStatus(resp.wifiStatus, resp.rssiStatus, resp.mqttStatus);

        /* 
    * Crear los inputs para los detalles
    */
    const inputsDetalles = builder({
        type: 'div',
        props: {class: 'card'},
        children: [
            {
                type: 'div',
                props: {class: 'card-header'},
                children: ['Detalles del perfil']
            },
            {
                type: 'div',
                props: {class: 'card-body profile-overview d-flex flex-column'},
                children: [                    
                    {
                        type: 'div',
                        props: {class: 'row mt-4 mb-2'},
                        children: [
                            {
                                type: 'div',
                                props: {class: 'col-lg-3 col-md-4 label'},
                                children: ['Nombre:']
                            },
                            {
                                type: 'div',
                                props: {class: 'col-lg-9 col-md-8'},
                                children: ['Administrador del sistema']
                            }
                        ]
                    },
                    {
                        type: 'div',
                        props: {class: 'row mt-2 mb-2'},
                        children: [
                            {
                                type: 'div',
                                props: {class: 'col-lg-3 col-md-4 label'},
                                children: ['Usuario:']
                            },
                            {
                                type: 'div',
                                props: {class: 'col-lg-9 col-md-8'},
                                children: ['admin']
                            }
                        ]
                    },
                    {
                        type: 'div',
                        props: {class: 'row mt-2 mb-2'},
                        children: [
                            {
                                type: 'div',
                                props: {class: 'col-lg-3 col-md-4 label'},
                                children: ['Rol:']
                            },
                            {
                                type: 'div',
                                props: {class: 'col-lg-9 col-md-8'},
                                children: ['super-user']
                            }
                        ]
                    },
                    {
                        type: 'div',
                        props: {class: 'row mt-2 mb-2'},
                        children: [
                            {
                                type: 'div',
                                props: {class: 'col-lg-3 col-md-4 label'},
                                children: ['Acceso:']
                            },
                            {
                                type: 'div',
                                props: {class: 'col-lg-9 col-md-8'},
                                children: ['Modo de servicio (Accesso total)']
                            }
                        ]
                    }
                ]
            }
        ]
    });
    /* 
    * Agregar el html creado en el card detalles del perfin
    */
    document.querySelector('#inputsDetalles').appendChild(inputsDetalles);

    /* 
    * Crear los inputs para editar la contraseña
    */
    const inputsPassword = builder({
        type: 'div',
        children: [  
            {
                type: 'div',
                props: {class: 'row mb-3 mt-4'},
                children: [
                    {
                        type: 'label',
                        props: {
                            class: 'col-md-4 col-lg-4 col-form-label',
                            for: 'device_old_password'
                        },
                        children: ['Contraseña actual']
                    },
                    {
                        type: 'div',
                        props: {class: 'col-md-8 col-lg-8'},
                        children: [
                            {
                                type: 'input',
                                props: {
                                    class: 'form-control pass',
                                    type: 'password',
                                    id: 'device_old_password',
                                    name: 'device_old_password',
                                },
                            }
                        ]
                    }
                ]
            },
            {
                type: 'div',
                props: {class: 'row mb-3'},
                children: [
                    {
                        type: 'label',
                        props: {
                            class: 'col-md-4 col-lg-4 col-form-label',
                            for: 'device_new_password'
                        },
                        children: ['Nueva contraseña']
                    },
                    {
                        type: 'div',
                        props: {class: 'col-md-8 col-lg-8'},
                        children: [
                            {
                                type: 'input',
                                props: {
                                    class: 'form-control pass',
                                    type: 'password',
                                    id: 'device_new_password',
                                    name: 'device_new_password',
                                },
                            }
                        ]
                    }
                ]
            },
            {
                type: 'div',
                props: {class: 'row mb-3'},
                children: [
                    {
                        type: 'label',
                        props: {
                            class: 'col-md-4 col-lg-4 col-form-label',
                            for: 'device_c_new_password'
                        },
                        children: ['Repetir contraseña']
                    },
                    {
                        type: 'div',
                        props: {class: 'col-md-8 col-lg-8'},
                        children: [
                            {
                                type: 'input',
                                props: {
                                    class: 'form-control pass',
                                    type: 'password',
                                    id: 'device_c_new_password',
                                    name: 'device_c_new_password',
                                },
                            }
                        ]
                    }
                ]
            },
            {
                type: 'div',
                props: {class: 'mb-2'},
                children: [
                    {
                        type: 'button',
                        props: {
                            class: 'btn btn-primary'
                        },
                        children: [
                            {
                                type: 'i',
                                props: { class: 'bi bi-key me-1' },
                            },
                            'Actualizar'
                        ]
                    }      
                ]
            }
        ]
    });

    /* 
    * Agregar el html creado en el card detalles del perfin
    */
    document.querySelector('#form').appendChild(inputsPassword);

    /* 
    * Evento submit de formulario
    */
   const form = document.querySelector('#form');
   form.addEventListener('submit', event=>{ event.preventDefault(); processSendData(); });

    /* 
    * Función para procesar los datos para enviar del formulario
    */
    const processSendData=()=>{
        const pass = document.querySelectorAll('.pass');
        let data = {
            device_old_password: '',
            device_new_password: '',         
            device_c_new_password: ''
        }

        pass.forEach((inputValue, index)=>{
            if(inputValue.id === Object.keys(data)[index])
                data[inputValue.id] = inputValue.value;
        });
        //console.log(data)
        SweetAlert('¿Actualizar contraseña?', 'Está seguro de cambiar la contraseña', 'question', 'perfil/user', data);
    }

    /* 
    * Sacar alert superior desde localstorage
    * @param {boolean} var -- localStorage.getItem('save') captura var desde localstorage
    */
    if(localStorage.getItem('save')){
        alertMsg('danger', '¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!');
    }



}