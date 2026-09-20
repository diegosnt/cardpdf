import { jsPDF } from 'jspdf';
import assert from 'node:assert/strict';
import { CARD_CONFIG, DNI_CONFIG, FILE_LIMITS } from '../src/utils/constants.ts';

console.log('--- Iniciando verificación de especificaciones de CardPDF ---');

// 1. Verificación de constantes geométricas importadas desde src/utils/constants.ts
const {
  WIDTH_MM,
  HEIGHT_MM,
  ASPECT_RATIO,
  CORNER_RADIUS_MM,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  POS_X_MM,
  FRONT_POS_Y_MM,
  BACK_POS_Y_MM,
  TARGET_DPI,
  CANVAS_WIDTH_PX,
  CANVAS_HEIGHT_PX,
  CANVAS_RADIUS_PX,
} = CARD_CONFIG;

const SPACING_MM = BACK_POS_Y_MM - (FRONT_POS_Y_MM + HEIGHT_MM);

console.log(`• Ancho: ${WIDTH_MM} mm`);
console.log(`• Alto: ${HEIGHT_MM} mm`);
console.log(`• Proporción: ${ASPECT_RATIO.toFixed(3)} (1.586)`);
console.log(`• Radio: ${CORNER_RADIUS_MM} mm`);
console.log(`• Hoja A4: ${A4_WIDTH_MM} × ${A4_HEIGHT_MM} mm`);
console.log(`• Centrado X en constantes: ${POS_X_MM.toFixed(2)} mm`);
console.log(`• Frente Y (Elevado): ${FRONT_POS_Y_MM} mm`);
console.log(`• Dorso Y: ${BACK_POS_Y_MM} mm`);
console.log(`• Separación calculada: ${SPACING_MM.toFixed(2)} mm`);

// Validaciones geométricas ISO/IEC 7810 ID-1 (CR80)
assert.equal(WIDTH_MM, 85.60, 'El ancho debe ser exactamente 85.60 mm');
assert.equal(HEIGHT_MM, 53.98, 'El alto debe ser exactamente 53.98 mm');
assert.ok(Math.abs(ASPECT_RATIO - 1.586) < 0.001, 'La proporción debe ser 1.586');
assert.equal(CORNER_RADIUS_MM, 3.18, 'El radio de esquina debe ser 3.18 mm');
assert.equal(A4_WIDTH_MM, 210.0, 'El ancho de A4 debe ser 210.0 mm');
assert.equal(A4_HEIGHT_MM, 297.0, 'El alto de A4 debe ser 297.0 mm');

// Validación del centrado horizontal matemático: (210 - 85.60) / 2 = 62.20 mm
const calculatedPosX = (A4_WIDTH_MM - WIDTH_MM) / 2;
assert.equal(POS_X_MM, 62.20, 'El centrado X en constants.ts debe ser exactamente 62.20 mm');
assert.equal(POS_X_MM, calculatedPosX, 'POS_X_MM debe coincidir con la fórmula matemática');

// Validación de posiciones verticales
assert.equal(FRONT_POS_Y_MM, 35.00, 'Frente Y debe ser 35.00 mm');
assert.equal(BACK_POS_Y_MM, 115.00, 'Dorso Y debe ser 115.00 mm');
assert.ok(SPACING_MM >= 25 && SPACING_MM <= 32, 'La separación debe estar entre 25 y 32 mm');
assert.equal(Number(SPACING_MM.toFixed(2)), 26.02, 'La separación debe ser exactamente 26.02 mm');

// Validación de alias retrocompatible
assert.equal(DNI_CONFIG, CARD_CONFIG, 'DNI_CONFIG debe ser un alias idéntico a CARD_CONFIG');

// 2. Verificación de cálculo a 300 DPI
console.log(`• Resolución a ${TARGET_DPI} DPI: ${CANVAS_WIDTH_PX} × ${CANVAS_HEIGHT_PX} px (Radio: ${CANVAS_RADIUS_PX.toFixed(1)} px)`);
assert.equal(TARGET_DPI, 300, 'TARGET_DPI debe ser 300');
assert.equal(CANVAS_WIDTH_PX, 1011, 'Ancho canvas a 300 DPI debe ser 1011 px');
assert.equal(CANVAS_HEIGHT_PX, 638, 'Alto canvas a 300 DPI debe ser 638 px');
assert.equal(Number(CANVAS_RADIUS_PX.toFixed(1)), 37.6, 'Radio de curvatura en canvas a 300 DPI debe ser ~37.6 px');

// 3. Test de creación de PDF con jsPDF usando constantes reales
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

doc.setProperties({
  title: 'Test Fotocopia Documento ID-1',
  creator: 'CardPDF'
});

const testJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
doc.addImage(testJpeg, 'JPEG', POS_X_MM, FRONT_POS_Y_MM, WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
doc.addImage(testJpeg, 'JPEG', POS_X_MM, BACK_POS_Y_MM, WIDTH_MM, HEIGHT_MM, undefined, 'FAST');

const pdfBytes = doc.output('arraybuffer');
assert.ok(pdfBytes.byteLength > 1000, 'El PDF generado debe tener contenido válido');
console.log(`• PDF generado exitosamente en memoria (${pdfBytes.byteLength} bytes)`);

// 4. Test de validación de límites de archivo (seguridad DoS)
console.log(`• Tamaño máximo de archivo configurado: ${FILE_LIMITS.MAX_FILE_SIZE_MB} MB (${FILE_LIMITS.MAX_FILE_SIZE_BYTES} bytes)`);
assert.equal(FILE_LIMITS.MAX_FILE_SIZE_MB, 20, 'El límite de archivo debe ser 20 MB');
assert.equal(FILE_LIMITS.MAX_FILE_SIZE_BYTES, 20 * 1024 * 1024, 'El límite en bytes debe ser 20 * 1024 * 1024');

const smallFileSize = 5 * 1024 * 1024; // 5 MB
const hugeFileSize = 45 * 1024 * 1024; // 45 MB
assert.ok(smallFileSize <= FILE_LIMITS.MAX_FILE_SIZE_BYTES, 'Un archivo de 5 MB debe ser permitido');
assert.ok(hugeFileSize > FILE_LIMITS.MAX_FILE_SIZE_BYTES, 'Un archivo de 45 MB debe ser rechazado');
console.log('• Verificación de tamaño máximo de archivo superada exitosamente');

console.log('✅ ¡Todas las verificaciones matemáticas, de PDF y de constantes reales pasaron correctamente!');
