"use strict";

export const sidebar = [
    {
        collapsed: false,
        name: 'Dashboard',
        icon: 'grid',
        url: '',
        link:[]
    },
    {
        collapsed: true,
        name: 'Conexiones',
        icon: 'bar-chart',
        url: '',
        link:[
            {
                url: 'esp-wifi',
                text: 'WiFi'
            },
            {
                url: 'esp-mqtt',
                text: 'MQTT'
            }
        ]
    },
    {
        collapsed: true,
        name: 'Dispositivo',
        icon: 'sliders',
        url: '',
        link:[
            {
                url: 'esp-restore',
                text: 'Restaurar a fábrica'
            },
            {
                url: 'esp-restart',
                text: 'Reiniciar'
            },
            {
                url: 'esp-device',
                text: 'Configuración'
            }
        ]
    },
    {
        collapsed: false,
        name: 'Perfil',
        icon: 'person',
        url: 'esp-admin',
        link:[]
    },
    {
        collapsed: false,
        name: 'Salir',
        icon: 'box-arrow-right',
        url: 'esp-logout',
        link:[]
    }
]

export const wifiMainInput = [
    {
        switch: true,
        parentId: '#switchMode',
        inputId: 'wifi_mode',
        type: 'checkbox',
        label1: 'Modo WiFi',
        label2: '',
        value: false,
        classe: 'wifi'
    },
    {
        switch: false,
        parentId: '#inputSSID',
        inputId: 'wifi_ssid',
        type: 'text',
        label1: 'SSID Estación',
        label2: 'Nombre de la red', // placeholder
        value: '',
        classe: 'wifi client'
    },
    {
        switch: false,
        parentId: '#inputPassword',
        inputId: 'wifi_password',
        type: 'password',
        label1: 'Contraseña Estación',
        label2: 'Contraseña de la red',
        value: '',
        classe: 'wifi client'
    },
    {
        switch: true,
        parentId: '#switchDHCP',
        inputId: 'wifi_ip_static',
        type: 'checkbox',
        label1: 'DHCP',
        label2: '',
        value: false,
        classe: 'wifi ipswiche'
    },
    {
        switch: false,
        parentId: '#inputIpv4',
        inputId: 'wifi_ipv4',
        type: 'text',
        label1: 'Dirección IPv4',
        label2: '192.168.0.10',
        value: '',
        classe: 'wifi client ip'
    },
    {
        switch: false,
        parentId: '#inputGateway',
        inputId: 'wifi_gateway',
        type: 'text',
        label1: 'Puerta de enlace',
        label2: '192.168.0.1',
        value: '',
        classe: 'wifi client ip'
    },
    {
        switch: false,
        parentId: '#inputSubnet',
        inputId: 'wifi_subnet',
        type: 'text',
        label1: 'Máscara de subred',
        label2: '255.255.255.240',
        value: '',
        classe: 'wifi client ip'
    },    
    {
        switch: false,
        parentId: '#inputDnsPrimary',
        inputId: 'wifi_dns_primary',
        type: 'text',
        label1: 'DNS primario',
        label2: '192.168.0.1',
        value: '',
        classe: 'wifi client ip'
    },
    {
        switch: false,
        parentId: '#inputDnsSecondary',
        inputId: 'wifi_dns_secondary',
        type: 'text',
        label1: 'DNS secundario',
        label2: '8.8.8.8',
        value: '',
        classe: 'wifi client ip'
    },
    {
        switch: false,
        parentId: '#inputApSsid',
        inputId: 'ap_ssid',
        type: 'text',
        label1: 'SSID punto de acceso',
        label2: 'Nombre del punto de acceso',
        value: '',
        classe: 'wifi ap'
    },
    {
        switch: false,
        parentId: '#inputApPassword',
        inputId: 'ap_password',
        type: 'password',
        label1: 'Contraseña punto de acceso',
        label2: 'Contraseña del punto de acceso',
        value: '',
        classe: 'wifi ap'
    },
    {
        switch: false,
        parentId: '#inputApChanel',
        inputId: 'ap_chanel',
        type: 'number',
        label1: 'Canal de radio',
        label2: 'Permitido del 1 al 13',
        value: '',
        classe: 'wifi ap'
    },
    {
        switch: true,
        parentId: '#switchVisibility',
        inputId: 'ap_visibility',
        type: 'checkbox',
        label1: 'Visibilidad',
        label2: '',
        value: false,
        classe: 'wifi ap'
    },    
    {
        switch: false,
        parentId: '#inputApConnect',
        inputId: 'ap_connect',
        type: 'number',
        label1: 'Conexiones permitidas',
        label2: 'Valores Min: 0 - Máx: 8',
        value: '',
        classe: 'wifi ap'
    }
]

