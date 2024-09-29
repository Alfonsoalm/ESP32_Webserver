"use strict";
import { builder, createBreadCrumb, ApiService, alertMsg, headerIconsStatus, SweetAlertMsg, card, reloadPage } from './scripts.js'

export async function iniciarFirmware(){
    // Cambiar la etiqueta de titulo
    document.title = "Firmware & Settings | ESP32 Admin Tool v3";
    // Creamos el breadcrum
    createBreadCrumb('Configuración del Firmware y Settings', 'Dispositivo', 'Firmware & Settings');
    // TODO: crear la peticiòn get aqui
    const getFirmware = new ApiService('device/status'); 
    const resp = await getFirmware.getApiData();
    // pasar valores a los iconos del header
    headerIconsStatus(resp.wifiStatus, resp.rssiStatus, resp.mqttStatus);

    // Todos los inputs del  firmware
    // https://www.thoughtco.com/mime-types-by-content-type-3469108
    const inputsFirmware = builder({
        type: 'div',
        props: {class: 'card-body'},
        children: [
            {
                type: 'h5',
                props: { class: 'card-title'},
                children: [ 'Use este Botón para actualizar el Firmware o el FileSystem del Dispositivo.' ]
            },
            {
                type: 'div',
                props: {class: 'row mb-3'},
                children: [
                    {
                        type: 'label',
                        props: {class: 'col-sm-12 col-form-label', for: 'fileFirmware'},
                        children: ['Firmware & FileSystem']
                    },
                    {
                        type: 'div',
                        props: {class: 'col-sm-12'},
                        children: [
                            {
                                type: 'input',
                                props: { 
                                    class: 'form-control', 
                                    type: 'file', 
                                    id: 'fileFirmware',
                                    accept: 'application/octet-stream'
                                },
                                children: []
                            }
                        ]
                    },
                    {
                        type: 'h6',
                        props: { class: 'text-secondary mt-3'},
                        children: [
                            {
                                type: 'strong', 
                                props: {}, 
                                children: ['Nota: Si el nombre de archivo incluye (spiffs), actualiza la partición del FileSystem']
                            }
                        ]
                    }
                ]
            },
            {
                type: 'button',
                props: {
                    class: 'btn btn-danger',
                    onclick:()=>{ uploadFirmware(); }
                },
                children: [
                    {
                        type: 'i',
                        props: {class: 'bi bi-box-arrow-in-down me-1'},
                        children: []
                    },
                    'Importar'
                ]
            },
            {
                type: 'div',
                props: {class: 'firmwareLoading', style: 'display: none'},
                children: [
                    {
                        type: 'h5',
                        props: {class: 'card-title mt-2'},
                        children: [
                            'Cargando'
                        ]
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

                                },
                                children: [ '100']
                            }
                        ]
                    }
                ]
            }
        ]
    });
    // todos los inputs del settings
    const inputsSettings = builder({
        type: 'div',
        props: {class: 'card-body'},
        children: [
            {
                type: 'h5',
                props: { class: 'card-title'},
                children: [ 'Archivo de configuraciones (setting.json).' ]
            },
            {
                type: 'div',
                props: {class: 'row mb-3'},
                children: [
                    {
                        type: 'label',
                        props: {class: 'col-sm-12 col-form-label', for: 'fileSettings'},
                        children: ['Subir el archivo de configuración (settings.json)']
                    },
                    {
                        type: 'div',
                        props: {class: 'col-sm-12'},
                        children: [
                            {
                                type: 'input',
                                props: { 
                                    class: 'form-control', 
                                    type: 'file', 
                                    id: 'fileSettings',
                                    accept: 'application/json'
                                },
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                type: 'button',
                props: {
                    class: 'btn btn-success',
                    onclick:()=>{ uploadSettings(); }
                },
                children: [
                    {
                        type: 'i',
                        props: { class: 'bi bi-cloud-arrow-up-fill me-1' },
                        children: []
                    },
                    'Importar'
                ]
            },  
            {
                type: 'label',
                props: {class: 'col-sm-12 col-form-label mt-3', for: 'fileFirmware'},
                children: ['Descargar archivo de onfiguración (settings.json)']
            },
            {
                type: 'h6',
                props: { class: 'text-secondary'},
                children: [
                    {
                        type: 'strong', 
                        props: {}, 
                        children: ['Nota: Use este Botón para exportar las configuraciones actuales']
                    }
                ]
            },
            {
                type: 'button',
                props: {
                    class: 'btn btn-secondary',
                    onclick:()=>{ settingDonwload(); }
                },
                children: [
                    {
                        type: 'i',
                        props: { class: 'bi bi-cloud-download-fill me-1' },
                        children: []
                    },
                    'Descargar'
                ]
            }      
        ]     
    });
    /* 
    * Funcion crear toda la pagina e inyectar en el main del html
    * clase card para crear las card en cada columna
    */
    const section = builder({
        type: 'section',
        props: {class: 'section'},
        children:[
            {
                type: 'div',
                props: {class: 'row'},
                children:[
                    {
                        type: 'div',
                        props: {class: 'col-lg-6'},
                        children: [
                            new card('Firmware o Filesystem', inputsFirmware).buildCard()
                        ]
                    },
                    {
                        type: 'div',
                        props: {class: 'col-lg-6'},
                        children: [
                            new card('Archivo de configuración (setting.json)', inputsSettings).buildCard()
                        ]
                    }
                ]
            }
        ]
    });
    /* 
    * Agregar el html creado en el main
    */
    document.querySelector('#main').appendChild(section);
     /* 
    * Sacar alert superior desde localstorage
    * @param {boolean} var -- localStorage.getItem('save') captura var desde localstorage
    */
    if(localStorage.getItem('save')){
        alertMsg('danger', '¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!');
    }
    // función para subir el firmware o el filesystem
    const uploadFirmware= async ()=>{
        const input = document.getElementById("fileFirmware");
        const file = input.files[0];
        // aplicar validaciones
        if(file != undefined){
            // tamaño del archivo 1966080 bytes desde platformio
            if(Number(file["size"]) > 1966080){
                SweetAlertMsg('top-end', 'error', '¡El tamaño máximo del archivo tiene que ser de ( 1.9 MB )!', 5000);
                return
            }else if(file["type"] != "application/octet-stream"){ // tipo de archivo
                SweetAlertMsg('top-end', 'error', '¡Solo son permitidos archivos ( *.BIN )!', 5000);
                return
            }else{}
        }else{
            SweetAlertMsg('top-end', 'warning', '¡Debes seleccionar un archivo( *.BIN )!', 5000);
            return
        }
        // mostrar el progressbar
        const div = document.querySelector('.firmwareLoading');
        div.style.cssText = "display:block;";
        // ejecutar el metodo POST de la API
        const postFirmware = new ApiService('device/firmware', file);
        const resp = await postFirmware.postFirmware();
        if(resp.save)
            SweetAlertMsg('top-end', 'success', `¡${resp.type} actualizado correctamente!`, 5000);

        // Ocultar el progressbar
        div.style.cssText = "display:none;";
        reloadPage('', 10000);
    }
    // función paradescargar el setting.json
    const settingDonwload = async() => {
        const getSettings = new ApiService('device/download');
        const resp = await getSettings.getApiData();
        downloadObjectAsJson(resp, 'settings.json');
    }
    // función para crear un archivo desde un objeto json
    const downloadObjectAsJson = (exportObj, filename)=>{
        const blob = new Blob([JSON.stringify(exportObj)], { type: "text/json" });
        const link = document.createElement("a");
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
        const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        link.dispatchEvent(evt);
        link.remove();
    }
    // función subir el archivo settings.json
    const uploadSettings= async()=>{
        const input = document.getElementById("fileSettings");
        const file = input.files[0];

        // validaciones
        if(file != undefined){
            if(file["name"] != "settings.json"){
                SweetAlertMsg('top-end', 'error', '¡Solo se permite el archivo de configuración ( settings.json )!', 5000);
                return
            }else if(Number(file["size"]) > 14336){
                SweetAlertMsg('top-end', 'error', '¡El tamaño máximo permitido es de ( 14.0 KB )!', 5000);
                return
            }else if(file["type"] != "application/json"){
                SweetAlertMsg('top-end', 'error', '¡Solo son permitidos archivos ( *.JSON )!', 5000);
                return
            }else{}
        }else{
            SweetAlertMsg('top-end', 'warning', '¡Debes seleccionar un archivo ( *.JSON )!', 5000);
            return
        }

        // Ejecutar la peticion a la API
        const postSettings = new ApiService('device/upload', file);
        const resp = await postSettings.postFileApi();

        console.log(resp)

        if(resp.save){
            SweetAlertMsg('top-end', 'success', `${resp.msg}`, 5000);
            reloadPage('', 10000);
        }

    }

}