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

#include <PubSubClient.h>

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

char topic[150];

String mqtt_data = "";

long lastMqttReconnectAttempt = 0; 
long lasMsg = 0;

// -------------------------------------------------------------------
// DEFINICION DE FUNCIONES
// -------------------------------------------------------------------
boolean mqtt_connect();
void callback(char *topic, byte *payload, unsigned int length);
void mqtt_publish();
String Json();
void mqttloop();
boolean apiPostOnOffRelays(String command);

// -------------------------------------------------------------------
// MQTT Connect
// -------------------------------------------------------------------
boolean mqtt_connect(){
    mqttClient.setServer(mqtt_server, mqtt_port);
    mqttClient.setCallback(callback);
    log("MQTT", "Intentando conexión al Broker MQTT ...");
    // https://pubsubclient.knolleary.net/api.html  
    // https://www.amebaiot.com/zh/rtl8722dm-arduino-api-pubsubclient/

    // boolean connect (clientID)  
    // boolean connect (clientID, willTopic, willQoS, willRetain,willMessage)  
    // boolean connect (clientID, username, password)  
    // boolean connect (clientID, username, password, willTopic, willQoS, willRetain, willMessage)  
    // * boolean connect (clientID, username, password, willTopic, willQoS, willRetain, willMessage, cleanSession) 

    /* 
        Parámetros id: ID de cliente, un identificador de cadena único 
        usuario: nombre de usuario para autenticación, valor predeterminado NULL 
        pass: contraseña para autenticación, valor predeterminado NULL 
        willTopic: el tema que utilizará el mensaje 
        willQoS: la calidad del servicio que utilizará el mensaje will 
        willRetain: si el testamento debe publicarse con el indicador de retención 
        willMessage: la carga del mensaje del testamento
        cleanSession: Si cleansession se establece en true , se eliminarán todos los temas suscritos
    */
    String topic_publish = PathMqttTopic("status");
    topic_publish.toCharArray(mqtt_willTopic, 150);

    if(mqttClient.connect(mqtt_id, mqtt_user, mqtt_password, mqtt_willTopic, mqtt_willQoS, mqtt_willRetain, mqtt_willMessage, mqtt_clean_sessions)){
        log("INFO","Conectado al Broker MQTT");

        mqttClient.setBufferSize(1024*5);
        log("INFO", "Buffer MQTT Size: " +String(mqttClient.getBufferSize())+ " Bytes");

        String topic_subscribe = PathMqttTopic("command");
        topic_subscribe.toCharArray(topic, 150);
        // Nos suscribimos a comandos Topico: v1/device/usuario/dispositivo/comando
        // boolean subscribe (topic)
        // * boolean subscribe (topic, [qos])
        // qos - optional the qos to subscribe at (int: 0 or 1 only)
        // Función para suscribirnos al Topico
        if(mqttClient.subscribe(topic, mqtt_qos)){
            log("INFO","Suscrito al tópico: " + String(topic));
        }else{
            log("ERROR","MQTT - Falló la suscripción"); 
        }

        if(mqtt_status_send){
            // int publish (topic, payload)
            //  * int publish (topic, payload, retained)
            // int publish (topic, payload, length, retained)
            // topic - the topic to publish to (const char[])
            // payload - the message to publish (const char[])
            // retained - informacion retenida (boolean)
            // length - the length of the message (byte)
            mqttClient.publish(mqtt_willTopic, "{\"connected\": true}", mqtt_retain );
        }

    }else{
        log("ERROR","MQTT - Falló, código de error = " + String(mqttClient.state()));
        return (0);
    }
    return (1);
}
// -------------------------------------------------------------------
// Manejo de los Mensajes Entrantes --- controlar los relays
// -------------------------------------------------------------------
void callback(char *topic, byte *payload, unsigned int length){
    String command = "";
    String str_topic(topic);

    for(int16_t i = 0; i < length; i++){
        command += (char)payload[i];
        // TODO: pestañeo de led MQTT

    }   

    command.trim();
    log("INFO","MQTT Tópico  --> " + str_topic);
    log("INFO","MQTT Mensaje --> " + command);
    
    // TODO: responder al MQTT el estado de los relays
    apiPostOnOffRelays(command);

}
// -------------------------------------------------------------------
// Manejo de los Mensajes Salientes
// ------------------------------------------------------------------- 
void mqtt_publish(){
    String topic = PathMqttTopic("device");
    log("MQTT", topic);

    mqtt_data = Json();
    mqttClient.publish(topic.c_str(), mqtt_data.c_str(), mqtt_retain);
    mqtt_data = "";
}
// -------------------------------------------------------------------
// JSON con información del Dispositivo para envio por MQTT
// ------------------------------------------------------------------- 
String Json(){
    String response;
    DynamicJsonDocument jsonDoc(3000);
    // Capturar el valor de temperatura
    readSensor();
    // Crear JSON
    jsonDoc["deviceSerial"] = DeviceID();
    jsonDoc["deviceManufacturer"] = String(device_manufacturer);
    jsonDoc["deviceFwVersion"] = device_fw_version;
    jsonDoc["deviceHwVersion"] = String(device_hw_version);
    jsonDoc["deviceSdk"] = String(ESP.getSdkVersion());

    JsonObject dataObj = jsonDoc.createNestedObject("data");
	dataObj["deviceRamAvailable"] = ESP.getFreeHeap();
	dataObj["deviceRamSizeKb"] = ESP.getHeapSize();
    dataObj["deviceRelay1Status"] = RELAY1_STATUS ? true : false;
	dataObj["deviceRelay2Status"] = RELAY2_STATUS ? true : false;
	dataObj["deviceDimmer"] = dim;
	dataObj["deviceCpuTemp"] = TempCPUValue();
	dataObj["deviceDS18B20TempC"] = temperatureC;
    dataObj["deviceDS18B20TempF"] = temperatureF;
    dataObj["deviceActiveTime"] = longTimeStr(millis() / 1000);
    dataObj["deviceSpiffsUsed"] = String(SPIFFS.usedBytes());
    dataObj["deviceCpuClock"] = String(getCpuFrequencyMhz());
    dataObj["deviceFlashSize"] = String(ESP.getFlashChipSize() / (1024.0 * 1024), 2);
    dataObj["deviceRestartS"] = String(device_restart);
	dataObj["mqttStatus"] = mqttClient.connected() ? true : false;
	dataObj["mqttServer"] = mqttClient.connected() ? F(mqtt_server) : F("server not connected");
	dataObj["wifiStatus"] = WiFi.status() == WL_CONNECTED ? true : false;
	dataObj["wifiRssiStatus"] = WiFi.status() == WL_CONNECTED ? WiFi.RSSI() : 0;
	dataObj["wifiQuality"] = WiFi.status() == WL_CONNECTED ? getRSSIasQuality(WiFi.RSSI()) : 0;

    serializeJson(jsonDoc, response);
    return response;
}
// -------------------------------------------------------------------
// MQTT Loop Principal
// -------------------------------------------------------------------
void mqttloop(){
    if (mqtt_enable){
        if (!mqttClient.connected()){
            long now = millis();
            if ((now < 60000) || ((now - lastMqttReconnectAttempt) > 120000)){
                lastMqttReconnectAttempt = now;
                if(mqtt_connect()){
                    lastMqttReconnectAttempt = 0;
                }
            }            
        }else{
            mqttClient.loop();
        }        
    }    
}