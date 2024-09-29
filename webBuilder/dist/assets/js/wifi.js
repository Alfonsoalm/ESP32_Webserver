"use strict";import{ApiService,createBreadCrumb,headerIconsStatus,createSwitch,createInputType,formDisable,builder,initTooltips,SweetAlert,alertMsg}from"./scripts.js";import{wifiMainInput}from"./template.js";async function iniciarWifi(){document.title="WIFI | ESP32 Admin Tool v3",createBreadCrumb("Configuración del WiFi","Conexiones","WiFi");const resp=await new ApiService("connection/wifi").getApiData();function buildcard(){var card=builder({type:"card",props:{class:"card"},children:[{type:"div",props:{class:"card-body bg-secondary-light",id:"scanBody"},children:[{type:"div",props:{class:"badge bg-primary text-uppercase mt-3"},children:["0 Redes encontradas"]},{type:"div",props:{class:"text-center mt-5 text-lg fs-4"},children:[{type:"i",props:{class:"bi bi-wifi text-success",style:"font-size: 100px"}},{type:"div",props:{class:"text-center py-5"},children:[{type:"h4",props:{class:"fw-bold text-success text-uppercase mb-0",id:"scanH4"},children:["NINGUNA RED WIFI ENCONTRADA"]}]},{type:"button",props:{class:"btn btn-success me-1 mb-3",onclick:()=>{scan()},id:"scanBtn"},children:[{type:"i",props:{class:"bi bi-fw bi-search opacity-50 me-1"}},"Escanear"]}]}]}]}),contenedor=document.querySelector("#cardScan");contenedor.innerHTML="",contenedor.appendChild(card)}headerIconsStatus(resp.wifiStatus,resp.rssiStatus,resp.mqttStatus),wifiMainInput.forEach((inputValue,index)=>{inputValue.inputId===Object.keys(resp.wifi)[index]&&(inputValue.value=resp.wifi[inputValue.inputId])}),wifiMainInput.forEach(input=>{(input.switch?createSwitch:createInputType)(input.parentId,input.inputId,input.type,input.label1,input.label2,input.value,input.classe)}),ip=document.querySelector("#wifi_ip_static"),document.querySelector("#wifi_mode").checked?(formDisable("ap",!0),formDisable("client",!1)):(formDisable("ap",!1),formDisable("client",!0)),ip.checked?formDisable("ip",!1):formDisable("ip",!0),buildcard();const scan=async()=>{document.querySelector("#scanH4").innerHTML="ESCANEANDO REDES WIFI CERCANAS",document.querySelector("#scanBtn").disabled=!0,document.querySelector("#scanBtn").innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Escaneando...';var resp=await new ApiService("connection/wifi-scan").getApiData();if(0!==resp.code){var tbody={type:"tbody",children:[]};for(const{n,ssid,rssi,secure,bssid,channel}of resp.data){var tr={type:"tr",children:[{type:"td",children:[""+n]},{type:"td",children:[""+ssid]},{type:"td",children:[""+rssi]},{type:"td",children:[bssid+" / "+secure]},{type:"td",children:[""+channel]},{type:"td",children:[{type:"button",props:{class:"btn btn-success btn-sm",onclick:()=>{select(""+ssid)},bsToggle:"tooltip",bsPlacement:"top",bsOriginalTitle:`Seleccionar la red "${ssid}"`},children:[{type:"i",props:{class:"bi bi-check-circle"}}]}]}]};tbody.children.push(tr)}var scanBody=document.querySelector("#scanBody"),resp=(scanBody.innerHTML="",builder({type:"div",props:{class:"badge bg-primary text-uppercase mt-3",id:"scanH4"},children:[resp.meta.count+" Redes encontradas"]})),scanTable=builder({type:"div",props:{class:"table-responsive"},children:[{type:"table",props:{class:"table table-borderless datatable align-middle"},children:[{type:"thead",children:[{type:"tr",children:[{type:"th",props:{scope:"col"},children:["#"]},{type:"th",props:{scope:"col"},children:["SSID"]},{type:"th",props:{scope:"col"},children:["Señal (dBm)"]},{type:"th",props:{scope:"col"},children:["BSSID/Secure"]},{type:"th",props:{scope:"col"},children:["Canal"]},{type:"th",props:{scope:"col"},children:["Acción"]}]}]},tbody]},{type:"button",props:{class:"btn btn-success me-1 mb-3",onclick:()=>{buildcard()}},children:[{type:"i",props:{class:"bi bi-fw bi-search opacity-50 me-1"}},"Volver a escanear"]}]});scanBody.appendChild(resp),scanBody.appendChild(scanTable),initTooltips()}else document.querySelector("#scanH4").innerHTML="NINGUNA RED WIFI ENCONTRADA",document.querySelector("#scanBtn").disabled=!1,document.querySelector("#scanBtn").innerHTML='<i class="bi bi-fw bi-search opacity-50 me-1"></i> Escanear'},select=ssid=>{document.getElementById("wifi_ssid").value=ssid};var ip=builder({type:"div",props:{class:"col-sm-10"},children:[{type:"button",props:{class:"btn btn-primary",id:"submitWifi",type:"submit"},children:["Enviar"]}]});document.querySelector("#btnSendWifi").appendChild(ip),document.querySelector("#form").addEventListener("submit",event=>{event.preventDefault();event=document.querySelectorAll(".wifi");let data={wifi_mode:"",wifi_ssid:"",wifi_password:"",wifi_ip_static:"",wifi_ipv4:"",wifi_subnet:"",wifi_gateway:"",wifi_dns_primary:"",wifi_dns_secondary:"",ap_ssid:"",ap_password:"",ap_visibility:"",ap_chanel:"",ap_connect:""};event.forEach((inputValue,index)=>{inputValue.id===Object.keys(data)[index]&&(data[inputValue.id]="checkbox"===inputValue.type?inputValue.checked:inputValue.value)}),SweetAlert("¿Desea guardar?","La configuración del WiFi","question","connection/wifi",data)}),localStorage.getItem("save")&&alertMsg("danger","¡Se han realizado cambios en la configuración, es necesario reiniciar el equipo!")}export{iniciarWifi};