# KIVO-Contabilidad | CRM Dashboard

Dashboard financiero en tiempo real para negocio de gomitas y dulces.

## 🚀 Características
- **Tiempo Real:** Sincronización automática con Supabase.
- **Dashboard:** KPIs de hoy, gráficos de área y distribución por producto.
- **Ventas:** Análisis detallado por períodos (Hoy, Semana, Mes).
- **Inventario:** Control de stock con semáforo de estados (Crítico, Bajo, Óptimo).
- **Producción:** Registro diario de producción de gomitas y dulces.

## 🛠️ Stack
- React 18 + Vite
- Supabase JS
- Recharts
- Lucide React
- Vanilla CSS

## ⚙️ Instalación
1. Clonar: `git clone https://github.com/sebastiansosaia-dev/kivo-contabilidad.git`
2. Instalar: `npm install`
3. Variables de entorno: Crear `.env` basado en `.env.example`.
4. Iniciar: `npm run dev`

## ☁️ Despliegue en Vercel
Este proyecto está configurado para Vercel via `vercel.json` (SPA mode). Para desplegar:
1. Conecta el repositorio en Vercel.
2. Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el dashboard de Vercel.
3. ¡Listo!
