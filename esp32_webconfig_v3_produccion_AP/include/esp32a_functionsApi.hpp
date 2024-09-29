/* -------------------------------------------------------------------
 ;* AdminESP - ElectronicIOT 2023
 ;* Sitio WEB: https://electroniciot.com
 ;* Correo: admin@electroniciot.com
 ;* Cel_WSP: +591 71243395
 ;* Plataforma: ESP32
 ;* Framework:  Arduino - Platformio - VSC
 ;* Proyecto: Panel Administrativo para el ESP32 con JavaScript
 ;* Nombre: ESP32 Admin Tool v3
 ;* Autor: Ing. Yamir Hidalgo Peña
 ;* -------------------------------------------------------------------
;*/

// -------------------------------------------------------------------
// Parametros de configuración Index
// Método: GET
// API o MQTT
// -------------------------------------------------------------------
String apiGetIndex(String IPv4, String Browser){
    String response = "";
	DynamicJsonDocument jsonDoc(2048);
    // GENERAL
    jsonDoc["serial"] = DeviceID();
    jsonDoc["device"] = platform();
    jsonDoc["wifiQuality"] = WiFi.status() == WL_CONNECTED ? getRSSIasQuality(WiFi.RSSI()) : 0;
    jsonDoc["wifiStatus"] = WiFi.status() == WL_CONNECTED ? true : false;
    jsonDoc["rssiStatus"] = WiFi.status() == WL_CONNECTED ? WiFi.RSSI() : 0;
    jsonDoc["mqttStatus"] = mqttClient.connected() ? true : false;
    jsonDoc["reboots"] = device_restart;
    jsonDoc["activeTime"] = longTimeStr(millis() / 1000);
    // WIFI
    JsonObject wifiObj = jsonDoc.createNestedObject("wifi");
    wifiObj["Estado_WiFi"] = WiFi.status() == WL_CONNECTED ? "ONLINE" : "OFFLINE";
    wifiObj["SSID_WiFi"] =  wifi_mode == WIFI_STA ? wifi_ssid : ap_ssid;
    wifiObj["IPv4_WiFi"] =  wifi_mode == WIFI_STA ? ipStr(WiFi.localIP()) : ipStr(WiFi.softAPIP());
    wifiObj["MAC_WiFi"] =  WiFi.macAddress();
    // MQTT
    JsonObject mqttObj = jsonDoc.createNestedObject("mqtt");
    mqttObj["Estado_MQTT"] =  mqttClient.connected() ? "ONLINE" : "OFFLINE";
    mqttObj["Servidor_MQTT"] =  mqttClient.connected() ? mqtt_server : "server not connected";
    mqttObj["Usuario_MQTT"] =  mqtt_user;
    mqttObj["Cliente_ID_MQTT"] =  mqtt_id;
    // INFO
    JsonObject infoObj = jsonDoc.createNestedObject("info");
    infoObj["Identificación"] =  device_name;
    infoObj["Número_de_Serie"] =  DeviceID();
    infoObj["mDNS_Url"] =  String("http://"+String(device_name)+".local/");
    infoObj["Dirección_IP_del_Cliente"] =  IPv4;
    infoObj["Navegador_del_Cliente"] =  Browser;
    infoObj["Versión_del_Firmware"] =  device_fw_version;
    infoObj["Versión_del_Hardware"] =  device_hw_version;
    infoObj["CPU_FREQ_MHz"] =  getCpuFrequencyMhz();
    infoObj["RAM_SIZE_KB"] =  ESP.getHeapSize() / 1024;
    infoObj["SPIFFS_SIZE_KB"] =  SPIFFS.totalBytes() / 1024;
    infoObj["FLASH_SIZE_MB"] =  ESP.getFlashChipSize() / (1024.0 * 1024);
    infoObj["Fabricante"] =  device_manufacturer;
    infoObj["Tiempo_de_Actividad_del_Sistema"] =  longTimeStr(millis() / 1000);
    infoObj["Cantidad_de_Reinicios"] =  device_restart;
    // GENERAL
    jsonDoc["spiffsUsed"] = SPIFFS.usedBytes() / 1024;
    jsonDoc["ramAvailable"] = ESP.getFreeHeap() / 1024;
    jsonDoc["cpuTemp"] = TempCPUValue();
    // Relays
    StaticJsonDocument<100> obj1; // Buffer
    StaticJsonDocument<100> obj2; // Buffer
    JsonObject relay1 = obj1.to<JsonObject>();//  objeto 1
    relay1["name"] = "RELAY1";
    relay1["status"] = RELAY1_STATUS ? true : false; 

    JsonObject relay2 = obj2.to<JsonObject>(); // objeto 2
    relay2["name"] = "RELAY2";;
    relay2["status"] = RELAY2_STATUS ? true : false; 

    JsonArray relays = jsonDoc.createNestedArray("relays"); // crear el array
    relays.add(relay1); // agregar objeto 1 dentro del array 
    relays.add(relay2); // agregar objeto 2 dentro del array 
    // GENERAL
    jsonDoc["dimmer"] = dim;
    // poner el json dentro del string y retornar
    serializeJson(jsonDoc, response);
	return response;
}
// -------------------------------------------------------------------
// Leer parámetros de configuración WiFi
// Método: GET
// API o MQTT
// -------------------------------------------------------------------
String apiGetWiFi(){
    String response = "";
	DynamicJsonDocument jsonDoc(512);
    // GENERAL
    jsonDoc["serial"] = DeviceID();
    jsonDoc["device"] = platform();
    jsonDoc["wifiQuality"] = WiFi.status() == WL_CONNECTED ? getRSSIasQuality(WiFi.RSSI()) : 0;
    jsonDoc["wifiStatus"] = WiFi.status() == WL_CONNECTED ? true : false;
    jsonDoc["rssiStatus"] = WiFi.status() == WL_CONNECTED ? WiFi.RSSI() : 0;
    jsonDoc["mqttStatus"] = mqttClient.connected() ? true : false;
    // WIFI
    JsonObject wifiObj = jsonDoc.createNestedObject("wifi");
    wifiObj["wifi_mode"] = wifi_mode ? true : false;
    wifiObj["wifi_ssid"] =  wifi_ssid;
    wifiObj["wifi_password"] =  "";
    wifiObj["wifi_ip_static"] =  wifi_ip_static ? true : false;
    wifiObj["wifi_ipv4"] =  wifi_ipv4;
    wifiObj["wifi_gateway"] =  wifi_gateway;
    wifiObj["wifi_subnet"] =  wifi_subnet;
    wifiObj["wifi_dns_primary"] =  wifi_dns_primary;
    wifiObj["wifi_dns_secondary"] =  wifi_dns_secondary;
    wifiObj["ap_ssid"] =  ap_ssid;
    wifiObj["ap_password"] =  "";
    wifiObj["ap_chanel"] =  ap_chanel;
    wifiObj["ap_visibility"] =  ap_visibility ? false : true;
    wifiObj["ap_connect"] =  ap_connect;
    // code
    jsonDoc["code"] = 1;
    serializeJson(jsonDoc, response);
	return response;
}
// -------------------------------------------------------------------
// Método POST actualizar configuraciones WiFi
// Método: POST
// API o MQTT
// -------------------------------------------------------------------
boolean apiPostWiFi(String data){
    bool response = false;
    DynamicJsonDocument doc(768);
    DeserializationError error = deserializeJson(doc, data);
    if (error){
        response = false;
        return response;
    };
    // -------------------------------------------------------------------
    // WIFI Cliente settings.json
    // -------------------------------------------------------------------
    String s = "";
    // APP Mode
    wifi_mode = doc["wifi_mode"].as<bool>();
    // SSID Client
    if (doc["wifi_ssid"] != ""){
        s = doc["wifi_ssid"].as<String>();
        s.trim();
        strlcpy(wifi_ssid, s.c_str(), sizeof(wifi_ssid));
        s = "";
    }
    // Password SSID Client
    if (doc["wifi_password"] != ""){
        s = doc["wifi_password"].as<String>();
        s.trim();
        strlcpy(wifi_password, s.c_str(), sizeof(wifi_password));
        s = "";
    }
    // DHCP
    wifi_ip_static = doc["wifi_ip_static"].as<bool>();
    // IPV4
    if (doc["wifi_ipv4"] != ""){
        s = doc["wifi_ipv4"].as<String>();
        s.trim();
        strlcpy(wifi_ipv4, s.c_str(), sizeof(wifi_ipv4));
        s = "";
    }
    // Gateway
    if (doc["wifi_gateway"] != ""){
        s = doc["wifi_gateway"].as<String>();
        s.trim();
        strlcpy(wifi_gateway, s.c_str(), sizeof(wifi_gateway));
        s = "";
    }             
    // Subned
    if (doc["wifi_subnet"] != ""){
        s = doc["wifi_subnet"].as<String>();
        s.trim();
        strlcpy(wifi_subnet, s.c_str(), sizeof(wifi_subnet));
        s = "";
    } 
    // DNS Primary
    if (doc["wifi_dns_primary"] != ""){
        s = doc["wifi_dns_primary"].as<String>();
        s.trim();
        strlcpy(wifi_dns_primary, s.c_str(), sizeof(wifi_dns_primary));
        s = "";
    }
    // DNS Secondary
    if (doc["wifi_dns_secondary"] != ""){
        s = doc["wifi_dns_secondary"].as<String>();
        s.trim();
        strlcpy(wifi_dns_secondary, s.c_str(), sizeof(wifi_dns_secondary));
        s = "";
    }
    // -------------------------------------------------------------------
    // WIFI AP settings.json
    // -------------------------------------------------------------------  
    // AP SSID
    if (doc["ap_ssid"] != ""){
        s = doc["ap_ssid"].as<String>();
        s.trim();
        strlcpy(ap_ssid, s.c_str(), sizeof(ap_ssid));
        s = "";
    }          
    // AP Password
    if (doc["ap_password"] != ""){
        s = doc["ap_password"].as<String>();
        s.trim();
        strlcpy(ap_password, s.c_str(), sizeof(ap_password));
        s = "";
    }
    // AP visibility 0 Visible - 1 Oculto
    ap_visibility = !doc["ap_visibility"].as<int>(); 
    // AP Channel
    if (doc["ap_chanel"] != ""){
        ap_chanel = doc["ap_chanel"].as<int>();
    }
    // AP number of Connections
    if (doc["ap_connect"] != ""){
        ap_connect = doc["ap_connect"].as<int>();
    }
    // Save Settings.json
    if (settingsSave()){
        response = true;
    }
    return response;
}
// -------------------------------------------------------------------
// Escanear todas las redes WIFI al alcance de la señal
// Método: GET
// API o MQTT
// -------------------------------------------------------------------
String apiGetWiFiScan(){
    String response = "";
	DynamicJsonDocument jsonDoc(10240); // 10Kbyte - Testeado para 20 redes con 5Kbyte OK
    int n = WiFi.scanComplete();
    if (n == -2){
        JsonObject metaObj = jsonDoc.createNestedObject("meta");
        metaObj["serial"] = DeviceID();
        metaObj["count"] = 0;
        JsonArray data = jsonDoc.createNestedArray("data");
        jsonDoc["code"] = 0;
    }else if(n){
        JsonObject metaObj = jsonDoc.createNestedObject("meta");
        metaObj["serial"] = DeviceID();
        metaObj["count"] = n;
        // llenar la data de redes
        JsonArray data = jsonDoc.createNestedArray("data");
        for (int i = 0; i < n; ++i){
            StaticJsonDocument<512> obj; // Buffer
            JsonObject red = obj.to<JsonObject>();//  objeto 1
            red["n"] = i+1;
            red["rssi"] = WiFi.RSSI(i);
            red["ssid"] = WiFi.SSID(i);
            red["bssid"] = WiFi.BSSIDstr(i);
            red["channel"] = WiFi.channel(i);
            red["secure"] = EncryptionType(WiFi.encryptionType(i));
            data.add(red);
        }
        // fin de llenar data de redes
        jsonDoc["code"] = 1;
    }else{}
    WiFi.scanDelete();
    if (WiFi.scanComplete() == -2){
        WiFi.scanNetworks(true, true);
    }
    serializeJson(jsonDoc, response);
	return response;
}
// -------------------------------------------------------------------
// Parámetros de configuración MQTT
// Método: GET
// API o MQTT
// -------------------------------------------------------------------
String apiGetMqtt(){
    String response = "";
	DynamicJsonDocument jsonDoc(512);
    // GENERAL
    jsonDoc["serial"] = DeviceID();
    jsonDoc["device"] = platform();
    jsonDoc["wifiQuality"] = WiFi.status() == WL_CONNECTED ? getRSSIasQuality(WiFi.RSSI()) : 0;
    jsonDoc["wifiStatus"] = WiFi.status() == WL_CONNECTED ? true : false;
    jsonDoc["rssiStatus"] = WiFi.status() == WL_CONNECTED ? WiFi.RSSI() : 0;
    jsonDoc["mqttStatus"] = mqttClient.connected() ? true : false;
    // mqtt
    JsonObject mqttObj = jsonDoc.createNestedObject("mqtt");
    mqttObj["mqtt_enable"] = mqtt_enable ? true : false;
    mqttObj["mqtt_server"] =  mqtt_server;
    mqttObj["mqtt_port"] =  mqtt_port;
    mqttObj["mqtt_retain"] =  mqtt_retain ? true : false;
    mqttObj["mqtt_qos"] =  mqtt_qos;
    mqttObj["mqtt_id"] =  mqtt_id;
    mqttObj["mqtt_user"] =  mqtt_user;
    mqttObj["mqtt_password"] =  "";
    mqttObj["mqtt_clean_sessions"] =  mqtt_clean_sessions ? true :  false;
    mqttObj["mqtt_time_send"] =  mqtt_time_send ? true : false;
    mqttObj["mqtt_time_interval"] =  mqtt_time_interval / 1000;
    mqttObj["mqtt_status_send"] =  mqtt_status_send ? true : false;
    // code
    jsonDoc["code"] = 1;
    serializeJson(jsonDoc, response);
	return response;
}
// -------------------------------------------------------------------
// Actualizar las configuraciones del MQTT Conexiones
// Método: POST
// API o MQTT
// -------------------------------------------------------------------
boolean apiPostMqtt(String data){
    bool response = false;
    DynamicJsonDocument doc(768);
    DeserializationError error = deserializeJson(doc, data);
    if (error){
        response = false;
        return response;
    };
    //  -------------------------------------------------------------------
    //  MQTT Conexión settings.json
    //  -------------------------------------------------------------------
    String s = "";
    // MQTT Enable
    mqtt_enable = doc["mqtt_enable"].as<bool>();
    // MQTT Server
    if (doc["mqtt_server"] != ""){
        s = doc["mqtt_server"].as<String>();
        s.trim();
        strlcpy(mqtt_server, s.c_str(), sizeof(mqtt_server));
        s = "";
    }
    // MQTT Port
    if (doc["mqtt_port"] != ""){
        mqtt_port = doc["mqtt_port"].as<int>();
    }
    // MQTT Retain
    mqtt_retain = doc["mqtt_retain"].as<bool>();
    // MQTT QOS 0-1-2
    mqtt_qos = doc["mqtt_qos"].as<int>();
    // MQTT ID
    if (doc["mqtt_id"] != ""){
        s = doc["mqtt_id"].as<String>();
        s.trim();
        strlcpy(mqtt_id, s.c_str(), sizeof(mqtt_id));
        s = "";
    }
    // MQTT User
    if (doc["mqtt_user"] != ""){
        s = doc["mqtt_user"].as<String>();
        s.trim();
        strlcpy(mqtt_user, s.c_str(), sizeof(mqtt_user));
        s = "";
    }
    // MQTT Password
    if (doc["mqtt_password"] != ""){
        s = doc["mqtt_password"].as<String>();
        s.trim();
        strlcpy(mqtt_password, s.c_str(), sizeof(mqtt_password));
        s = "";
    }
    // mqtt_clean_sessions
    mqtt_clean_sessions = doc["mqtt_clean_sessions"].as<bool>();    
    // -------------------------------------------------------------------
    // MQTT Envio de datos settings.json
    // -------------------------------------------------------------------
    // mqtt_time_send
    mqtt_time_send = doc["mqtt_time_send"].as<bool>();
    // mqtt_time_interval
    mqtt_time_interval = doc["mqtt_time_interval"].as<int>() * 1000; // 60 * 1000 = 60000 = 60s
    // mqtt_status_send
    mqtt_status_send = doc["mqtt_status_send"].as<bool>();
    // Save Settings.json
    if (settingsSave()){
        response = true;
    }
    return response;
}
// -------------------------------------------------------------------
// Manejo de parámetros de estados Globales
// Método: GET
// API o MQTT
// -------------------------------------------------------------------
String apiGetStatus(){
    String response = "";
	DynamicJsonDocument jsonDoc(512);
    // GENERAL
    jsonDoc["serial"] = DeviceID();
    jsonDoc["device"] = platform();
    jsonDoc["wifiQuality"] = WiFi.status() == WL_CONNECTED ? getRSSIasQuality(WiFi.RSSI()) : 0;
    jsonDoc["wifiStatus"] = WiFi.status() == WL_CONNECTED ? true : false;
    jsonDoc["rssiStatus"] = WiFi.status() == WL_CONNECTED ? WiFi.RSSI() : 0;
    jsonDoc["mqttStatus"] = mqttClient.connected() ? true : false;
    // code
    jsonDoc["code"] = 1;
    serializeJson(jsonDoc, response);
	return response;
}
// -------------------------------------------------------------------
// Función para reiniciar el dispositivo Global -> API, MQTT, WS
// Método: POST
// API o MQTT
// -------------------------------------------------------------------
void apiPostRestart(String origin){
    log("INFO", "Dispositivo reiniciado desde: "+origin);
    Serial.flush();
    ESP.restart();
}
// -------------------------------------------------------------------
// Función para restablecer el dispositivo Global -> API, MQTT, WS
// Método: POST
// API o MQTT
// -------------------------------------------------------------------
void apiPostRestore(String origin){
    settingsReset(); // Todo a fabrica
    if(settingsSave()){
        log("INFO", "Dispositivo restablecido desde: "+origin);
        // Esperar la transmisión de los datos seriales ( para agregar delay asyncrono antes del reinicio ) 
        Serial.flush();
        // Reinicia el ESP32
        ESP.restart();
    }    
}
// -------------------------------------------------------------------
// Actualizar las configuraciones del acceso al servidor - contraseña
// Método: POST
// API o MQTT
// Códigos de respuestas
// 0 - Error de json enviado
// 1 - Error de contraseña anterior en blanco
// 2 - Error de contraseña nueva y confirmación en blanco
// 3 - Error de contraseña nueva diferente a la anterior
// 4 - Error de contraseña nueva la anterior tienene que ser iguales
// 5 - Error de contraseña contraseña anterior no coincide
// 6 - Contraseña actualizada correctamente
// -------------------------------------------------------------------
int apiPostUser(String data){
    int response;
    DynamicJsonDocument doc(320);
    DeserializationError error = deserializeJson(doc, data);
    if (error){       
        return  response = 0;
    };
    // -------------------------------------------------------------------
    // Contraseña settings.json
    // -------------------------------------------------------------------
    String p, np, cp;
    // capturamos las variables enviadas en el JSON
    p = doc["device_old_password"].as<String>();    // Contraseña Actual
    np = doc["device_new_password"].as<String>();   // Nueva Contraseña
    cp = doc["device_c_new_password"].as<String>(); // Confirmación de nueva Contraseña
    // Limpiamos de espacios vacios
    p.trim();
    np.trim();
    cp.trim();
    // Validar que los datos de lacontraseña anterior no este en blanco
    if(p != ""){
        // validar que la contraseña coincida con la anterior
        if( p == device_password ){
            if(np == "" && cp == ""){
                response = 2;
            } else if(np != "" && cp != "" && np == cp){
                if(np == device_password){
                    response = 3;
                }
                strlcpy(device_password, np.c_str(), sizeof(device_password));
                if (settingsSave()) {
                    response = 6;
                } 
            }else if( np !=  cp ){
                response = 4;
            }else{}
        }else{
           response = 5;
        }
    }else{
        response = 1;
    }
    return response;
}
// -------------------------------------------------------------------
// Función para operar los Relay de forma Global -> API, MQTT, WS
// ejemplo: {"protocol": "MQTT", "output": "RELAY1", "value": true }
// ejemplo: {"protocol": "API", "output": "RELAY1", "value": true }
// -------------------------------------------------------------------
boolean apiPostOnOffRelays(String command){

    DynamicJsonDocument JsonCommand(320);
    deserializeJson(JsonCommand, command); 

    log("INFO", "Comando enviado desde: "+JsonCommand["protocol"].as<String>()+" <=> "+JsonCommand["output"].as<String>()+" <=> "+JsonCommand["value"].as<String>());

    if(JsonCommand["value"] == true){
        digitalWrite(JsonCommand["output"] == "RELAY1" ? RELAY1 : RELAY2, HIGH);
        JsonCommand["output"] == "RELAY1" ? RELAY1_STATUS = HIGH : RELAY2_STATUS = HIGH ;
        return true;
    }else if(JsonCommand["value"] == false ){
        digitalWrite(JsonCommand["output"] == "RELAY1" ? RELAY1 : RELAY2, LOW);
        JsonCommand["output"] == "RELAY1" ? RELAY1_STATUS = LOW : RELAY2_STATUS = LOW ;
        return false;
    }else{
        log("WARNING", "Comando NO permitido");
        return false;
    }
}

// -------------------------------------------------------------------
// Función para el dimmer dispositivo Global -> API, MQTT, WS
// ejemplo: {"protocol": "API", "output": "Dimmer", "value": 0-100 }
// -------------------------------------------------------------------
void apiPostDimmer(String dimmer){

    DynamicJsonDocument JsonDimmer(320);

    deserializeJson(JsonDimmer, dimmer);  

    log("INFO", "Comando enviado desde: "+JsonDimmer["protocol"].as<String>()+" => "+JsonDimmer["output"].as<String>()+" => "+JsonDimmer["value"].as<String>()+" %");

    dim = JsonDimmer["value"].as<int>();

    if( dim > 100 )  dim = 100;
    if( dim < 0   )  dim = 0;

    if(settingsSave())
        ledcWrite(ledChannel, dim * 2.55); 
        // multiplicamos por 2.55*100 para llegar a 255 que seria el maximo a 8bit = 3.3V
}