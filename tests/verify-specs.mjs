import { jsPDF } from 'jspdf';
import assert from 'node:assert/strict';
import { CARD_CONFIG, DNI_CONFIG, FILE_LIMITS } from '../src/utils/constants.ts';
import { calculateMaxPanOffsets, clampCardOffsets } from '../src/utils/imageProcessor.ts';

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

// Validación de posiciones verticales (primer juego en la mitad superior de la hoja)
assert.equal(FRONT_POS_Y_MM, 20.00, 'Frente Y debe ser 20.00 mm');
assert.equal(BACK_POS_Y_MM, 86.00, 'Dorso Y debe ser 86.00 mm');
assert.equal(Number(SPACING_MM.toFixed(2)), 12.02, 'La separación entre fotos debe ser exactamente 12.02 mm');

// Validación de capacidad y separación para un segundo juego en A4
const firstSetEnd = BACK_POS_Y_MM + HEIGHT_MM; // 86 + 53.98 = 139.98 mm
assert.ok(firstSetEnd < A4_HEIGHT_MM / 2, 'El primer juego debe terminar antes de la mitad de la hoja A4 (148.5 mm)');

const interSetSpacing = (A4_HEIGHT_MM / 2 - firstSetEnd) * 2; // 17.04 mm
assert.ok(interSetSpacing > SPACING_MM, 'La separación entre juegos (17.04 mm) debe ser un poquito mayor que entre fotos (12.02 mm)');
assert.equal(Number(interSetSpacing.toFixed(2)), 17.04, 'La separación entre juegos debe ser exactamente 17.04 mm');
console.log(`• Separación entre fotos: ${SPACING_MM.toFixed(2)} mm | Separación entre juegos: ${interSetSpacing.toFixed(2)} mm`);

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

// Test de generación con 2 juegos (4 tarjetas en la misma hoja A4)
const { SET2_FRONT_POS_Y_MM, SET2_BACK_POS_Y_MM } = CARD_CONFIG;
assert.equal(SET2_FRONT_POS_Y_MM, 157.02, 'Frente 2 debe estar en 157.02 mm');
assert.equal(SET2_BACK_POS_Y_MM, 223.02, 'Dorso 2 debe estar en 223.02 mm');

const set2End = SET2_BACK_POS_Y_MM + HEIGHT_MM; // 223.02 + 53.98 = 277.00 mm
const bottomMargin = A4_HEIGHT_MM - set2End; // 297 - 277 = 20.00 mm
assert.equal(Number(bottomMargin.toFixed(2)), 20.00, 'El margen inferior del segundo juego debe ser exactamente 20.00 mm');

