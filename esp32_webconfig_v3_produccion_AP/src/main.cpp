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


#include <Arduino.h>
#include <EEPROM.h>
#include <SPIFFS.h>
#include <WiFi.h>
#include <DNSServer.h>
#include <ESPmDNS.h> 
#include <ArduinoJson.h>
#include <TimeLib.h>
#include <OneWire.h>
#include <DallasTemperature.h>
// -------------------------------------------------------------------
// Configuración del sensor de temperatura DS18B20
// -------------------------------------------------------------------
#define ONE_WIRE_BUS 13
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// -------------------------------------------------------------------
// Archivos *.hpp - Fragmentar el Código
// -------------------------------------------------------------------
#include "esp32a_definitions_variables.hpp"
#include "esp32a_functions.hpp"
#include "esp32a_settings.hpp"
#include "esp32a_wifi.hpp"
#include "esp32a_mqtt.hpp"
#include "esp32a_server.hpp"
#include "esp32a_websockets.hpp"

#include "esp32a_task.hpp"

void setup() {
  Serial.begin(115200);
  log("INFO", "Iniciando el Setup");
  EEPROM.begin(256);                                          // Memoria EEPROM init 256 bytes
  EEPROM.get(Restart_Address, device_restart);                // Leer el valor de la memoria
  device_restart++;                                           // Aumentar el contador
  EEPROM.put(Restart_Address, device_restart);                // Guardar el valor a la memoria
  EEPROM.commit();
  EEPROM.end();
  log("INFO", "Cantidad de reinicios :" + String(device_restart));
  // inicializar el spiffs
  if(!SPIFFS.begin(true)){
    log("ERROR", "Falló la inicialización del SPIFFS");
    while(true);
  }
  // traer las configuraciones desde json
  if(!settingsRead()){
    settingsSave();
  }
  // definir los pines y setearlos
  gpioDefine();
  // Paso estados a los pines de los Relays
  setOnOffSingle(RELAY1, RELAY1_STATUS);
  setOnOffSingle(RELAY2, RELAY2_STATUS);
  // Pasar el dato del dimmer
  ledcWrite(ledChannel, dim * 2.55); // dim => 0 - 100 
  // iniciar el wifi
  wifi_setup();

  // inicializar el servidor
  initServer();

  // iniciar el websockets
  initWebSockets();

  // Crear Tarea Reconexión WIFI
  xTaskCreate(TaskWifiReconnect, "TaskWifiReconnect", 1024*6, NULL, 2, NULL);
  // Crear Tarea Reconexión MQTT
  xTaskCreate(TaskMqttReconnect, "TaskMqttReconnect", 1024*6, NULL, 2, NULL);
  // LED MQTT Task
  xTaskCreate( TaskMQTTLed, "TaskMQTTLed", 2048, NULL, 1, NULL);
  // WS Send MSG
  xTaskCreate( TaskWsSend, "TaskWsSend", 2048, NULL, 1, NULL);

}

void loop() {
  // put your main code here, to run repeatedly:
}
