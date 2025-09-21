# 🚀 Frontend ErgoSize - React + TypeScript + Vite

# 📋 Descripción
Frontend moderno para ErgoSize App construido con React 18, Vite 4, TypeScript y MUI. Interfaz de usuario responsive para la gestión y análisis de datos antropométricos.

# ✨ Características
⚡ Ultra rápido con Vite
🎨 Diseño basado en estilo Material con MUI
🔒 Autenticación JWT
📱 Totalmente responsive
🎯 TypeScript para mejor desarrollo
🔄 Estado global con Context API
🌐 Conexión API REST con Django Backend
🎪 Componentes modulares y reutilizables

# Prerrequisitos
Node.js 16+
npm o yarn
Backend Django ejecutándose

git clone <url-del-repositorio>
cd ergosize-frontend

npm install
# o
yarn install

# Configurar variables de entorno
url de la api, por defcto: 
VITE_API_BASE_URL=http://localhost:8000/api

# Ejecutar en desarrollo
npm run dev
# o
yarn dev

# 🚀 Scripts Disponibles
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run dev --host   # Acceso desde red local

# Build
npm run build        # Build para producción
npm run preview      # Preview del build

# Linting
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir problemas automáticamente

# TypeScript
npm run type-check   # Verificar tipos