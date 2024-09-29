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

#include "esp32a_blink.hpp"

// -------------------------------------------------------------------
// DEFINICION DE FUNCIONES
// -------------------------------------------------------------------
void log(String type, String msg);
String platform();
String HexToStr(const unsigned long &h, const byte &l);
String UniqueID();
String DeviceID();
String extractNumbers(String e);
String PathMqttTopic(String topic);
void gpioDefine();
IPAddress CharToIP(const char *str);
String ipStr(const IPAddress &ip);
String longTimeStr(const time_t &t);
int getRSSIasQuality(int RSSI);
float TempCPUValue();
void readSensor();
String GetBodyContent(uint8_t *data, size_t len);
String EncryptionType(int encryptionType);

void settingsReset();
boolean settingsSave();
void wsMessageSend(String msg, String icon, String Type);

// -------------------------------------------------------------------
// Genera un log personalizado en el puerto Serial
// type: INFO, WARNING, DANGER
// msg: Mensaje
// -------------------------------------------------------------------
void log(String type, String msg){ // [INFO] demo
    Serial.println("[" + type + "] " + msg);
}
// -------------------------------------------------------------------
// Definir la Plataforma
// Optiene la plataforma de hardware
// -------------------------------------------------------------------
String platform(){
#ifdef ARDUINO_ESP32_DEV
    return "ESP32";
#endif
}
// -------------------------------------------------------------------
// De HEX a String
// -------------------------------------------------------------------
String HexToStr(const unsigned long &h, const byte &l){
    String s;
    s = String(h, HEX);
    s.toUpperCase();
    s = ("00000000" + s).substring(s.length() + 8 - l);
    return s;
}
// -------------------------------------------------------------------
// Crear un ID unico desde la direccion MAC
// Retorna los ultimos 4 Bytes del MAC rotados
// -------------------------------------------------------------------
String UniqueID(){    
    char uniqueid[15]; 
    uint64_t chipid = ESP.getEfuseMac();           
    uint16_t chip = (uint16_t)(chipid >> 32);
    snprintf(uniqueid, 15, "%04X", chip);
    return uniqueid;
}
// -------------------------------------------------------------------
// Número de serie del Dispositivo único => ESP329B1C52100C3D
// -------------------------------------------------------------------
String DeviceID(){
    return String(platform())+ HexToStr(ESP.getEfuseMac(),8) + String(UniqueID());
}
// -------------------------------------------------------------------
// Quitar numeros de la cadena
// -------------------------------------------------------------------
String extractNumbers(String e){
    String inputString = e;
    inputString.toLowerCase();
    String outString = "";
    int len = inputString.length();
    for (size_t i = 0; i < len; i++)
    {
        if (!isDigit((char)inputString[i]))
        {
            outString += (char)inputString[i];
        }       
    }
    return outString;
}
// -------------------------------------------------------------------
// Crear un path para los Topicos en MQTT
// emqx/ESP329B1C52100C3D/#   +/# = > usuario/id/# => emqx/ESP329B1C52100C3D/status = true/false
// -------------------------------------------------------------------
String PathMqttTopic(String topic){
    return String(String(mqtt_user)+"/"+String(mqtt_id)+"/"+topic);
}
// -------------------------------------------------------------------
// Definir Pines GPIO
// -------------------------------------------------------------------
void gpioDefine(){
    // PINES
    pinMode(WIFILED, OUTPUT);
    pinMode(MQTTLED, OUTPUT);
    pinMode(RELAY1, OUTPUT);  
    pinMode(RELAY2, OUTPUT);
    // PWM
    ledcSetup(ledChannel, freq, resolution);
    ledcAttachPin(DIMMER, ledChannel);
    // SET OFF LOS LEDS
    setOffSingle(WIFILED);          // Apagar el led
    setOffSingle(MQTTLED);          // Apagar el led
    setOffSingle(RELAY1);           // Apagar el relay
    setOffSingle(RELAY2);           // Apagar el relay   
    ledcWrite(ledChannel, 0);       // Poner el 0 el dimmer 255 
}
// -------------------------------------------------------------------
// Convierte un char a IP
// -------------------------------------------------------------------
uint8_t ip[4];    // Variable función convertir string a IP 
IPAddress CharToIP(const char *str){
    sscanf(str, "%hhu.%hhu.%hhu.%hhu", &ip[0], &ip[1], &ip[2], &ip[3]);
    return IPAddress(ip[0], ip[1], ip[2], ip[3]);
}
// -------------------------------------------------------------------
// Retorna IPAddress en formato "n.n.n.n" de IP a String
// -------------------------------------------------------------------
String ipStr(const IPAddress &ip){    
    String sFn = "";
    for (byte bFn = 0; bFn < 3; bFn++){
        sFn += String((ip >> (8 * bFn)) & 0xFF) + ".";
    }
    sFn += String(((ip >> 8 * 3)) & 0xFF);
    return sFn;
}
// -------------------------------------------------------------------
// Retorna segundos como "d:hh:mm:ss"
// -------------------------------------------------------------------
String longTimeStr(const time_t &t){        
    String s = String(t / SECS_PER_DAY) + ':';
    if (hour(t) < 10)
    {
        s += '0';
    }
    s += String(hour(t)) + ':';
    if (minute(t) < 10)
    {
        s += '0';
    }
    s += String(minute(t)) + ':';
    if (second(t) < 10)
    {
        s += '0';
    }
    s += String(second(t));
    return s;
}
// -------------------------------------------------------------------
// Retorna la calidad de señal WIFI en % => 0 - 100%
// -------------------------------------------------------------------
int getRSSIasQuality(int RSSI){
    int quality = 0;
    if(RSSI <= -100){
        quality = 0;
    }else if (RSSI >= -50){
        quality = 100;
    }else{
       quality = 2 * (RSSI + 100);
    }
    return quality;
}
// -------------------------------------------------------------------
// Sensor Temp Interno CPU
// -------------------------------------------------------------------
#ifdef __cplusplus
extern "C" {
#endif
uint8_t temprature_sens_read();
#ifdef __cplusplus
}
#endif
uint8_t temprature_sens_read();
// -------------------------------------------------------------------
// Retorna la temperatura del CPU
// -------------------------------------------------------------------
float TempCPUValue(){    
    return temp_cpu = (temprature_sens_read() - 32) / 1.8;
}
// -------------------------------------------------------------------
// Leer la temperatura del sensor
// -------------------------------------------------------------------
void readSensor(){
    sensors.requestTemperatures();
    temperatureC = sensors.getTempCByIndex(0);
    temperatureF = sensors.getTempFByIndex(0);
}
// -------------------------------------------------------------------
// Retorna el contenido del Body Enviado como JSON metodo POST/PUT
// -------------------------------------------------------------------
String GetBodyContent(uint8_t *data, size_t len){
  String content = "";
  for (size_t i = 0; i < len; i++) {
    content .concat((char)data[i]);
  }
  return content;
}
// -------------------------------------------------------------------
// Retorna el Tipo de Encriptación según el codigo (0-1-2-3-4-5)
// -------------------------------------------------------------------
String EncryptionType(int encryptionType) {
    switch (encryptionType) {
        case (0):
            return "Open";
        case (1):
            return "WEP";
        case (2):
            return "WPA_PSK";
        case (3):
            return "WPA2_PSK";
        case (4):
            return "WPA_WPA2_PSK";
        case (5):
            return "WPA2_ENTERPRISE";
        default:
            return "UNKOWN";
    }
}
// -------------------------------------------------------------------
// Empaquetar el JSON para enviar por WS ( progress en % )
// -------------------------------------------------------------------
String getSendJson(String msg, String type){
    String response = "";
    DynamicJsonDocument doc(64);
    doc["type"] = type;
    doc["msg"] = msg;
    serializeJson(doc, response);
    return response;
}
// -------------------------------------------------------------------
// Print Progress Firmware or SPIFFS Update
// -------------------------------------------------------------------
int c = 0;
void printProgress(size_t prog, size_t sz){
    int progress = (prog * 100) / content_len; // 0% - 100%

    if(progress == 10){
        c++;
        if(c>2) c=1;
        if(c ==1) wsMessageSend(getSendJson(String(10), "update"), "", "");
    }else if(progress == 20){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(20), "update"), "", ""); 
    }else if(progress == 30){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(30), "update"), "", ""); 
    }else if(progress == 40){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(40), "update"), "", ""); 
    }else if(progress == 50){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(50), "update"), "", ""); 
    }else if(progress == 60){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(60), "update"), "", ""); 
    }else if(progress == 70){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(70), "update"), "", ""); 
    }else if(progress == 80){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(80), "update"), "", ""); 
    }else if(progress == 90){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(90), "update"), "", ""); 
    }else if(progress == 97){
        c ++;
        if( c>2 ) c=1;
        if(c==1) wsMessageSend(getSendJson(String(100), "update"), "", ""); 
    }else{}
}

