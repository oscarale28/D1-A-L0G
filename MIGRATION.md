# Instrucciones de Instalación Post-Refactorización

## 🔄 Pasos para completar la migración

### 1. Instalar nuevas dependencias

```bash
pnpm install
```

Esto instalará:

- `@ai-sdk/openai`: Proveedor de OpenAI para Vercel AI SDK
- `ai`: Vercel AI SDK core
- `zod`: Validación de esquemas

### 2. Remover dependencias obsoletas

Las siguientes dependencias fueron removidas automáticamente:

- `@google-cloud/functions-framework`
- `openai` (SDK directo, reemplazado por `@ai-sdk/openai`)

### 3. Configurar variables de entorno

Copia `.env.example` a `.env.local` y configura:

```env
OPENAI_API_KEY=your_openai_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Probar la aplicación localmente

```bash
pnpm dev
```

### 5. Deployment en Vercel

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno `OPENAI_API_KEY` en el dashboard de Vercel
3. Deploy automático

## ✅ Cambios Realizados

### Arquitectura

- ❌ **Eliminado**: Firebase Cloud Functions
- ✅ **Añadido**: Vercel Serverless Functions
- ✅ **Añadido**: Vercel AI SDK para OpenAI

### Funcionalidad

- ✅ **Mantenido**: Firestore para almacenamiento
- ✅ **Mantenido**: Firebase Auth
- ✅ **Mejorado**: Respuestas de IA con mejor manejo de errores
- ✅ **Añadido**: Respuestas de fallback cuando la API falla

### Archivos Modificados

- `package.json`: Nuevas dependencias
- `src/lib/services/firestore.ts`: Nueva función para generar respuestas
- `src/lib/services/ai-api.ts`: Nuevo servicio para API de IA
- `src/lib/providers/ChatListProvider.tsx`: Integración con nueva API
- `api/generate-response.ts`: Nueva función serverless
- `vercel.json`: Configuración de Vercel
- `README.md`: Documentación actualizada

### Archivos Eliminados

- `functions/`: Directorio completo de Cloud Functions
- `firebase.json`: Configuración de Firebase Functions
- `firestore.indexes.json`: Índices de Firestore

## 🚀 Beneficios de la Migración

1. **Mejor Performance**: Vercel Edge Functions son más rápidas
2. **Menor Latencia**: Funciones distribuidas globalmente
3. **Mejor DX**: Vercel AI SDK simplifica la integración con OpenAI
4. **Más Control**: Manejo directo de streams y errores
5. **Escalabilidad**: Auto-scaling sin configuración
6. **Costo**: Tier gratuito más generoso en Vercel

## 🔧 Troubleshooting

### Error de tipos TypeScript

Si ves errores de tipos, ejecuta:

```bash
pnpm install
```

### API no responde

1. Verifica que `OPENAI_API_KEY` esté configurada
2. Revisa los logs en Vercel Dashboard
3. Asegúrate de que la función está desplegada

### Problemas de CORS

Las funciones de Vercel manejan CORS automáticamente para el mismo dominio.

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de la consola del navegador
2. Verifica los logs de Vercel Functions
3. Confirma que todas las variables de entorno están configuradas
