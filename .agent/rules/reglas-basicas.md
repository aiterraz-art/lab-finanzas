TÍTULO: PROTOCOLO DE PROYECTO - GESTIÓN LABORATORIO DENTAL
PRIORIDAD: MÁXIMA

OBJETIVO: Sistema de Gestión Financiera y Conciliación Bancaria.

STACK TECNOLÓGICO:
- Frontend: Vite + React + TypeScript + TailwindCSS + Shadcn/UI.
- Backend: Supabase (Self-hosted en Coolify).
- Automatización: n8n.
- IA: Ollama (Inferencia Local).

REGLAS ESPECÍFICAS:
1. ARQUITECTURA:
   - "gestion_laboratorio" es el esquema de base de datos.
   - Todo el estado frontend se maneja con TanStack Query.
   - UI debe ser "Premium" (Shadcn/UI, Micro-animaciones).

2. CONEXIÓN SUPABASE:
   - Cliente JS: @supabase/supabase-js
   - Auth: Supabase Auth.
   - Storage: Buckets para facturas (PDF/IMG).

3. FLUJO DE TRABAJO:
   - Validar siempre en local (npm run dev).
   - No hacer PUSH sin autorización.
