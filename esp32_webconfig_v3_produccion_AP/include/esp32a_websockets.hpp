


long lastWsSend = 0;

// declaración de funciones
void ProcessRequest(AsyncWebSocketClient * client, String request);

// -------------------------------------------------------------------
// Eventos del Websocket
// -------------------------------------------------------------------
void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){ 
	if(type == WS_EVT_CONNECT){
		Serial.printf("[ INFO ] ws[%s][%u] connect\n", server->url(), client->id());
		client->printf("{\"ClientID\": %u }", client->id());
		client->ping();
	} else if(type == WS_EVT_DISCONNECT){
		//Serial.printf("ws[%s][%u] disconnect: %u\n", server->url(), client->id());
	} else if(type == WS_EVT_ERROR){
		//Serial.printf("ws[%s][%u] error(%u): %s\n", server->url(), client->id(), *((uint16_t*)arg), (char*)data);
	} else if(type == WS_EVT_PONG){
		//Serial.printf("ws[%s][%u] pong[%u]: %s\n", server->url(), client->id(), len, (len)?(char*)data:"");
	} else if(type == WS_EVT_DATA){
		AwsFrameInfo * info = (AwsFrameInfo*)arg;
		String msg = "";
		if(info->final && info->index == 0 && info->len == len){
			if(info->opcode == WS_TEXT){
				for(size_t i=0; i < info->len; i++) {
					msg += (char) data[i];
				}
			} else {
				char buff[3];
				for(size_t i=0; i < info->len; i++) {
					sprintf(buff, "%02x ", (uint8_t) data[i]);
					msg += buff ;
				}
			}
			if(info->opcode == WS_TEXT)
			   ProcessRequest(client, msg);			
		} else {
			//message is comprised of multiple frames or the frame is split into multiple packets
			if(info->opcode == WS_TEXT){
				for(size_t i=0; i < len; i++) {
					msg += (char) data[i];
				}
			} else {
				char buff[3];
				for(size_t i=0; i < len; i++) {
					sprintf(buff, "%02x ", (uint8_t) data[i]);
					msg += buff ;
				}
			}
			Serial.printf("%s\n",msg.c_str());

			if((info->index + len) == info->len){
				if(info->final){
					if(info->message_opcode == WS_TEXT)
					   ProcessRequest(client, msg);
				}
			}
		}
	}
}
// -------------------------------------------------------------------
// Manejador de ordenes que llegan por Websocket
// -------------------------------------------------------------------
void ProcessRequest(AsyncWebSocketClient * client, String request){  

    String command = request;
    command.trim();

    if(strcmp(command.c_str(), "restore") == 0){
        log("INFO", "Commando restaurar por WS => " + command);
    }else if(strcmp(command.c_str(), "restart") == 0){
        log("INFO", "Commando reiniciar por WS => " + command);
    }else{
        apiPostOnOffRelays(command);
    }

}
// -------------------------------------------------------------------
// Inicializar el Websocket
// -------------------------------------------------------------------
void initWebSockets(){
	ws.onEvent(onWsEvent);
	server.addHandler(&ws);
	log("INFO", "Servidor WebSocket iniciado");
}
// -------------------------------------------------------------------
// Función enviar JSON por Websocket 
// -------------------------------------------------------------------
void wsMessageSend(String msg, String icon, String Type){
	if(strcmp(Type.c_str(), "info") == 0){
		String response;
		DynamicJsonDocument doc(300);
		doc["type"] = Type;
		doc["msg"] = msg;
		doc["icon"] = icon;
		serializeJson(doc, response);
		ws.textAll(response);
	}else{
		ws.textAll(msg);
	}
}
// -------------------------------------------------------------------
// Empaquetar el JSON para enviar por WS Datos para Index cada 1s
// -------------------------------------------------------------------
String getJsonIndex(){
	readSensor();
	String response = "";
	DynamicJsonDocument jsonDoc(3000);
	jsonDoc["type"] = "data";
	jsonDoc["activeTime"] = longTimeStr(millis() / 1000);
	jsonDoc["ramAvailable"] = ESP.getFreeHeap();
	jsonDoc["RAM_SIZE_KB"] = ESP.getHeapSize();
	jsonDoc["mqttStatus"] = mqttClient.connected() ? true : false;
	jsonDoc["mqtt_server"] = mqttClient.connected() ? F(mqtt_server) : F("server not connected");
	jsonDoc["wifiStatus"] = WiFi.status() == WL_CONNECTED ? true : false;
	jsonDoc["rssiStatus"] = WiFi.status() == WL_CONNECTED ? WiFi.RSSI() : 0;
	jsonDoc["wifiQuality"] = WiFi.status() == WL_CONNECTED ? getRSSIasQuality(WiFi.RSSI()) : 0;
	jsonDoc["RELAY1_STATUS"] = RELAY1_STATUS ? true : false;
	jsonDoc["RELAY2_STATUS"] = RELAY2_STATUS ? true : false;
	jsonDoc["dimmer"] = dim;
	jsonDoc["cpuTemp"] = TempCPUValue();
	jsonDoc["DS18B20_TempC"] = temperatureC;
    jsonDoc["DS18B20_TempF"] = temperatureF;
	serializeJson(jsonDoc, response);
	return response;
}