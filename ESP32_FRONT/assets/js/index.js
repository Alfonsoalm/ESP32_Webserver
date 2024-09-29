"use strict";
import { ApiService, createBreadCrumb, createCard, createCardRelays, createCardTable, createProgressBar, headerIconsStatus, alertMsg} from "./scripts.js";

// para pasar la información que trigo de la api /api/index
let index = {};

export async function iniciarIndex(){

    // cambiar el titulo del html
    document.title = 'HOME | ESP32 Admin Tool v3';
    // llamar la función para crear el breadcrum
    createBreadCrumb('Dashboard', 'Información', 'Dashboard');

    // DEMO
    /* const url = `http://${host}/api/index`;
    await fetch(url,{
        method: 'GET',
        headers:{
            'Accept': 'application/json'
        }
    })
    .then((res)=> res.json())
    .then((datos) =>{
        index = datos
    })
    .catch((error)=>console.log(error))
    console.log(index); */

    const getIndex = new ApiService('index');
    const resp = await getIndex.getApiData();
    index = resp;

    // lenar el html desde la api
    // crear la tarjeta para el serial
    createCard('#serialCard', 'sales-card', 'Serial', 'cpu', 'serial', index.serial, 'Número de serie del equipo');
    // crear la tarjeta para el device
    createCard('#deviceCard', 'revenue-card', 'Dispositivo', 'info-circle', 'device', index.device, 'Identificación del dispositivo');
    // crear card reinicios
    createCard("#rebootsCard", "customers-card", "Reinicios", "arrow-clockwise", "reboots", index.reboots, "Conteo de reinicios");
    // crear card time activo
    createCard("#cardTimeActive", "customers-card", "Tiempo Activo", "clock-history", "activeTime", index.activeTime, "Tiempo de actividad (D:H:M:S)");
    // crear la tarjeta de la tabla wifi
    createCardTable('#wirelessCard', true, 'WiFi', 'esp-wifi', 'Configurar', 'Inalámbrico', ' | Conexión', 'wifiTable', index.wifi);
    // crear broker + tabla
    createCardTable("#brokerCard", true,  "MQTT", "esp-mqtt", "Configurar", "Broker MQTT", " | Conexión", "brokerTable", index.mqtt);

    // crear los relays
    createCardRelays('#relaysCard', index.relays);

    // crear card de del info
    createCardTable("#infoCard", false,  "", "", "", "Información General", " | Dispositivo", "infoTable", index.info);

    const spiffsUsed = () => {
        let usado = parseInt(index.spiffsUsed);
        let total = parseInt(index.info.SPIFFS_SIZE_KB);
        return Math.round(usado*100/total*100)/100;
    }

    const ramAvailable = () => {
        let disponible = parseInt(index.ramAvailable); // NaN
        let total = parseInt(index.info.RAM_SIZE_KB);
        return Math.round(disponible*100/total*100)/100;
    }

    // Crear los progressbar
    // Crear Progress Bar WiFi
    createProgressBar("#liWiFi", "bg-secondary", "wifiQuality", "wifiQualitySpan", index.wifiQuality);
    // Crear Progress Bar SPIFFS
    createProgressBar("#liSpiffs", "bg-primary", "spiffsUsed", "spiffsUsedSpan", spiffsUsed());
    // Crear Progress Bar RAM
    createProgressBar("#liRam", "bg-success", "ramAvailable", "ramAvailableSpan", ramAvailable());
    
    // crear card temp
    createCard("#tempCard", "revenue-card", "Temperatura del CPU", "thermometer-half", "cpuTemp", index.cpuTemp, "Temperatura iterna (°C)");

    // pasar valores a los iconos del header
    headerIconsStatus (index.wifiStatus, index.rssiStatus, index.mqttStatus);
    // mostrar el alert si esta en local storage
    if(localStorage.getItem('save')){
        alertMsg('danger', '¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!');
    } 


}