export const mqttMainInput = [
    {
        switch: true,
        parentId: '#switchMqtt',
        inputId: 'mqtt_enable',
        type: 'checkbox',
        label1: 'Habilitar el MQTT',
        label2: '',
        value: false,
        classe: 'mqtt' 
    },
    {
        switch: false,
        parentId: '#inputServer',
        inputId: 'mqtt_server',
        type: 'text',
        label1: 'Servidor MQTT',
        label2: 'Dirección del servidor',
        value: '',
        classe: 'mqtt mq'
    },
    {
        switch: false,
        parentId: '#inputPort',
        inputId: 'mqtt_port',
        type: 'number',
        label1: 'Puerto MQTT',
        label2: 'Puerto de acceso',
        value: '',
        classe: 'mqtt mq'
    },
    {
        switch: true,
        parentId: '#switchRetain',
        inputId: 'mqtt_retain',
        type: 'checkbox',
        label1: 'Mensajes retenidos',
        label2: '',
        value: false,
        classe: 'mqtt mq' 
    },
    {
        switch: false,
        parentId: '#selectQos',
        inputId: 'mqtt_qos',
        type: 'select',
        label1: 'Calidad del servicio',
        label2: 'QoS',
        option: [0,1,2],
        value: '',
        classe: 'mqtt mq' 
    },
    {
        switch: false,
        parentId: '#inputClienId',
        inputId: 'mqtt_id',
        type: 'text',
        label1: 'Cliente Id',
        label2: 'Cliente Id MQTT',
        value: '',
        classe: 'mqtt mq'
    },
    {
        switch: false,
        parentId: '#inputUser',
        inputId: 'mqtt_user',
        type: 'text',
        label1: 'Usuario',
        label2: 'Usuario MQTT',
        value: '',
        classe: 'mqtt mq'
    },
    {
        switch: false,
        parentId: '#inputPassword',
        inputId: 'mqtt_password',
        type: 'password',
        label1: 'Contraseña',
        label2: 'Contraseña MQTT',
        value: '',
        classe: 'mqtt mq'
    },
    {
        switch: true,
        parentId: '#switchClean',
        inputId: 'mqtt_clean_sessions',
        type: 'checkbox',
        label1: 'Sesiones limpias',
        label2: '',
        value: false,
        classe: 'mqtt mq' 
    },
    {
        switch: true,
        parentId: '#switchSend',
        inputId: 'mqtt_time_send',
        type: 'checkbox',
        label1: 'Enviar datos del dispositivo',
        label2: '',
        value: false,
        classe: 'mqtt mq' 
    },
    {
        switch: false,
        parentId: '#inputInterval',
        inputId: 'mqtt_time_interval',
        type: 'number',
        label1: 'Intervalo en segundos (s)',
        label2: '60',
        value: '',
        classe: 'mqtt mq'
    },
    {
        switch: true,
        parentId: '#switchSendStatus',
        inputId: 'mqtt_status_send',
        type: 'checkbox',
        label1: 'Enviar estados',
        label2: '',
        value: false,
        classe: 'mqtt mq' 
    }
]