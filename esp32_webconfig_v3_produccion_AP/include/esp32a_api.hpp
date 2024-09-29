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
// Zona API REST V2.0 desde Arduino JSON y funciones centrales
// -------------------------------------------------------------------
// URL:                                       Método:         Estado
// -------------------------------------------------------------------
// /api/index                                   GET     --      OK
// /api/connection/wifi                         GET     --      OK
// /api/connection/wifi                         POST    --      OK
// /api/connection/wifi-scan                    GET     --      OK
// /api/connection/mqtt                         GET     --      OK
// /api/connection/mqtt                         POST    --      OK
// /api/device/download                         GET     --      OK *
// /api/device/upload                           POST    --      OK *
// /api/device/firmware                         POST    --      OK *
// /api/device/status                           GET     --      OK
// /api/device/restart                          POST    --      OK
// /api/device/restore                          POST    --      OK
// /api/perfil/user                             POST    --      OK
// /api/device/relays                           POST    --      OK
// /api/device/dimmer                           POST    --      OK
// ------------------------------------------------------------------
// * - No se manejan desde MQTT
// ------------------------------------------------------------------

// API v2 json desde Arduino JSON

bool security = true; // para pedir usuario y contraseña en la web
const char *dataType = "application/json";

// Funciones 
#include "esp32a_functionsApi.hpp"

