import { CARD_CONFIG, FILE_LIMITS, type ColorMode } from './constants';

export interface CardState {
  file: File | null;
  imageElement: HTMLImageElement | null;
  rotation: number; // 0, 90, 180, 270
  zoom: number; // 1.0 default
  offsetX: number; // in pixels
  offsetY: number;
}

/**
 * Traza un rectángulo con esquinas redondeadas en el contexto Canvas,
 * garantizando compatibilidad con navegadores que no soportan roundRect.
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

/**
 * Procesa una imagen de DNI en un Canvas de alta resolución (300 DPI)
 * aplicando recorte de esquinas redondeadas (3.18 mm), rotación, zoom y modo de color.
 * 
 * IMPORTANTE: Rellena explícitamente las 4 esquinas exteriores con blanco puro (#ffffff)
 * para evitar que los formatos sin canal alfa (como JPEG) o la compresión del PDF
 * las conviertan en negro.
 */
export async function renderCardToCanvas(
  card: CardState,
  colorMode: ColorMode = 'original'
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = CARD_CONFIG.CANVAS_WIDTH_PX;
  const height = CARD_CONFIG.CANVAS_HEIGHT_PX;
  const radius = CARD_CONFIG.CANVAS_RADIUS_PX;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // 1. Inicializar todo el canvas con fondo blanco puro (#ffffff)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 2. Guardar estado y aplicar máscara de recorte redondeada (3.18 mm)
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(ctx, 0, 0, width, height, radius);
  ctx.clip();

  // Fondo blanco base de la tarjeta (por si la imagen no cubre o mientras carga)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  if (card.imageElement) {
    const img = card.imageElement;
    ctx.save();

    // Centro del canvas para transformaciones (rotación, zoom y pan)
    ctx.translate(width / 2 + card.offsetX, height / 2 + card.offsetY);
    ctx.rotate((card.rotation * Math.PI) / 180);
    ctx.scale(card.zoom, card.zoom);

    // Calcular escala "cover" considerando si la rotación es vertical (90 o 270 grados)
    const isRotated90or270 = card.rotation % 180 !== 0;
    const targetW = isRotated90or270 ? height : width;
    const targetH = isRotated90or270 ? width : height;

    const scale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  } else {
    // Marcador si no hay imagen
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sin imagen cargada', width / 2, height / 2);
  }

  // Aplicar filtros de color/fotocopia a la tarjeta si corresponde
  if (card.imageElement && colorMode !== 'original') {
    applyColorFilter(ctx, width, height, colorMode);
  }

  // Deshacer el clipping para poder trabajar en el canvas completo
  ctx.restore();

  // 3. MÁSCARA EXTERIOR DE BLANCO PURO (SOLUCIÓN ANTI-ESQUINAS NEGRAS)
  // Usando la regla de relleno 'evenodd', pintamos de blanco puro (#ffffff)
  // exclusivamente las 4 esquinas situadas entre el rectángulo exterior
  // y el contorno redondeado interior de la tarjeta.
  // Esto garantiza que ningún pixel fuera del radio de 3.18 mm quede oscuro ni transparente.
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  drawRoundedRect(ctx, 0, 0, width, height, radius);
  ctx.fill('evenodd');
  ctx.restore();

  return canvas;
}

/**
 * Aplica transformación de píxeles para escala de grises o fotocopia blanco y negro
 */
function applyColorFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mode: ColorMode
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  if (mode === 'grayscale') {
    for (let i = 0; i < data.length; i += 4) {
      // Luminancia estándar ITU-R BT.601
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  } else if (mode === 'photocopy') {
    // Simulación de fotocopiadora: aumento de contraste con realce de blancos
    const contrastFactor = 1.35;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      
      let adjusted = ((gray - 128) * contrastFactor) + 128;
      if (adjusted > 210) {
        adjusted = 255;
      } else if (adjusted < 50) {
        adjusted = adjusted * 0.7;
      }
      adjusted = Math.min(255, Math.max(0, adjusted));

      data[i] = adjusted;
      data[i + 1] = adjusted;
      data[i + 2] = adjusted;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Carga un File o Blob como HTMLImageElement
 */
export function loadFileAsImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida. Selecciona un archivo JPG, PNG o WebP.'));
    }
    if (file.size > FILE_LIMITS.MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return reject(new Error(`El archivo es demasiado pesado (${sizeMb} MB). El tamaño máximo permitido es de ${FILE_LIMITS.MAX_FILE_SIZE_MB} MB para evitar que el navegador se congele al procesarla.`));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo decodificar la imagen'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
}
