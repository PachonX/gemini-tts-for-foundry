# Roadmap de "Gemini TTS for Foundry"

Este documento describe las futuras mejoras y características planificadas para el módulo, basadas en las excelentes sugerencias de la comunidad.

## 🚀 Próximas Funcionalidades

### 1. Sistema de Macros y Automatización
- [ ] **Crear una API externa**: Exponer funciones como `game.modules.get('gemini-tts-for-foundry').api.speakAsCharacter(actorId, text)` para permitir que otros módulos y macros activen el TTS de forma programática.
- [ ] **Documentar la API**: Proporcionar ejemplos claros de cómo usar la API para automatizar la narración o los diálogos de los personajes.

### 2. Soporte para Múltiples Proveedores de TTS
- [ ] **Abstraer el servicio de TTS**: Refactorizar el código para desacoplar la lógica de la API de Gemini y permitir la integración de otros proveedores (como ElevenLabs, OpenAI TTS, etc.).
- [ ] **Añadir configuración de proveedor**: Incluir una opción en los ajustes del módulo para que el GM elija qué servicio de TTS utilizar.

### 3. Interfaz de Usuario Mejorada (Panel de Control)
- [x] **Panel de control flotante**: Reemplazar el diálogo modal con una ventana `Application` flotante que puede permanecer abierta.
- [x] **Controles avanzados**: Añadir controles de volumen global, un botón de "parar todo el audio", y una vista de la cola de TTS actual.

### 4. Sistema de Efectos de Sonido y Modulación
- [ ] **Integración con la Web Audio API**: Implementar una clase `AudioEffects` para procesar el audio antes de reproducirlo.
- [ ] **Efectos configurables**: Añadir opciones en el diálogo de TTS para aplicar efectos básicos como cambio de tono (pitch shift) o reverberación, útiles para voces de monstruos o ambientes específicos.

### 5. Integración con el Sistema de Escenas
- [ ] **Audio ambiental por escena**: Permitir al GM configurar un texto y una voz para que se reproduzca en bucle como ambiente sonoro cuando una escena se activa.
- [ ] **Triggers de audio**: Explorar la posibilidad de vincular audios de TTS a zonas específicas del mapa (usando módulos como Multilevel Tokens o Trigger Happy).

### 6. Sistema de Plantillas de Diálogo
- [ ] **Interfaz para plantillas**: Crear una UI donde los GMs puedan definir y guardar plantillas de frases comunes (ej. ataques, hechizos, interacciones sociales).
- [ ] **Acceso rápido**: Integrar un selector de plantillas en el diálogo de TTS para una selección rápida.

### 7. Sistema de Filtros de Contenido
- [ ] **Añadir ajuste de filtro**: Implementar la configuración `contentFilterLevel` (Ninguno, Estándar, Estricto) sugerida.
- [ ] **Lógica de filtrado**: Crear una función `ContentFilter` que procese el texto antes de enviarlo a la API para reemplazar palabras o frases no deseadas.

### 8. Métricas y Analytics (Opcional)
- [ ] **Mecanismo de opt-in**: Añadir una opción de configuración para que los GMs puedan habilitar el envío anónimo de métricas de uso.
- [ ] **Recopilación de datos básicos**: Registrar eventos como `generacion_exitosa`, `error_api`, `cache_hit` para ayudar a identificar problemas y priorizar mejoras.