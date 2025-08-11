# 🛰️ D1-A-L0G - Star Wars Chatbots App

Este proyecto es una interfaz interactiva que simula un sistema de comunicación con bots inspirados en personajes icónicos del universo de Star Wars. Su nombre, **D1-A-L0G**, hace referencia a los nombres de los droides de protocolo y de astromech, combinando la idea de diálogo con un guiño a la tecnología de la saga.

## 💡 ¿En qué consiste?

La aplicación ofrece una experiencia de conversación con múltiples chatbots, cada uno representando un personaje distinto de Star Wars. Cada bot tiene una personalidad única y responde de acuerdo con su carácter, estilo de habla y tono reconocible.

El usuario puede seleccionar entre diferentes bots, y mantener conversaciones independientes con cada uno. La interfaz presenta estética retro-futurista inspirada en el universo de Star Wars, que emula las consolas de naves o sistemas de comunicación galácticos, como los [datapads](https://starwars.fandom.com/es/wiki/Datapad) o las consolas de navegación de naves espaciales.

## 🎯 Propósito del proyecto

- **Demostrar el uso de modelos de lenguaje con personalización de personalidad** usando prompts específicos por bot.
- **Explorar el diseño y la integración de chatbots** en una interfaz web moderna y responsiva.
- **Implementar una arquitectura moderna** combinando React con servicios en la nube para una experiencia de usuario fluida.

## 🛠️ Stack Tecnológico

### Frontend

- **React + TypeScript** - Framework principal con tipado estático para mayor robustez
- **Vite** - Build tool moderno para desarrollo rápido y optimizado
- **CSS moderno** - Estilos responsivos con estética retro-futurista del universo Star Wars

### Backend & Servicios

- **Firebase** - Backend principal que proporciona:
  - Autenticación anónima de usuarios
  - Base de datos en tiempo real (Firestore) para persistencia de chats
  - Hosting y despliegue de la aplicación
- **Vercel AI SDK** - Manejo optimizado de la integración con IA
- **OpenAI API** - Generación de respuestas con personalidad específica por personaje

### Función Serverless

- **Vercel Function** - Función serverless que utiliza el Vercel AI SDK para:
  - Generar respuestas personalizadas por bot
  - Manejar streaming de respuestas en tiempo real
  - Gestionar prompts específicos para cada personaje
  - Optimizar el uso de tokens y rate limiting

## ✨ Features Principales

### 🤖 **Chatbots con Personalidad**

- **4 personajes únicos**: Darth Vader, R2-D2, C-3PO y Maestro Yoda
- Cada bot mantiene su personalidad, estilo de habla y tono característico
- Prompts personalizados que aseguran respuestas consistentes con cada personaje

### 💬 **Sistema de Chat Completo**

- Conversaciones independientes y persistentes por bot
- Almacenamiento en tiempo real de mensajes en Firebase
- Respuestas automáticas generadas por IA con personalidad específica

### 🔐 **Autenticación Seamless**

- Login anónimo a través de Firebase
- Gestión automática de sesiones de usuario
- Acceso inmediato a todos los bots disponibles

### 🎨 **Diseño Inmersivo**

- Estética retro-futurista auténtica del universo Star Wars
- Interfaz que emula consolas de naves espaciales y datapads
- Assets temáticos y animaciones que enriquecen la experiencia

## 🚀 Arquitectura

El proyecto utiliza **Firebase** como backend principal para la autenticación de usuarios y el almacenamiento de datos de chats y mensajes. La generación de respuestas se maneja a través de una **función serverless de Vercel** que integra el **Vercel AI SDK** con la **API de OpenAI**, permitiendo respuestas inteligentes y personalizadas.

Gracias a esta arquitectura, los usuarios pueden autenticarse de forma anónima y disfrutar de conversaciones fluidas con los 4 bots disponibles: **Darth Vader**, **R2-D2**, **C-3PO** y **el Maestro Yoda**.
