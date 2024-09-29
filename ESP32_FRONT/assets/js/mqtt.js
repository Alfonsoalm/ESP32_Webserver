"use strict";

import { ApiService, SweetAlert, btnSend, createBreadCrumb, createInputType, createSelectType, createSwitch, headerIconsStatus, alertMsg, formDisable} from './scripts.js';
import { mqttMainInput } from './template.js'



export async function iniciarMqtt(){

    // Cambiar la etiqueta de titulo
    document.title = "MQTT | ESP32 Admin Tool v3";
    // Creamos el breadcrum
    createBreadCrumb('Configuración del MQTT', 'Conexiones', 'MQTT');
    // crear la conexión a la API
    const getMqtt = new ApiService('connection/mqtt');
    const resp = await getMqtt.getApiData();
    console.log(resp)
    // pasar valores a los iconos del header
    headerIconsStatus(resp.wifiStatus, resp.rssiStatus, resp.mqttStatus);

    // pasar valores de la respuesta al objeto mqtt
    mqttMainInput.forEach( (inputValue, index)=>{
        if(inputValue.inputId === Object.keys(resp.mqtt)[index])
            inputValue.value = resp.mqtt[inputValue.inputId]
    });

    // dibujar los input segun corresponda
    mqttMainInput.forEach( input =>{
        if(input.switch){
            createSwitch(input.parentId, input.inputId, input.type, input.label1, input.label2, input.value, input.classe);
        }else if(!input.switch && input.type === 'select'){
            createSelectType(input.parentId, input.inputId, input.type, input.label1, input.label2, input.option, input.value, input.classe);
        }else{
            createInputType(input.parentId, input.inputId, input.type, input.label1, input.label2, input.value, input.classe);
        }
    });

    // dibijar botones de guardar
    const btnSettings = document.querySelector('#btnSendMqtt');
    btnSettings.appendChild( new btnSend('primary', 'Guardar').btnSendSettings() );
    document.querySelector('#btnSendMqttMsg').appendChild( new btnSend('secondary','Guardar').btnSendSettings() );

    // Evento submit
    const form = document.querySelectorAll('.formSend');
    form.forEach( formulario =>{
        formulario.addEventListener('submit', event =>{
            event.preventDefault();
            processSendData();
        });
    });

    // Función para enviar la data
    const processSendData=()=>{
        const mqtt = document.querySelectorAll('.mqtt');

        let data = {
            mqtt_enable: '',
            mqtt_server: '',
            mqtt_port: '',
            mqtt_retain: '',
            mqtt_qos: '',
            mqtt_id: '',
            mqtt_user: '',
            mqtt_password: '',
            mqtt_clean_sessions: '',
            mqtt_time_send: '',
            mqtt_time_interval: '',
            mqtt_status_send: ''
        }

        mqtt.forEach( ( inputValue, index )=>{
            if(inputValue.id === Object.keys(data)[index])
                data[inputValue.id] = inputValue.type === 'checkbox' ? inputValue.checked : inputValue.value;
        });

        SweetAlert('¿Desea guardar?', 'La configuración del Mqtt', 'question', 'connection/mqtt', data);

    }
    
    // sacar alert superior desde localstorage
    if(localStorage.getItem('save')){
        alertMsg('danger', '¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!');
    }

    /* Habilitar input WIFI/AP segun estado auto-ejecutable*/
    (function mqtt() {
        const mqtt = document.querySelector("#mqtt_enable");
        if (mqtt.checked) {
            formDisable("mq", false);
        } else {
            formDisable("mq", true);
        }
    })();




}