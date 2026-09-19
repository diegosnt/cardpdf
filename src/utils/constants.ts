/**
 * Especificaciones Técnicas y Medidas Físicas
 * Estándar Internacional ISO/IEC 7810 ID-1 (CR80)
 * Proporción exacta: 1.586 (85.60 mm × 53.98 mm)
 * 
 * Compatible con cualquier documento o credencial bajo esta norma:
 * - Documentos de identidad (DNI, Cédula de Identidad)
 * - Licencias de conducir (Carnet de conducir)
 * - Cédulas vehiculares (Cédula verde, Cédula azul)
 * - Credenciales corporativas, laborales y estudiantiles
 * - Carnets de salud, prepagas y obras sociales
 * - Tarjetas de transporte público (SUBE, Metro) y membresías
 */
export const CARD_CONFIG = {
  // Dimensiones físicas exactas en milímetros (ISO/IEC 7810 ID-1 / CR80)
  WIDTH_MM: 85.60,
  HEIGHT_MM: 53.98,
  ASPECT_RATIO: 85.60 / 53.98, // ≈ 1.58577 (~1.586)
  CORNER_RADIUS_MM: 3.18,
  
  // Hoja de salida A4 en milímetros (vertical)
  A4_WIDTH_MM: 210.0,
  A4_HEIGHT_MM: 297.0,

  // Disposición matemática en A4
  // Centrado horizontal: (210 - 85.60) / 2 = 62.20 mm
  POS_X_MM: 62.20,
  // Frente elevado en la parte superior (no centrado verticalmente)
  FRONT_POS_Y_MM: 35.0,
  // Dorso ubicado verticalmente debajo con separación de 26.02 mm
  BACK_POS_Y_MM: 115.0,

  // Grosor de borde de fotocopia (0.5 puntos en mm: 0.5 * 0.352778 ≈ 0.176 mm)
  BORDER_STROKE_PT: 0.5,
  BORDER_COLOR_HEX: '#cccccc',

  // Resolución de renderizado en Canvas (300 DPI para impresión nítida 100%)
  TARGET_DPI: 300,
  get MM_TO_PX() {
    return this.TARGET_DPI / 25.4;
  },
  get CANVAS_WIDTH_PX() {
    return Math.round(this.WIDTH_MM * this.MM_TO_PX); // ~1011 px
  },
  get CANVAS_HEIGHT_PX() {
    return Math.round(this.HEIGHT_MM * this.MM_TO_PX); // ~638 px
  },
  get CANVAS_RADIUS_PX() {
    return this.CORNER_RADIUS_MM * this.MM_TO_PX; // ~37.5 px
  }
} as const;

// Alias retrocompatible
export const DNI_CONFIG = CARD_CONFIG;

export type ColorMode = 'original' | 'grayscale' | 'photocopy';
