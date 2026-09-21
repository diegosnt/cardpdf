import { jsPDF } from 'jspdf';
import { CARD_CONFIG, type ColorMode, type LayoutMode, type HorizontalRowCount } from './constants';
import { renderCardToCanvas, type CardState } from './imageProcessor';

export interface GeneratePdfOptions {
  frontCard: CardState;
  backCard: CardState;
  colorMode: ColorMode;
  duplicateCopies?: boolean;
  layoutMode?: LayoutMode;
  horizontalRows?: HorizontalRowCount;
}

/**
 * Formatea un timestamp para el nombre del archivo: YYYYMMDD_HHmmss
 */
export function formatTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}${MM}${dd}_${hh}${mm}${ss}`;
}

/**
 * Genera el documento PDF A4 con cualquier tarjeta o documento ID-1 (CR80)
 * en tamaño real (100% escala: 85.60 × 53.98 mm) y dispara la descarga directa en el navegador.
 */
export async function generateAndDownloadPdf(options: GeneratePdfOptions): Promise<string> {
  const { frontCard, backCard, colorMode, duplicateCopies, layoutMode = 'vertical', horizontalRows } = options;

  if (!frontCard.imageElement && !backCard.imageElement) {
    throw new Error('Debes cargar al menos una de las caras del documento (Frente o Dorso).');
  }

  // Crear documento A4 portrait con unidades en milímetros
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Metadatos del PDF
  doc.setProperties({
    title: `CardPDF - Documento ID-1 / CR80 - ${formatTimestamp()}`,
    subject: 'Fotocopia en tamaño real 100% (ISO/IEC 7810 ID-1 / CR80: 85.60 mm × 53.98 mm)',
    creator: 'CardPDF',
    author: 'CardPDF Client-Side Generator',
  });

  const w = CARD_CONFIG.WIDTH_MM;
  const h = CARD_CONFIG.HEIGHT_MM;

  if (layoutMode === 'horizontal') {
    // Disposición horizontal (una al lado de la otra)
    const frontX = CARD_CONFIG.HORIZ_FRONT_POS_X_MM;
    const backX = CARD_CONFIG.HORIZ_BACK_POS_X_MM;
    const rowCount = horizontalRows ?? (duplicateCopies ? 2 : 1);

    // Preparar imágenes una sola vez en memoria para máxima eficiencia
    const frontData = frontCard.imageElement
      ? (await renderCardToCanvas(frontCard, colorMode)).toDataURL('image/jpeg', 0.98)
      : null;
    const backData = backCard.imageElement
      ? (await renderCardToCanvas(backCard, colorMode)).toDataURL('image/jpeg', 0.98)
      : null;

    for (let r = 0; r < rowCount; r++) {
      const y = CARD_CONFIG.HORIZ_ROW_POS_Y_MM[r];
      if (frontData) {
        doc.addImage(frontData, 'JPEG', frontX, y, w, h, undefined, 'FAST');
      }
      if (backData) {
        doc.addImage(backData, 'JPEG', backX, y, w, h, undefined, 'FAST');
      }
    }
  } else {
    // Disposición vertical (apiladas una debajo de la otra)
    const x = CARD_CONFIG.POS_X_MM;
    const frontY = CARD_CONFIG.FRONT_POS_Y_MM;
    const backY = CARD_CONFIG.BACK_POS_Y_MM;

    // Procesar Frente si existe imagen
    if (frontCard.imageElement) {
      const frontCanvas = await renderCardToCanvas(frontCard, colorMode);
      const frontData = frontCanvas.toDataURL('image/jpeg', 0.98);
      doc.addImage(frontData, 'JPEG', x, frontY, w, h, undefined, 'FAST');

      if (duplicateCopies) {
        doc.addImage(frontData, 'JPEG', x, CARD_CONFIG.SET2_FRONT_POS_Y_MM, w, h, undefined, 'FAST');
      }
    }

    // Procesar Dorso si existe imagen
    if (backCard.imageElement) {
      const backCanvas = await renderCardToCanvas(backCard, colorMode);
      const backData = backCanvas.toDataURL('image/jpeg', 0.98);
      doc.addImage(backData, 'JPEG', x, backY, w, h, undefined, 'FAST');

      if (duplicateCopies) {
        doc.addImage(backData, 'JPEG', x, CARD_CONFIG.SET2_BACK_POS_Y_MM, w, h, undefined, 'FAST');
      }
    }
  }

  // Nombre de archivo descriptivo: CardPDF_Documento_[Timestamp].pdf
  const filename = `CardPDF_Documento_${formatTimestamp()}.pdf`;

  // Descarga directa en el navegador
  doc.save(filename);

  return filename;
}
