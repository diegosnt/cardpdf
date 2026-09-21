# 🪪 CardPDF

[![Web App](https://img.shields.io/badge/Web_App-cardpdf.pages.dev-38BDF8?style=flat-square&logo=cloudflarepages&logoColor=white)](https://cardpdf.pages.dev/)
[![Astro](https://img.shields.io/badge/Astro-7.x-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11.x-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Client-Side Privacy](https://img.shields.io/badge/Privacidad-100%25_Client--Side-10B981?style=flat-square&logo=shield&logoColor=white)](#-privacidad-y-seguridad-estricta)
[![Estándar ID-1](https://img.shields.io/badge/Formato-ISO%2FIEC_7810_ID--1_(CR80)-blue?style=flat-square)](#-especificaciones-t%C3%A9cnicas-y-geometr%C3%ADa)
[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-yellow?style=flat-square)](LICENSE)

> 🚀 **Uso en línea sin registro:** Puedes utilizar CardPDF directamente en **[https://cardpdf.pages.dev/](https://cardpdf.pages.dev/)**. No requiere ninguna registración previa, instalación ni configuración; es de acceso libre, instantáneo y 100% privado en tu navegador.

**CardPDF** es una aplicación web ligera y de alta fidelidad desarrollada con **Astro**, **TypeScript** y **Tailwind CSS**. Permite generar un archivo PDF que simula una fotocopia en **tamaño real (escala 100%)** sobre una hoja **A4 estándar**, soportando **cualquier tarjeta o documento bajo el estándar internacional ISO/IEC 7810 ID-1 (CR80)** con dimensiones exactas de **85,60 mm × 53,98 mm** (proporción 1.586).

### 💳 Documentos y Tarjetas Compatibles
* **Documentos de Identidad:** DNI Tarjeta, Cédula de Identidad, Pasaporte tipo tarjeta.
* **Tránsito y Vehículos:** Licencia Nacional de Conducir, Cédula Verde, Cédula Azul.
* **Laborales y Académicos:** Credenciales corporativas, carnets estudiantiles y docentes.
* **Salud y Obras Sociales:** Carnets de prepagas, obras sociales, seguros médicos.
* **Transporte y Membresías:** Tarjetas de transporte público (SUBE, Metro), tarjetas de fidelización y membresías.

---

## 🔒 Privacidad y Seguridad Estricta

El procesamiento de documentos personales y credenciales requiere las máximas garantías de privacidad y protección técnica:

* **100% Client-Side:** Todo el recorte, ajuste de contraste, renderizado en alta resolución y generación del PDF ocurre íntegramente en la memoria de tu navegador (HTML5 `<canvas>` y `jsPDF`).
* **Cero servidores / Cero telemetría:** Ningún archivo, imagen ni metadato se envía a servidores, nubes ni APIs externas.
* **Validación Rigurosa de Formatos y Tipos MIME:**
  * Admite exclusivamente formatos de imagen rasterizados seguros: `.jpg`, `.jpeg`, `.png` y `.webp`.
  * Validación dual preventiva (extensión y tipo MIME) antes de procesar el archivo en memoria.
* **Prevención de Contaminación de Canvas y Ataques XSS:** Bloqueo explícito de formatos vectoriales como SVG (que pueden inyectar scripts en el DOM o marcar como "tainted" el contexto gráfico del Canvas), GIF, TIFF, BMP, PDF o ejecutables disfrazados.
* **Protección contra Sobrecarga y DoS en Navegador:** Límite estricto de **20 MB** por archivo (`FILE_LIMITS.MAX_FILE_SIZE_MB`), alertando al usuario antes de saturar memoria o congelar el hilo principal del navegador al trabajar a 300 DPI.
* **Cabeceras HTTP de Seguridad Avanzadas (`public/_headers`):** Políticas estrictas configuradas para despliegue en Cloudflare Pages:
  * **Content Security Policy (CSP):** `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';` (bloquea cualquier petición de red saliente desde el navegador).
  * **X-Frame-Options:** `DENY` (protección contra clickjacking).
  * **X-Content-Type-Options:** `nosniff` (previene ataques de MIME sniffing).
  * **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains; preload`.
  * **Permissions-Policy:** Deshabilita el acceso a cámara, micrófono, geolocalización, acelerómetro, pagos, etc.
  * **Referrer-Policy:** `strict-origin-when-cross-origin`.
* **Aislamiento de Dependencias:** Configuración en `pnpm-workspace.yaml` para prevenir ejecución no autorizada de scripts durante la instalación de paquetes.

---

## 📐 Especificaciones Técnicas y Geometría

La disposición geométrica cumple rigurosamente con los estándares internacionales para documentos tipo tarjeta y optimización en papel **A4 ($210.00 \times 297.00\text{ mm}$)**:

### Medidas Base del Documento (Norma ISO/IEC 7810 ID-1 / CR80)
| Parámetro | Medida Oficial | Implementación en CardPDF |
| :--- | :--- | :--- |
| **Estándar de tarjeta** | ISO/IEC 7810 (ID-1 / CR80) | Universal (DNI, licencias, cédulas, credenciales) |
| **Ancho físico** | `85.60 mm` | **$85.60\text{ mm}$** exacto |
| **Alto físico** | `53.98 mm` | **$53.98\text{ mm}$** exacto |
| **Proporción de aspecto** | $85.60 / 53.98$ | **$1.586$** exacto |
| **Radio de curvatura** | `3.18 mm` | Recorte por clipping path de **$3.18\text{ mm}$** |
| **Bordes de fotografías** | Sin marcos ni líneas | Limpio 100% (sin contornos ni líneas grises añadidas) |
| **Resolución de renderizado** | Alta fidelidad gráfica | **300 DPI** ($1011 \times 638\text{ px}$ en Canvas) |

### Disposición Geométrica por Modos

| Parámetro Geométrico | Modo Vertical (Apiladas) | Modo Horizontal (En Paralelo / Multi-Fila) |
| :--- | :--- | :--- |
| **Orientación** | Tarjetas una debajo de otra | Tarjetas una al lado de la otra |
| **Centrado Horizontal (X)** | $X = 62.20\text{ mm}$ (centrado en A4) | Frente: $X = 16.00\text{ mm}$ \| Dorso: $X = 108.40\text{ mm}$ |
| **Márgenes Laterales** | $62.20\text{ mm}$ a cada lado | **$16.00\text{ mm}$ simétricos** a ambos lados (+23% margen) |
| **Separación entre Fotos** | **$12.02\text{ mm}$** vertical | **$6.80\text{ mm}$** horizontal (eje medio $105.00\text{ mm}$) |
| **Capacidad en 1 Hoja A4** | 1 o 2 juegos (hasta 4 tarjetas) | **1, 2, 3 o 4 filas** (hasta 8 tarjetas en 1 hoja) |
| **Posición Y - Fila / Juego 1** | Frente: $20.00\text{ mm}$ \| Dorso: $86.00\text{ mm}$ | Fila 1: **$16.00\text{ mm}$** |
| **Posición Y - Fila / Juego 2** | Frente: $157.02\text{ mm}$ \| Dorso: $223.02\text{ mm}$ | Fila 2: **$86.34\text{ mm}$** |
| **Posición Y - Fila / Juego 3** | — | Fila 3: **$156.68\text{ mm}$** |
| **Posición Y - Fila / Juego 4** | — | Fila 4: **$227.02\text{ mm}$** |
| **Separación entre Filas / Juegos** | $17.04\text{ mm}$ entre juegos 1 y 2 | **$16.36\text{ mm}$ uniforme** entre todas las filas |
| **Eje de Corte A4 ($148.50\text{ mm}$)** | Divide simétricamente juego 1 y juego 2 | Divide exactamente entre fila 2 y fila 3 (dos A5 simétricas) |
| **Margen Inferior en Hoja A4** | $20.00\text{ mm}$ | **$16.00\text{ mm}$** (idéntico a margen superior) |

---

## ✨ Características y Flujo de Uso

1. **Arquitectura Modular de Paneles (`CardPanel.astro`):**
   * Paneles desacoplados para "Frente" y "Dorso" con dropzones para arrastrar y soltar o explorar archivos.
   * Filtro de entrada `accept` restrictivo en el navegador y validación estricta de tipos de imagen (`.jpg`, `.jpeg`, `.png`, `.webp`).
   * Alerta preventiva y bloqueo inmediato ante archivos que excedan los **20 MB** para evitar saturación de memoria.
2. **Edición Rápida y Encuadre Interactivo:**
   * **Rotación en pasos de 90°:** Corrige fotos tomadas en vertical u horizontal con un solo clic.
   * **Arrastrar para centrar (Pan interactivo con Clamping):** Haz clic y arrastra directamente sobre la tarjeta para encuadrar tu documento. Incluye delimitación inteligente (*UX clamping*) para evitar perder la imagen fuera de los márgenes visibles, recalculado dinámicamente según zoom y rotación.
   * **Control de Zoom de Alta Precisión:** Botones **`-`** y **`+`** con pasos finos de **1% en 1% (`±0.01`)**, eliminando saltos bruscos. Admite clics individuales para ajuste milimétrico, pulsación continua (*hold-to-zoom*) para variación rápida, doble clic sobre el indicador numérico para restablecer al 100% y botón de **Recentrado** integral (posición y zoom a valores iniciales).
3. **Selector de Estilo de Fotocopia:**
   * **🌈 Color Real:** Preserva fielmente la fotografía original.
   * **🔘 Escala de Grises:** Conversión monocromática con ponderación de luminancia según norma ITU-R BT.601 ($Y = 0.299R + 0.587G + 0.114B$).
   * **📄 Tóner B&N (Alto Contraste):** Emulación de fotocopiadora de tóner tradicional, limpiando fondos oscuros y reforzando textos, firmas y sellos.
4. **Selector de Disposición en la Hoja A4:**
   * **⬇️ Una debajo de otra (Apiladas):** Posicionamiento vertical centrado ($X = 62.20\text{ mm}$) con $12.02\text{ mm}$ de separación entre fotos.
   * **➡️ Una al lado de otra (En paralelo):** Posicionamiento horizontal con márgenes laterales ampliados de $16.00\text{ mm}$ y separación compacta de $6.80\text{ mm}$ entre frente y dorso.
5. **Múltiples Copias y Filas en 1 Hoja:**
   * **En modo vertical:** Tilde opcional para imprimir **2 juegos completos idénticos** (4 tarjetas: 2 frentes y 2 dorsos) en la misma hoja A4 con separación diferenciada de $17.04\text{ mm}$ para fácil guillotinado.
   * **En modo horizontal:** Selector interactivo de **1 fila** (2 fotos), **2 filas** (4 fotos), **3 filas** (6 fotos) o **4 filas** (8 fotos) aprovechando la hoja A4 al 100% con márgenes perimetrales simétricos de $16.00\text{ mm}$ y separación vertical uniforme de $16.36\text{ mm}$.
6. **Vista Previa A4 Interactiva 100% Despejada:**
   * Representación proporcional a la hoja A4 en pantalla que refleja en tiempo real la disposición seleccionada, número de filas, rotaciones, desplazamientos, zoom y estilos.
   * **Sin carteles flotantes molestos:** La superficie de la hoja se mantiene completamente despejada y limpia, sin textos ni líneas intermedias que interfieran con la visión de las fotos.
7. **Botón de Reinicio para Generar Otro PDF:**
   * Botón dedicado que permite restablecer completamente la interfaz (limpieza de imágenes, zoom, rotaciones, modos de color y disposición) con un solo clic, sin necesidad de recargar la página (*F5*).
8. **Descarga Directa en PDF a Tamaño Real (300 DPI):**
   * Generación instantánea mediante `jsPDF` con unidades milimétricas exactas y nomenclatura descriptiva con marca de tiempo:
     `CardPDF_Documento_[YYYYMMDD_HHmmss].pdf`
   * El botón de descarga adapta su texto en tiempo real indicando la cantidad exacta de filas y tarjetas a generar (ej. *"Descargar PDF (4 filas - 8 tarjetas)"*).

---

## 🖨️ Recomendación para Imprimir a Tamaño Real

Al momento de mandar a imprimir el PDF generado, asegúrate de configurar tu visor o impresora con las siguientes opciones:
* **Escala / Ajuste de página:** Seleccionar **"Tamaño real"** o **"Escala 100%"**.
* **Desactivar:** Desmarca "Ajustar a la página" o "Reducir páginas excesivamente grandes" (estas opciones reducen las medidas físicas entre un 3% y un 5%).

---

## 🧪 Suite de Pruebas Automatizadas

El proyecto cuenta con una batería completa de pruebas unitarias y de integración geométrica ejecutada mediante Node.js:

```bash
pnpm test
```

### Validaciones Cubiertas en los Tests (`tests/verify-specs.mjs`):
* **Precisión dimensional ISO/IEC 7810 ID-1:** Ancho de $85.60\text{ mm}$, alto de $53.98\text{ mm}$, proporción $1.586$ y radio de curvatura de $3.18\text{ mm}$.
* **Resolución a 300 DPI:** Dimensiones exactas de Canvas ($1011 \times 638\text{ px}$) y radio equivalente ($37.6\text{ px}$).
* **Geometría y separaciones A4:** Comprobación de márgenes, espaciado entre fotos ($12.02\text{ mm}$ y $6.80\text{ mm}$) y separación de guillotinado ($17.04\text{ mm}$ y $16.36\text{ mm}$).
* **Generación de PDF en memoria:** Emisión y cálculo de bytes de documentos en modo vertical (1 y 2 juegos) y modo horizontal (1 y 4 filas / 8 tarjetas).
* **Seguridad y formatos de archivo:**
  * Validación de formatos soportados: `.jpg`, `.jpeg`, `.png`, `.webp` (incluyendo extensiones y tipos MIME en mayúsculas o con atributos adicionales).
  * Rechazo estricto de formatos no seguros: `.svg`, `.gif`, `.bmp`, `.pdf`, `.js`, y archivos maliciosos con extensiones simuladas.
  * Verificación de límites de peso por archivo (aceptación de $\le 20\text{ MB}$, rechazo de $> 20\text{ MB}$).
* **Matemática de UX Clamping:** Limitación dinámica de paneo horizontal y vertical según el nivel de zoom y rotación de la tarjeta.

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

# 5. Ejecutar la suite de pruebas geométricas, de seguridad y de PDF
pnpm test
```

---

## 📁 Estructura del Repositorio

```text
cardpdf/
├── src/
│   ├── components/
│   │   └── CardPanel.astro   # Componente modular para las tarjetas de Frente y Dorso
│   ├── layouts/
│   │   └── Layout.astro      # Plantilla base, cabecera moderna, badges y favicon SVG
│   ├── pages/
│   │   └── index.astro       # Página principal con dropzones, controles y A4 Preview
│   ├── styles/
│   │   └── global.css        # Configuración base e importación de Tailwind CSS v4
│   └── utils/
│       ├── constants.ts      # Medidas geométricas ID-1 (mm y px a 300 DPI) y layout A4
│       ├── imageProcessor.ts # Motor Canvas: esquinas 3.18mm, rotación, pan, zoom y validación
│       └── pdfGenerator.ts   # Generador milimétrico con jsPDF y escala 100%
├── public/
│   └── _headers              # Cabeceras HTTP de seguridad estricta (CSP, HSTS, X-Frame-Options)
├── tests/
│   └── verify-specs.mjs      # Test unitario automatizado de medidas, seguridad y generación PDF
├── astro.config.mjs          # Configuración de Astro con plugin Tailwind CSS de Vite
├── package.json              # Scripts y manifiesto de dependencias
├── pnpm-workspace.yaml       # Políticas de seguridad pnpm para ejecución de scripts
├── pnpm-lock.yaml            # Árbol de dependencias estricto e inmutable
├── tsconfig.json             # Configuración TypeScript en modo estricto
└── README.md                 # Documentación técnica del proyecto
```

---

## 📄 Licencia

Este proyecto es software libre bajo la licencia [MIT](LICENSE).
