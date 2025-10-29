# Gemini TTS for Foundry

Un módulo para Foundry VTT que permite a los usuarios generar audio de texto a voz (Text-to-Speech) de alta calidad utilizando la API de Google Gemini. El audio generado se transmite instantáneamente a todos los jugadores conectados, proporcionando una herramienta de comunicación y accesibilidad crucial para jugadores sin micrófono o para mejorar la inmersión en la partida.

## Características

- **Audio de Alta Calidad:** Utiliza los modelos de voz de Google Gemini para una narración clara y natural.
- **Transmisión en Tiempo Real:** El audio se comparte con todos los jugadores en la sesión a través de sockets para una experiencia sincronizada.
- **Selección de Voz:** Permite elegir entre varias voces de Gemini para adaptarse a diferentes personajes o narradores.
- **Integración Sencilla:** Añade un botón de fácil acceso directamente en la ventana de chat de Foundry.
- **Configuración Fácil:** El Game Master (GM) puede configurar la clave de la API necesaria a través del menú de ajustes del módulo.
- **Voces por Personaje:** Asigna voces por defecto a personajes específicos desde su ficha de actor.
- **Sistema de Caché y Cola:** Optimiza las llamadas a la API y gestiona múltiples solicitudes de audio de forma fluida.

## Instalación

1.  En el menú principal de Foundry VTT, ve a la pestaña **"Setup"**.
2.  Haz clic en el botón **"Add-on Modules"**.
3.  Haz clic en **"Install Module"** en la parte inferior.
4.  En el campo "Manifest URL", copia y pega la siguiente URL:
    ```
    https://github.com/PachonX/gemini-tts-for-foundry/releases/latest/download/module.json
    ```
5.  Haz clic en **"Install"**.

Una vez instalado, no olvides activar el módulo dentro de tu mundo de juego.

## Configuración (Requerido para el Game Master)

Para que el módulo funcione, el Game Master debe configurar una clave de API de Google Gemini.

