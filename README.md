# 🪪 CardPDF

[![Web App](https://img.shields.io/badge/Web_App-cardpdf.pages.dev-38BDF8?style=flat-square&logo=cloudflarepages&logoColor=white)](https://cardpdf.pages.dev/)
[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11.x-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Client-Side Privacy](https://img.shields.io/badge/Privacidad-100%25_Client--Side-10B981?style=flat-square&logo=shield&logoColor=white)](#-privacidad-y-seguridad-estricta)
[![Estándar ID-1](https://img.shields.io/badge/Formato-ISO%2FIEC_7810_ID--1_(CR80)-blue?style=flat-square)](#-especificaciones-t%C3%A9cnicas-y-geometr%C3%ADa)

> 🚀 **Uso en línea sin registro:** Puedes utilizar CardPDF directamente en **[https://cardpdf.pages.dev/](https://cardpdf.pages.dev/)**. No requiere ninguna registración previa, instalación ni configuración; es de acceso libre, instantáneo y 100% privado en tu navegador.

**CardPDF** es una aplicación web ligera de alta precisión desarrollada con **Astro**, **TypeScript** y **Tailwind CSS**. Permite generar un archivo PDF que simula una fotocopia en **tamaño real (escala 100%)** sobre una hoja **A4 estándar**, soportando **cualquier tarjeta o documento bajo el estándar internacional ISO/IEC 7810 ID-1 (CR80)** con dimensiones exactas de **85,60 mm × 53,98 mm** (proporción 1.586).

### 💳 Documentos y Tarjetas Compatibles
* **Documentos de Identidad:** DNI Tarjeta, Cédula de Identidad, Pasaporte tipo tarjeta.
* **Tránsito y Vehículos:** Licencia Nacional de Conducir, Cédula Verde, Cédula Azul.
* **Laborales y Académicos:** Credenciales corporativas, carnets estudiantiles y docentes.
* **Salud y Obras Sociales:** Carnets de prepagas, obras sociales, seguros médicos.
* **Transporte y Membresías:** Tarjetas de transporte público (SUBE, Metro), tarjetas de fidelización y membresías.

---

## 🔒 Privacidad y Seguridad Estricta

El procesamiento de documentos personales y credenciales requiere las máximas garantías de privacidad:
* **100% Client-Side:** Todo el recorte, ajuste de contraste, renderizado en alta resolución y generación del PDF ocurre íntegramente en la memoria de tu navegador (HTML5 `<canvas>` y `jspdf`).
* **Cero servidores:** Ningún archivo o dato se envía a servidores, nubes ni APIs externas.
* **Seguridad de dependencias con pnpm:** Aislamiento estricto de scripts de compilación mediante `pnpm-workspace.yaml`, previniendo vulnerabilidades de cadena de suministro (supply-chain attacks).

---

## 📐 Especificaciones Técnicas y Geometría

La disposición geométrica cumple rigurosamente con los estándares internacionales para documentos tipo tarjeta:

| Parámetro | Medida Oficial | Implementación en CardPDF |
| :--- | :--- | :--- |
| **Estándar de tarjeta** | ISO/IEC 7810 (ID-1 / CR80) | Universal (DNI, licencias, cédulas, credenciales) |
| **Ancho físico** | `85.60 mm` | `85.60 mm` exacto |
| **Alto físico** | `53.98 mm` | `53.98 mm` exacto |
| **Proporción de aspecto** | $85.60 / 53.98$ | **$1.586$** exacto |
| **Radio de curvatura** | `3.18 mm` | Recorte por clipping path de $3.18\text{ mm}$ |
| **Hoja de salida** | A4 Vertical | $210.00\text{ mm} \times 297.00\text{ mm}$ |
| **Centrado horizontal (X)** | $(210 - 85.60) / 2$ | **$62.20\text{ mm}$** para ambas tarjetas |
| **Posición vertical Frente (Y)** | Zona superior (Elevado) | **$35.00\text{ mm}$** |
| **Posición vertical Dorso (Y)** | Debajo del frente | **$115.00\text{ mm}$** |
| **Separación entre tarjetas** | $115 - (35 + 53.98)$ | **$26.02\text{ mm}$** |
| **Bordes de fotografías** | Sin marcos ni líneas | Limpio 100% (sin contornos ni líneas añadidas) |
| **Resolución de renderizado** | Alta fidelidad gráfica | **300 DPI** ($1011 \times 638\text{ px}$ en Canvas) |

---

## ✨ Características y Flujo de Uso

1. **Zonas de Carga Independientes (Dropzones):**
   * Dos áreas identificadas para "Frente" y "Dorso" con soporte para arrastrar y soltar o explorador de archivos (`.jpg`, `.png`, `.webp`).
2. **Edición Rápida y Encuadre Interactivo:**
   * **Rotación en pasos de 90°:** Permite corregir fotos tomadas en vertical u horizontal con un solo clic.
   * **Arrastrar para centrar (Pan interactivo):** Haz clic y arrastra directamente sobre la tarjeta para encuadrar tu documento si la foto tiene margen sobrante.
   * **Control de Zoom de Alta Precisión:** Botones **`-`** y **`+`** con pasos finos de **1% en 1% (`±0.01`)**, eliminando saltos bruscos. Admite clics individuales para ajuste milimétrico, pulsación continua (*hold-to-zoom*) para variación rápida, doble clic sobre el indicador para restablecer al 100% y botón de **Recentrado** integral (posición y zoom).
3. **Selector de Estilo de Fotocopia:**
   * **🌈 Color Real:** Preserva fielmente la fotografía original.
   * **🔘 Escala de Grises:** Conversión monocromática con ponderación de luminancia según norma ITU-R BT.601 ($Y = 0.299R + 0.587G + 0.114B$).
   * **📄 Tóner B&N (Alto Contraste):** Emulación de fotocopiadora de tóner tradicional, limpiando fondos oscuros y reforzando textos, firma y sellos.
4. **Vista Previa A4 en Tiempo Real:**
   * Representación interactiva proporcional a la hoja A4 en pantalla que refleja instantáneamente rotaciones, desplazamientos, zoom y estilos.
5. **Descarga Directa en PDF:**
   * Generación instantánea de archivo con nomenclatura:
     `Fotocopia_Documento_[YYYYMMDD_HHmmss].pdf`

---

## 🖨️ Recomendación para Imprimir a Tamaño Real

Al momento de mandar a imprimir el PDF generado, asegúrate de configurar tu visor o impresora con las siguientes opciones:
* **Escala / Ajuste de página:** Seleccionar **"Tamaño real"** o **"Escala 100%"**.
* **Desactivar:** Desmarca "Ajustar a la página" o "Reducir páginas excesivamente grandes" (estas opciones reducen las medidas físicas entre un 3% y un 5%).

---

## 🛠️ Instalación y Entorno de Desarrollo

### Requisitos Previos
* **Node.js:** Versión $\ge 18$
* **pnpm:** Versión $\ge 9$ (recomendado $\ge 11.24$)

### Comandos Principales

```bash
# 1. Instalar dependencias con verificación de seguridad
pnpm install

# 2. Iniciar servidor local de desarrollo
pnpm run dev
# Acceder en: http://localhost:4321

# 3. Compilar para producción (sitio estático optimizado en /dist)
pnpm run build

# 4. Previsualizar la compilación de producción
pnpm run preview

# 5. Ejecutar la suite de pruebas geométricas y de PDF
pnpm test
```

---

## 📁 Estructura del Repositorio

```text
cardpdf/
├── src/
│   ├── layouts/
│   │   └── Layout.astro      # Plantilla base, cabecera moderna, badges y favicon SVG
│   ├── pages/
│   │   └── index.astro       # Página principal con dropzones, controles y A4 Preview
│   ├── styles/
│   │   └── global.css        # Configuración base e importación de Tailwind CSS v4
│   └── utils/
│       ├── constants.ts      # Medidas geométricas ID-1 (mm y px a 300 DPI) y layout A4
│       ├── imageProcessor.ts # Motor Canvas: esquinas 3.18mm, rotación, pan, zoom y filtros
│       └── pdfGenerator.ts   # Generador milimétrico con jsPDF y escala 100%
├── tests/
│   └── verify-specs.mjs      # Test unitario automatizado de medidas y generación PDF
├── astro.config.mjs          # Configuración de Astro con plugin Tailwind CSS de Vite
├── package.json              # Scripts y manifiesto de dependencias
├── pnpm-workspace.yaml       # Políticas de seguridad pnpm para ejecución de scripts
├── pnpm-lock.yaml            # Árbol de dependencias estricto e inmutable
├── tsconfig.json             # Configuración TypeScript en modo estricto
└── README.md                 # Documentación técnica del proyecto
```

---

## 🧭 Tareas Pendientes / Mejoras

Relevado a partir de un análisis interno del proyecto (seguridad, dependencias y calidad de código). Pendiente de priorizar e implementar.

### 🔒 Seguridad
- [x] Actualizar `jspdf` de `2.5.2` a `4.x`: la versión actual reportaba varias vulnerabilidades en auditoría (incluida una crítica de path traversal/LFI y un ReDoS/DoS). Actualizado a `4.2.1` — `pnpm audit` ya no reporta advisories de `jspdf` ni `dompurify`, y se verificó que `pnpm test` y la generación de PDF (frente/dorso) siguen funcionando correctamente.
- [x] Agregar cabeceras de seguridad (`public/_headers` para Cloudflare Pages) con CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS` y cache inmutable para assets, coherente con la promesa de privacidad total.
- [x] Agregar el archivo `LICENSE` (MIT) al repositorio: el README lo referencia y ahora cuenta con la licencia MIT oficial y el campo correspondiente en `package.json`.
- [x] Validar tamaño máximo de archivo en la carga de imágenes (`handleFileSelect` y `loadFileAsImage`) limitado a 20 MB (`FILE_LIMITS`), con feedback claro en la UI y prevención de bloqueos por DoS/memoria al procesar a 300 DPI.

### 📦 Dependencias
- [x] Verificado tras actualizar `jspdf` a `4.2.1`: `html2canvas` y `dompurify` siguen generando chunks separados en `dist/_astro/` (import dinámico interno de jsPDF para su método `.html()`, que no usamos), pero `dist/index.html` no los referencia ni precarga — el navegador nunca los descarga en tiempo de ejecución. No es peso muerto real para el usuario; solo archivos de más en el build.
- [ ] Mantener Astro actualizado a la última versión estable (aunque las CVEs de SSR no aplican a este build 100% estático).

### 🧹 Calidad de código
- [ ] Hacer que `tests/verify-specs.mjs` importe las constantes reales desde `src/utils/constants.ts` en lugar de duplicarlas a mano, para que el test detecte regresiones reales.
- [ ] Revisar el parámetro `includeBorder` de `renderCardToCanvas`: siempre se invoca con `false`, por lo que el bloque de dibujo de borde en `imageProcessor.ts` es código muerto (exponerlo como opción real en la UI o eliminarlo).
- [ ] Eliminar la variable `includeBorder` sin uso en `index.astro`.
- [ ] Evaluar refactorizar `index.astro` para reducir la duplicación casi 1:1 entre los bloques "Frente" y "Dorso" (markup y handlers), parametrizando por `side`.
- [ ] Configurar CI (GitHub Actions) para correr `pnpm test` y type-check en cada push/PR.

### 🎨 UX
- [ ] Limitar el rango de paneo (arrastrar imagen) para evitar que la foto quede completamente fuera de cuadro sin más indicio que el botón "Recentrar".

---

## 📄 Licencia

Este proyecto es software libre bajo la licencia [MIT](LICENSE).
