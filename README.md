# Gemini TTS for Foundry

Un módulo para Foundry VTT que permite a los usuarios generar audio de texto a voz (Text-to-Speech) de alta calidad utilizando la API de Google Gemini. El audio generado se transmite instantáneamente a todos los jugadores conectados, proporcionando una herramienta de comunicación y accesibilidad crucial para jugadores sin micrófono o para mejorar la inmersión en la partida.

## Características

- **Audio de Alta Calidad:** Utiliza los modelos de voz de Google Gemini para una narración clara y natural.
- **Transmisión en Tiempo Real:** El audio se comparte con todos los jugadores en la sesión a través de sockets para una experiencia sincronizada.
- **Selección de Voz:** Permite elegir entre varias voces de Gemini para adaptarse a diferentes personajes o narradores.
- **Integración Sencilla:** Añade un botón de fácil acceso directamente en la ventana de chat de Foundry.
- **Configuración Fácil:** El Game Master (GM) puede configurar la clave de la API necesaria a través del menú de ajustes del módulo.

## Instalación

1.  En el menú principal de Foundry VTT, ve a la pestaña **"Setup"**.
2.  Haz clic en el botón **"Add-on Modules"**.
3.  Haz clic en **"Install Module"** en la parte inferior.
4.  En el campo "Manifest URL", copia y pega la siguiente URL:
    ```
    https://github.com/PachonX/gemini-tts-for-foundry/releases/latest/download/module.json
    ```
    *(Nota: Reemplaza `PachonX/gemini-tts-for-foundry` con tu usuario y nombre de repositorio si lo has subido a tu propia cuenta).*
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
4.  Selecciona una de las voces disponibles en el menú desplegable.
5.  Haz clic en el botón **"Speak"**.

El audio se generará y se reproducirá automáticamente para todos los jugadores en la partida.