const doc2 = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
doc2.addImage(testJpeg, 'JPEG', POS_X_MM, FRONT_POS_Y_MM, WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
doc2.addImage(testJpeg, 'JPEG', POS_X_MM, BACK_POS_Y_MM, WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
doc2.addImage(testJpeg, 'JPEG', POS_X_MM, SET2_FRONT_POS_Y_MM, WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
doc2.addImage(testJpeg, 'JPEG', POS_X_MM, SET2_BACK_POS_Y_MM, WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
const pdfBytes2 = doc2.output('arraybuffer');
assert.ok(pdfBytes2.byteLength > pdfBytes.byteLength, 'El PDF con 2 copias debe contener 4 imágenes');
console.log(`• PDF con 2 juegos duplicados (4 tarjetas) generado exitosamente (${pdfBytes2.byteLength} bytes)`);

// Test de disposición horizontal (una al lado de la otra y filas 1 a 4)
const { 
  HORIZ_FRONT_POS_X_MM, 
  HORIZ_BACK_POS_X_MM, 
  HORIZ_POS_Y_MM, 
  HORIZ_SET2_POS_Y_MM, 
  HORIZ_SPACING_MM,
  HORIZ_ROW_POS_Y_MM,
  HORIZ_ROW_SPACING_MM
} = CARD_CONFIG;

assert.equal(HORIZ_FRONT_POS_X_MM, 16.00, 'Frente X horizontal debe ser 16.00 mm');
assert.equal(HORIZ_BACK_POS_X_MM, 108.40, 'Dorso X horizontal debe ser 108.40 mm');
assert.equal(HORIZ_SPACING_MM, 6.80, 'Separación horizontal debe ser 6.80 mm');
assert.equal(HORIZ_POS_Y_MM, 16.00, 'Fila 1 Y horizontal debe ser 16.00 mm');
assert.equal(HORIZ_SET2_POS_Y_MM, 86.34, 'Fila 2 Y horizontal debe ser 86.34 mm');

// Validar las 4 filas horizontales en la hoja A4
assert.equal(HORIZ_ROW_POS_Y_MM.length, 4, 'Deben existir 4 posiciones de fila configuradas');
assert.deepEqual([...HORIZ_ROW_POS_Y_MM], [16.00, 86.34, 156.68, 227.02], 'Las posiciones Y de las 4 filas deben ser [16.00, 86.34, 156.68, 227.02]');
assert.equal(HORIZ_ROW_SPACING_MM, 16.36, 'La separación vertical entre filas debe ser 16.36 mm');

// Validar simetría vertical de las 4 filas
const topMargin = HORIZ_ROW_POS_Y_MM[0];
const bottomMarginHoriz = A4_HEIGHT_MM - (HORIZ_ROW_POS_Y_MM[3] + HEIGHT_MM);
assert.equal(Number(topMargin.toFixed(2)), 16.00, 'El margen superior debe ser 16.00 mm');
assert.equal(Number(bottomMarginHoriz.toFixed(2)), 16.00, 'El margen inferior en 4 filas debe ser exactamente 16.00 mm');

// Validar simetría sobre el eje medio de A4 (148.5 mm) entre fila 2 y fila 3
const row2End = HORIZ_ROW_POS_Y_MM[1] + HEIGHT_MM;
const row3Start = HORIZ_ROW_POS_Y_MM[2];
const midAxisHoriz = (row2End + row3Start) / 2;
assert.equal(Number(midAxisHoriz.toFixed(2)), 148.50, 'El centro entre fila 2 y 3 debe ser exactamente el centro de A4 (148.50 mm)');

// Validar simetría horizontal en A4 (210 mm)
const horizLeftMargin = HORIZ_FRONT_POS_X_MM;
const horizRightMargin = A4_WIDTH_MM - (HORIZ_BACK_POS_X_MM + WIDTH_MM);
assert.equal(Number(horizLeftMargin.toFixed(2)), Number(horizRightMargin.toFixed(2)), 'Los márgenes izquierdo y derecho deben ser simétricos (16.00 mm)');
const horizCenterAxis = (HORIZ_FRONT_POS_X_MM + WIDTH_MM + HORIZ_BACK_POS_X_MM) / 2;
assert.equal(Number(horizCenterAxis.toFixed(2)), A4_WIDTH_MM / 2, 'El eje central entre tarjetas horizontales debe coincidir con el centro de A4 (105.00 mm)');

// Generar PDF horizontal de 1 fila
const docHoriz1 = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
docHoriz1.addImage(testJpeg, 'JPEG', HORIZ_FRONT_POS_X_MM, HORIZ_ROW_POS_Y_MM[0], WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
docHoriz1.addImage(testJpeg, 'JPEG', HORIZ_BACK_POS_X_MM, HORIZ_ROW_POS_Y_MM[0], WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
const pdfHoriz1Bytes = docHoriz1.output('arraybuffer');
assert.ok(pdfHoriz1Bytes.byteLength > 1000, 'El PDF de 1 fila debe generarse correctamente');

// Generar PDF horizontal completo con 4 filas (8 tarjetas)
const docHoriz4 = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
for (let r = 0; r < 4; r++) {
  docHoriz4.addImage(testJpeg, 'JPEG', HORIZ_FRONT_POS_X_MM, HORIZ_ROW_POS_Y_MM[r], WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
  docHoriz4.addImage(testJpeg, 'JPEG', HORIZ_BACK_POS_X_MM, HORIZ_ROW_POS_Y_MM[r], WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
}
const pdfHoriz4Bytes = docHoriz4.output('arraybuffer');
assert.ok(pdfHoriz4Bytes.byteLength > pdfHoriz1Bytes.byteLength, 'El PDF con 4 filas (8 tarjetas) debe contener más bytes');
console.log(`• PDF en disposición horizontal: 1 fila (${pdfHoriz1Bytes.byteLength} bytes) y 4 filas / 8 tarjetas (${pdfHoriz4Bytes.byteLength} bytes) generados exitosamente`);

// 4. Test de validación de límites de archivo (seguridad DoS)
console.log(`• Tamaño máximo de archivo configurado: ${FILE_LIMITS.MAX_FILE_SIZE_MB} MB (${FILE_LIMITS.MAX_FILE_SIZE_BYTES} bytes)`);
assert.equal(FILE_LIMITS.MAX_FILE_SIZE_MB, 20, 'El límite de archivo debe ser 20 MB');
assert.equal(FILE_LIMITS.MAX_FILE_SIZE_BYTES, 20 * 1024 * 1024, 'El límite en bytes debe ser 20 * 1024 * 1024');

const smallFileSize = 5 * 1024 * 1024; // 5 MB
const hugeFileSize = 45 * 1024 * 1024; // 45 MB
assert.ok(smallFileSize <= FILE_LIMITS.MAX_FILE_SIZE_BYTES, 'Un archivo de 5 MB debe ser permitido');
assert.ok(hugeFileSize > FILE_LIMITS.MAX_FILE_SIZE_BYTES, 'Un archivo de 45 MB debe ser rechazado');
console.log('• Verificación de tamaño máximo de archivo superada exitosamente');

// 5. Test de limitación de rango de paneo (UX Clamping)
const mockImg = { naturalWidth: 1011, naturalHeight: 638 };
const testCard = {
  file: null,
  imageElement: mockImg,
  rotation: 0,
  zoom: 1.0,
  offsetX: 9999,
  offsetY: -9999,
};

const offsetsZoom1 = calculateMaxPanOffsets(testCard);
assert.ok(offsetsZoom1.maxOffsetX > 0, 'maxOffsetX debe ser positivo');
assert.ok(offsetsZoom1.maxOffsetY > 0, 'maxOffsetY debe ser positivo');

// Clamping de desplazamientos extremos a zoom 1.0
clampCardOffsets(testCard);
assert.equal(testCard.offsetX, offsetsZoom1.maxOffsetX, 'offsetX extremo positivo debe limitarse a maxOffsetX');
assert.equal(testCard.offsetY, -offsetsZoom1.maxOffsetY, 'offsetY extremo negativo debe limitarse a -maxOffsetY');
console.log(`• Paneo a Zoom 1.0 delimitado: ±${offsetsZoom1.maxOffsetX.toFixed(1)}px X, ±${offsetsZoom1.maxOffsetY.toFixed(1)}px Y`);

// Ampliación de rango permitida al aumentar el zoom (zoom 2.0)
testCard.zoom = 2.0;
const offsetsZoom2 = calculateMaxPanOffsets(testCard);
assert.ok(offsetsZoom2.maxOffsetX > offsetsZoom1.maxOffsetX, 'A mayor zoom, mayor rango de paneo X para inspeccionar esquinas');
assert.ok(offsetsZoom2.maxOffsetY > offsetsZoom1.maxOffsetY, 'A mayor zoom, mayor rango de paneo Y para inspeccionar esquinas');

// Rotación a 90 grados intercambia dimensiones target
testCard.rotation = 90;
const offsetsRotated = calculateMaxPanOffsets(testCard);
assert.ok(offsetsRotated.maxOffsetX > 0 && offsetsRotated.maxOffsetY > 0, 'Límites calculados válidos tras rotación');

// Caso sin imagen resetea a 0
const emptyCard = { file: null, imageElement: null, rotation: 0, zoom: 1.0, offsetX: 50, offsetY: 50 };
clampCardOffsets(emptyCard);
assert.equal(emptyCard.offsetX, 0, 'Sin imagen, offsetX debe ser 0');
assert.equal(emptyCard.offsetY, 0, 'Sin imagen, offsetY debe ser 0');
console.log('• Verificación de limitación de paneo (UX Clamping) superada exitosamente');

console.log('✅ ¡Todas las verificaciones matemáticas, de PDF y de constantes reales pasaron correctamente!');