1.  Una vez dentro de tu mundo en Foundry, ve al menú de la derecha y haz clic en la pestaña **"Game Settings"** (el icono del engranaje).
2.  Haz clic en el botón **"Configure Settings"**.
3.  Selecciona la pestaña **"Module Settings"**.
4.  Busca la sección correspondiente a **"Gemini TTS for Foundry"**.
5.  En el campo llamado **"Google Gemini API Key"**, pega tu clave de API. Puedes obtener una desde [Google AI Studio](https://aistudio.google.com/app/apikey).
6.  Haz clic en **"Save Changes"** en la parte inferior.

¡El módulo ya está listo para ser utilizado por todos los jugadores!

## ¿Cómo se Usa? (Para Jugadores)

Cualquier jugador en la partida puede generar audio:

1.  En la ventana de chat, haz clic en el nuevo **ícono de micrófono** que aparece en la barra de controles.
2.  Se abrirá una ventana emergente titulada "Generate Speech with Gemini".
3.  Escribe el texto que deseas que se hable en el cuadro de texto.
4.  Selecciona una de las voces disponibles en el menú desplegable. Si tu personaje tiene una voz asignada, se seleccionará automáticamente.
5.  Haz clic en el botón **"Speak"**.

El audio se generará y se reproducirá automáticamente para todos los jugadores en la partida.

---

### **Nota para Desarrolladores**

Este proyecto utiliza un workaround para la compatibilidad con el entorno de desarrollo. Los archivos de plantilla de Handlebars (`.hbs`) se guardan en el repositorio como archivos `.txt`.

**Acción Requerida antes de Publicar:** Antes de crear una nueva release o empaquetar el módulo, debes renombrar los siguientes archivos en la carpeta `templates/`:
- `actor-voice-setting.txt` -> `actor-voice-setting.hbs`
- `tts-panel.txt` -> `tts-panel.hbs`
---

# CHANGELOG - Gemini TTS for Foundry

## [v1.3.0] - 2024-XX-XX

### 🚀 **Nuevas Características**

#### **Seguridad y Arquitectura**
- 🔒 **Arquitectura segura GM-centralizada**: Solo el Game Master realiza llamadas a la API
- 🛡️ **Protección de credenciales**: La API Key nunca se expone a los jugadores
- ⚡ **Sistema de rate limiting**: Límite de 30 solicitudes por minuto por usuario
- ✅ **Validación robusta**: Sanitización de texto y límites de caracteres (5000 max)

#### **Interfaz de Usuario Mejorada**
- 🎛️ **Panel de control flotante**: Reemplaza el diálogo modal por ventana persistente
- 📋 **Cola visual de audio**: Los usuarios ven el estado de sus solicitudes pendientes
- 🔊 **Control de volumen global**: Ajuste maestro para todos los audios TTS
- ⏹️ **Botón "Stop All Audio"**: Detiene inmediatamente toda reproducción
- 🎭 **Integración en fichas de actor**: Configuración de voces por personaje

#### **Rendimiento y Optimización**
- 💾 **Sistema de cache inteligente**: Almacena audios frecuentes con hash eficiente
- 🔄 **Procesamiento en cola**: Maneja múltiples solicitudes simultáneas
- 🧹 **Gestión de memoria**: Liberación automática de URLs de audio
- 🐛 **Sistema de debug**: Logging opcional para troubleshooting

### 🎯 **Mejoras de Experiencia**

#### **Para el Game Master**
- 🤖 **Proceso completamente automático**: CERO popups de confirmación
- ⏱️ **Sin interrupciones**: El GM puede seguir jugando sin molestias
- 📊 **Control total**: Monitoreo de uso y prevención de abusos
- 💰 **Control de costos**: Una sola llamada API por solicitud

#### **Para los Jugadores**
- 🎨 **Interfaz intuitiva**: Panel de control fácil de usar
- ⏳ **Feedback visual**: Ver la cola de audios pendientes
- 🎵 **Experiencia consistente**: Audio sincronizado para todos los jugadores
- 🔧 **Personalización**: Voces específicas por personaje

### 🔧 **Cambios Técnicos**

#### **Arquitectura**
- 🔄 **Sistema de sockets**: Comunicación bidireccional segura
- 🏗️ **Clases modulares**: Validator, RateLimiter, Cache, Queue
- 🌐 **Manejo de errores**: Clasificación inteligente de errores de API
- 📡 **Transmisión eficiente**: Audio enviado una vez, reproducido en todos los clientes

#### **Configuración**
- ⚙️ **Settings expandidos**: 
  - API Key (solo GM)
  - Habilitar voces por actor
  - Cache habilitado/deshabilitado
  - Volumen global TTS

### 🐛 **Correcciones de Errores**

- **Gestión de memoria**: URLs de Blob liberadas correctamente
- **Manejo de errores**: Notificaciones específicas por tipo de error
- **Validación de entrada**: Prevención de textos vacíos o demasiado largos
- **Sincronización**: Reproducción consistente en todos los clientes

### 📈 **Compatibilidad**

- ✅ **Foundry VTT**: Versiones 11-12 verificadas
- ✅ **Sistemas**: Compatible con todos los sistemas de juego
- ✅ **Módulos**: No presenta conflictos conocidos

---

## [v1.0.0] - 2024-XX-XX
### **Lanzamiento Inicial**
- Funcionalidad básica de Text-to-Speech con Gemini API
- Diálogo simple para generar audio
- Transmisión básica a todos los jugadores

---

**¿Listo para actualizar?** Simplemente instala la nueva versión y configura tu API Key en los ajustes del módulo. ¡El GM no necesita hacer nada más - el sistema funciona automáticamente! 🎉

*Nota: Los usuarios de versiones anteriores pueden actualizar sin problemas - todas las configuraciones se mantienen.*