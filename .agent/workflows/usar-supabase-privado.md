---
description: Configurar entorno para usar Supabase Privado y RAG (Ollama)
---

Este comando prepara al agente para trabajar con la infraestructura del servidor Proxmox.

### Pasos de Automatización:

1.  **Cargar Variables**: Leer el archivo `.env` local.
2.  **Configurar Conexión Base de Datos**:
    *   **Postgres**: IP `100.115.151.39` (Puerto según proyecto).
3.  **Configurar Conexión IA (RAG)**:
    *   **Ollama**: IP `100.114.88.116:11434`.
    *   Verificar disponibilidad de modelos `llama3` y `nomic-embed-text`.
4.  **Prioridad de Reglas**: Activar **Protocolo Maestro**.

// turbo
// Al ejecutar este comando, el agente queda listo.
