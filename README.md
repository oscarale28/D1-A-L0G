# 🛰️ D1-A-L0G - Star Wars Chatbots App

Este proyecto es una interfaz interactiva que simula un sistema de comunicación con bots inspirados en personajes icónicos del universo de Star Wars. Su nombre, **D1-A-L0G**, hace referencia a los nombres de los droides de protocolo y de astromech, combinando la idea de diálogo con un guiño a la tecnología de la saga.

## 💡 ¿En qué consiste?

La aplicación ofrece una experiencia de conversación con múltiples chatbots, cada uno representando un personaje distinto de Star Wars. Cada bot tiene una personalidad única y responde de acuerdo con su carácter, estilo de habla y tono reconocible.

El usuario puede seleccionar entre diferentes bots, y mantener conversaciones independientes con cada uno. La interfaz presenta estética retro-futurista inspirada en el universo de Star Wars, que emula las consolas de naves o sistemas de comunicación galácticos, como los [datapads](https://starwars.fandom.com/es/wiki/Datapad).

## 🎯 Propósito del proyecto

- **Demostrar el uso de modelos de lenguaje con personalización de personalidad** usando prompts específicos por bot.
- **Explorar el diseño y la integración de chatbots** en una interfaz web moderna y responsiva.

Este proyecto utiliza **Firebase** como backend principal para la autenticación de usuarios y el almacenamiento de datos de chats y mensajes. Gracias a Firebase, los usuarios pueden autenticarse de forma anónima en la aplicación y tener a su disponibilidad los 4 bots disponibles: **Darth Vader**, **R2-D2**, **C-3PO** y **el Maestro Yoda**.

---

## ❗ Alcances y limitaciones

Actualmente, el proyecto tiene un alcance de solamente envío y almacenamiento de mensajes **por parte del usuario**. Debido a problemas con el despliegue de la Firebase Function dedicada a la generación de respuestas con OpenAI, la aplicación no puede generar respuestas automáticas de los bots.
