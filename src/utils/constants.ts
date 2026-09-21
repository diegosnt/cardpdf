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

  // Disposición matemática en A4 (Juego 1)
  // Centrado horizontal: (210 - 85.60) / 2 = 62.20 mm
  POS_X_MM: 62.20,
  // Frente ubicado en la zona superior de la primera mitad
  FRONT_POS_Y_MM: 20.0,
  // Dorso ubicado debajo con separación de 12.02 mm
  BACK_POS_Y_MM: 86.0,

  // Disposición matemática en A4 (Juego 2 - Copia idéntica en mitad inferior)
  // Separación entre juegos: 17.04 mm (centrada sobre el eje medio de 148.5 mm)
  SET2_FRONT_POS_Y_MM: 157.02,
  SET2_BACK_POS_Y_MM: 223.02,

  // Disposición matemática en A4 (Horizontal: Una al lado de la otra)
  // Márgenes laterales: 16.00 mm | Separación horizontal: 6.80 mm
  // Eje central: (101.60 + 108.40) / 2 = 105.00 mm (centro exacto de A4)
  HORIZ_FRONT_POS_X_MM: 16.00,
  HORIZ_BACK_POS_X_MM: 108.40,
  HORIZ_SPACING_MM: 6.80,

  // Filas en horizontal (hasta 4 filas por hoja A4)
  // Márgenes superior e inferior: 16.00 mm | Separación uniforme entre filas: 16.36 mm
  // Eje medio A4 (148.50 mm) centrado exactamente entre fila 2 y fila 3
  HORIZ_ROW_POS_Y_MM: [16.00, 86.34, 156.68, 227.02] as const,
  HORIZ_POS_Y_MM: 16.00, // Fila 1
  HORIZ_SET2_POS_Y_MM: 86.34, // Fila 2
  HORIZ_ROW_SPACING_MM: 16.36,

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

export type ColorMode = 'original' | 'grayscale' | 'photocopy';
export type LayoutMode = 'vertical' | 'horizontal';
export type HorizontalRowCount = 1 | 2 | 3 | 4;

/**
 * Límites de seguridad y formatos permitidos para la carga de imágenes
 */
export const FILE_LIMITS = {
  MAX_FILE_SIZE_MB: 20,
  get MAX_FILE_SIZE_BYTES() {
    return this.MAX_FILE_SIZE_MB * 1024 * 1024;
  },
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'],
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
} as const;