// -------------------------------------------------------------------
// Parametros de configuración Index
// url: /api/index
// Método: GET
// -------------------------------------------------------------------
void handleApiIndex(AsyncWebServerRequest *request){
    // agregar el usuario y contraseña
    if(security){
        if(!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }
    request->addInterestingHeader("API ESP32 Server");
    request->send(200, dataType, apiGetIndex( ipStr(request->client()->remoteIP()), String(request->getHeader("User-Agent")->value().c_str()) ) );
}
// -------------------------------------------------------------------
// Leer parámetros de configuración WiFi
// url: /api/connection/wifi
// Método: GET
// -------------------------------------------------------------------
void handleApiWifi(AsyncWebServerRequest *request){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }
    request->addInterestingHeader("API ESP32 Server");
    request->send(200, dataType, apiGetWiFi());
}
// -------------------------------------------------------------------
// Método POST actualizar configuraciones WiFi
// url: /api/connection/wifi
// Método: POST
// -------------------------------------------------------------------
void handleApiPostWiFi(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }
    String bodyContent = GetBodyContent(data, len);
    // Save 
    if (apiPostWiFi(bodyContent)){
        request->addInterestingHeader("API ESP32 Server");
        request->send(200, dataType, "{ \"save\": true }");
    }else{
        request->addInterestingHeader("API ESP32 Server");
        request->send(400, dataType, "{ \"status\": \"Error de JSON enviado\" }");
    }
}
// -------------------------------------------------------------------
// Escanear todas las redes WIFI al alcance de la señal
// url: /api/connection/wifi-scan
// Método: GET
// Notas: La primera solicitud devolverá 0 resultados a menos que comience
// a escanear desde otro lugar (ciclo / configuración).
// No solicite más de 3-5 segundos. \ ALT + 92
// -------------------------------------------------------------------
void handleApiWifiScan(AsyncWebServerRequest *request){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }    
    request->addInterestingHeader("API ESP32 Server");
    request->send(200, dataType, apiGetWiFiScan());
}
// -------------------------------------------------------------------
// Parámetros de configuración MQTT
// url: /api/connection/mqtt
// Método: GET
// -------------------------------------------------------------------
void handleApiMQTT(AsyncWebServerRequest *request){    
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }
    request->addInterestingHeader("API ESP32 Server");
    request->send(200, dataType, apiGetMqtt());
}
// -------------------------------------------------------------------
// Actualizar las configuraciones del MQTT Conexiones
// url: /api/connection/mqtt
// Método: POST
// -------------------------------------------------------------------
void handleApiPostMQTT(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }
    String bodyContent = GetBodyContent(data, len);   
    // Save
    if (apiPostMqtt(bodyContent)){
        request->addInterestingHeader("API ESP32 Server");
        request->send(200, dataType, "{ \"save\": true }");
    }else{
        request->addInterestingHeader("API ESP32 Server");
        request->send(400, dataType, "{ \"status\": \"Error de JSON enviado\" }");
    }
}
// -------------------------------------------------------------------
// Manejo de la descarga del archivo setting.json
// url: "/api/device/download"
// Método: GET
// -------------------------------------------------------------------
void handleApiDownload(AsyncWebServerRequest *request){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }    
    log("INFO", "Descarga del archivo settings.json");
    AsyncWebServerResponse *response = request->beginResponse(SPIFFS, "/settings.json", dataType, true);
    request->send(response);
}
// -------------------------------------------------------------------
// Manejo de la carga del archivo settings.json
// url: "/api/device/upload"
// Método: POST
// -------------------------------------------------------------------
// Variables para la carga del archivo
File file;
bool opened = false;
void handleApiUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    } 

    if (!index){
        Serial.printf("INFO", "Upload Start: %s\n", filename.c_str());
    }
    // Validar el archivo si esta abierto settings.json
    if (opened == false){
        opened = true;
        file = SPIFFS.open(String("/") + filename, FILE_WRITE);
        if (!file){
            log("ERROR", "No se pudo abrir el archivo para escribir");
            request->send(500, dataType, "{ \"save\": false, \"msg\": \"¡Error, No se pudo abrir el archivo para escribir!\"}");
            return;
        }
    }

    // Escribir el archivo en la memoria
    if (file.write(data, len) != len){
        log("ERROR", "No se pudo escribir el archivo");
        request->send(500, dataType, "{ \"save\": false, \"msg\": \"¡Error, No se pudo escribir el archivo: " + filename + " !\"}");
        return;
    }

    // Finalizada la carga del archivo.
    if (final){
        AsyncWebServerResponse *response = request->beginResponse(201, dataType, "{ \"save\": true, \"msg\": \"¡Carga del archivo: " + filename + " completada!\"}");
        response->addHeader("Cache-Control", "no-cache");
        response->addHeader("Location", "/");
        request->send(response);
        file.close();
        opened = false;
        log("INFO", "Carga del archivo " + filename + " completada");
        // Esperar la transmisión de los datos seriales
        Serial.flush();
        // Reiniciar el ESP32
        ESP.restart();
    }
}
// -------------------------------------------------------------------
// Manejo de la actualización del Firmware a FileSystem
// url: /api/device/firmware
// Método: POST
// -------------------------------------------------------------------
void handleApiFirmware(AsyncWebServerRequest *request, const String &filename, size_t index, uint8_t *data, size_t len, bool final){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }

    // Si el nombre de archivo incluye ( spiffs ), actualiza la partición de spiffs
    int cmd = (filename.indexOf("spiffs") > -1) ? U_PART : U_FLASH;
    String updateSystem = cmd == U_PART ? "FileSystem" : "Firmware";

    if (!index){
        content_len = request->contentLength();
        log("INFO", "Actualización del " + updateSystem + " iniciada...");
        if (!Update.begin(UPDATE_SIZE_UNKNOWN, cmd)){
            AsyncWebServerResponse *response = request->beginResponse(500, dataType, "{ \"save\": false, \"msg\": \"¡Error, No se pudo actualizar el " + updateSystem + " Index: " + filename + " !\"}");
            request->send(response);
            Update.printError(Serial);
            log("ERROR", "Update del " + updateSystem + " ternimado");
        }
    }
    // escribir e firmware o el filesystem
    if (Update.write(data, len) != len){
        Update.printError(Serial);
    }
    // Terminado
    if (final){
        if (!Update.end(true)){
            AsyncWebServerResponse *response = request->beginResponse(500, dataType, "{ \"save\": false, \"msg\": \"¡Error, No se pudo actualizar el " + updateSystem + " Final: " + filename + " !\"}");
            request->send(response);
            Update.printError(Serial);
        }else{
            AsyncWebServerResponse *response = request->beginResponse(201, dataType, "{ \"save\": true, \"type\": \"" + updateSystem + "\"}");
            response->addHeader("Cache-Control", "no-cache");
            response->addHeader("Location", "root@" + updateSystem + "");
            request->send(response);
            log("INFO", "Update del " + updateSystem + " completado");
            // Esperar la Transmisión de los datos seriales
            Serial.flush();
            ESP.restart();
        }
    }
}
// -------------------------------------------------------------------
// Manejo de parámetros de estados Globales
// url: /api/device/status
// Método: GET
// -------------------------------------------------------------------
void handleApiGetStatus(AsyncWebServerRequest *request){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    } 
    request->send(200, dataType, apiGetStatus());
}
// -------------------------------------------------------------------
// Manejo del reinicio del dispositivo
// url: /api/device/restart
// Método: POST
// -------------------------------------------------------------------
void handleApiPostRestart(AsyncWebServerRequest *request){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    } 
    // Retornamos la respuesta
    request->send(200, dataType, "{ \"restart\": true }");
    // Reiniciar el ESP32
    String origin = "API";
    apiPostRestart(origin);
}
// -------------------------------------------------------------------
// Manejo de la restauración del dispositivo
// url: /api/device/restore
// Método: POST
// -------------------------------------------------------------------
void handleApiPostRestore(AsyncWebServerRequest *request){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    } 
    // Retornamos la respuesta
    request->send(200, dataType, "{ \"restore\": true }");
    // Reiniciar el ESP32
    String origin = "API";
    apiPostRestore(origin);
}
// -------------------------------------------------------------------
// Actualizar las configuraciones del acceso al servidor - contraseña
// url: /api/perfil/user
// Método: POST
// -------------------------------------------------------------------
void handleApiPostUser(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    }

    String bodyContent = GetBodyContent(data, len);

    int resp = apiPostUser(bodyContent);

    switch (resp)
    {
        case 0:
            request->send(400, dataType, "{ \"status\": \"Error de JSON enviado\" }");
            break;
        case 1:
            request->send(400, dataType, "{ \"save\": false, \"msg\": \"¡Error, No se permite contraseña anterior en blanco\"}");
            break;
        case 2:
            request->send(400, dataType, "{ \"save\": false, \"msg\": \"¡Error, No se permite los datos de la nueva contraseña y confirmación vacíos!\"}");
            break;
        case 3:
            request->send(400, dataType, "{ \"save\": false, \"msg\": \"¡Error, La contraseña nueva no puede ser igual a la anterior\"}");
            break;
        case 4:
            request->send(400, dataType, "{ \"save\": false, \"msg\": \"¡Error, La nueva contraseña y confirmación de nueva contraseña no coinciden!\"}");
            break;
        case 5:
            request->send(400, dataType, "{ \"save\": false, \"msg\": \"¡Error, No se pudo guardar, la contraseña anterior no coincide\"}");
            break;
        case 6:
            request->send(200, dataType, "{ \"save\": true, \"msg\": \"¡Contraseña actualizada correctamente!\" }");
            break;    
        default:
            break;
    }
}
// -------------------------------------------------------------------
// Manejo de las salidas a relay
// url: /api/device/relays
// Método: POST
// -------------------------------------------------------------------
void handleApiPostRelays(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    } 
    // capturamos la data en string
    String bodyContent = GetBodyContent(data, len);
    // Validar que sea un JSON
    StaticJsonDocument<384> doc;
    DeserializationError error = deserializeJson(doc, bodyContent);
    if (error){
        request->send(400, dataType, "{ \"status\": \"Error de JSON enviado\" }");
        return;
    };

    if(apiPostOnOffRelays(bodyContent)){
        // Retornamos la respuesta
        if(settingsSave())
            request->send(200, dataType, "{ \"relay\": true, \"name\":  \"" + doc["output"].as<String>() + "\", \"status\": true }"); 
    }else{
        if(settingsSave())
            request->send(200, dataType, "{ \"relay\": true, \"name\":  \"" + doc["output"].as<String>() + "\", \"status\": false }");
    }
}
// -------------------------------------------------------------------
// Manejo del dimmer
// url: /api/device/dimmer
// Método: POST
// -------------------------------------------------------------------
void handleApiPostDimmer(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    if (security){
        if (!request->authenticate(device_user, device_password))
            return request->requestAuthentication();
    } 
    // capturamos la data en string
    String bodyContent = GetBodyContent(data, len);
    // Validar que sea un JSON
    StaticJsonDocument<384> doc;
    DeserializationError error = deserializeJson(doc, bodyContent);
    if (error){
        request->send(400, dataType, "{ \"status\": \"Error de JSON enviado\" }");
        return;
    };

    apiPostDimmer(bodyContent);
    request->send(200, dataType, "{ \"dimmer\": true, \"value\": \"" + String(dim) + "\" }");
}