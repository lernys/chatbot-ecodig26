# 🌿 Eco – Chatbot tutor del curso Ecosistemas Digitales

Asistente virtual basado en Claude (Anthropic) para el curso "Ecosistemas Digitales en Entornos de Aprendizaje" de Virtual Educa / Aprende Virtual 2025.

## Arquitectura

```
Next.js 15 (App Router)
├── /app/page.tsx          → Página principal del chat
├── /app/embed/page.tsx    → Versión embebible (iframe para Educativa LMS)
├── /app/api/chat/route.ts → API que conecta con Claude via Anthropic SDK
├── /lib/system-prompt.ts  → Cerebro pedagógico: contenido del curso + reglas
└── /components/ChatInterface.tsx → Interfaz de chat
```

## Stack técnico

- **Framework**: Next.js 15 con App Router
- **AI SDK**: Vercel AI SDK + @ai-sdk/anthropic
- **Modelo**: Claude Sonnet 4 (Anthropic)
- **Hosting**: Vercel (plan Hobby gratuito)
- **Enfoque**: System prompt con todo el contenido del curso (no requiere RAG ni base de datos)

## Despliegue en Vercel (paso a paso)

### 1. Subir a GitHub

```bash
cd chatbot-curso
git init
git add .
git commit -m "Initial commit: Eco chatbot"
git remote add origin https://github.com/TU_USUARIO/chatbot-ecosistemas-digitales.git
git push -u origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa el repositorio de GitHub
3. En **Environment Variables**, añade:
   - `ANTHROPIC_API_KEY` = tu clave de API de Anthropic
4. Haz clic en **Deploy**

### 3. Listo

Tu chatbot estará en: `https://chatbot-ecosistemas-digitales.vercel.app`

## Embeber en Educativa LMS

### Opción A: iframe directo
```html
<iframe 
  src="https://TU-PROYECTO.vercel.app/embed" 
  width="100%" 
  height="650" 
  frameborder="0"
  style="border-radius: 12px; border: 1px solid #e8e6e1;"
  allow="clipboard-write"
></iframe>
```

### Opción B: Botón flotante (para añadir en cualquier página)
```html
<style>
  .eco-btn { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #2a9d8f, #40b8a8); border: none; cursor: pointer; font-size: 24px; box-shadow: 0 4px 16px rgba(42,157,143,0.3); z-index: 9999; transition: transform 0.2s; }
  .eco-btn:hover { transform: scale(1.08); }
  .eco-popup { position: fixed; bottom: 92px; right: 24px; width: 400px; height: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.15); z-index: 9999; display: none; }
  .eco-popup.open { display: block; }
  .eco-popup iframe { width: 100%; height: 100%; border: none; }
</style>
<button class="eco-btn" onclick="document.getElementById('eco-popup').classList.toggle('open')">🌿</button>
<div id="eco-popup" class="eco-popup">
  <iframe src="https://TU-PROYECTO.vercel.app/embed"></iframe>
</div>
```

## Personalización del system prompt

El archivo `lib/system-prompt.ts` contiene toda la "inteligencia" del chatbot:

- **Personalidad**: tono, nombre, estilo de comunicación
- **Contenido del curso**: fundamentación, módulos, objetivos
- **Criterios de evaluación**: rúbricas, tipos de trabajo, plazos
- **Reglas pedagógicas**: cómo guiar sin resolver, cómo motivar

Para actualizar el contenido (nuevas fechas, nuevos módulos, lecturas adicionales), edita directamente ese archivo y haz redeploy.

## Coste estimado

| Concepto | Coste |
|----------|-------|
| Vercel hosting (Hobby) | Gratis |
| Anthropic API (Claude Sonnet) | ~$3/millón tokens entrada, ~$15/millón tokens salida |
| Uso estimado (30 alumnos, uso moderado) | $5-15 USD/mes |

## Estructura de archivos

```
chatbot-curso/
├── app/
│   ├── api/chat/route.ts    # Endpoint API
│   ├── embed/page.tsx       # Versión para iframe
│   ├── globals.css          # Estilos
│   ├── layout.tsx           # Layout raíz
│   └── page.tsx             # Página principal
├── components/
│   └── ChatInterface.tsx    # Componente de chat
├── lib/
│   └── system-prompt.ts     # Prompt del sistema
├── .env.local.example       # Template de variables
├── next.config.js           # Config de Next.js
├── package.json
├── tsconfig.json
└── vercel.json
```
