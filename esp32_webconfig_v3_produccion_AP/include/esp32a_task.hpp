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
// Declaración de funciones
// -------------------------------------------------------------------
void TaskWifiReconnect(void *pvParamenters);
void TaskMqttReconnect(void *pvParamenters);
void TaskMQTTLed(void *pvParameters);

// -------------------------------------------------------------------
// Tarea Loop WIFI & Reconectar modo Cliente
// -------------------------------------------------------------------
void TaskWifiReconnect(void *pvParamenters){
  (void) pvParamenters;
  while(1){
    vTaskDelay(10/portTICK_PERIOD_MS);
    if(wifi_app == WIFI_STA){
      wifiLoop();
    } else if(wifi_app == WIFI_AP){
      wifiAPLoop();
    }else{}
  }
}
// -------------------------------------------------------------------
// Tarea Loop MQTT & Reconectar
// -------------------------------------------------------------------
void TaskMqttReconnect(void *pvParamenters){
  (void) pvParamenters;
  while(1){
    if ((WiFi.status() == WL_CONNECTED) && (wifi_app == WIFI_STA)){
      if(mqtt_server != 0){
        // llamar la función del loop mqtt
        mqttloop();
        // Enviar por MQTT el JSON
        if(mqttClient.connected() && mqtt_status_send){
          if(millis()-lasMsg > mqtt_time_interval){
            lasMsg = millis();
            mqtt_publish();
            log("INFO", "Mansaje enviado por MQTT...");
          }
        }
      }
    }    
  }
}
// -------------------------------------------------------------------
// Tarea MQTT LED pestañeo
// -------------------------------------------------------------------
void TaskMQTTLed(void *pvParameters){
  (void) pvParameters;
  while(1){    
    vTaskDelay(10/portTICK_PERIOD_MS);
    if(mqtt_enable && mqttClient.connected()){
      digitalWrite(MQTTLED, HIGH);
      vTaskDelay(50/portTICK_PERIOD_MS);
      digitalWrite(MQTTLED, LOW);
      vTaskDelay(1000/portTICK_PERIOD_MS);              
    }else{
      digitalWrite(MQTTLED, LOW);
    }       
  }
}
// -------------------------------------------------------------------
// Tarea WS Send cada un 1s
// -------------------------------------------------------------------
void TaskWsSend(void *pvParameters){
  (void) pvParameters;
  while(1){
    vTaskDelay(1000/portTICK_PERIOD_MS);
    wsMessageSend(getJsonIndex(), "", "");
  }
}