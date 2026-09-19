import { jsPDF } from 'jspdf';
import assert from 'node:assert/strict';

console.log('--- Iniciando verificación de especificaciones de CardPDF ---');

// 1. Constantes geométricas (Norma ISO/IEC 7810 ID-1 / CR80)
const WIDTH_MM = 85.60;
const HEIGHT_MM = 53.98;
const ASPECT_RATIO = WIDTH_MM / HEIGHT_MM; // ~1.586
const CORNER_RADIUS_MM = 3.18;
const A4_WIDTH_MM = 210.0;
const A4_HEIGHT_MM = 297.0;

// 2. Centrado y posición
const POS_X_MM = (A4_WIDTH_MM - WIDTH_MM) / 2;
const FRONT_POS_Y_MM = 35.0;
const BACK_POS_Y_MM = 115.0;
const SPACING_MM = BACK_POS_Y_MM - (FRONT_POS_Y_MM + HEIGHT_MM);

console.log(`• Ancho: ${WIDTH_MM} mm`);
console.log(`• Alto: ${HEIGHT_MM} mm`);
console.log(`• Proporción: ${ASPECT_RATIO.toFixed(3)} (1.586)`);
console.log(`• Radio: ${CORNER_RADIUS_MM} mm`);
console.log(`• Centrado X calculado: ${POS_X_MM.toFixed(2)} mm`);
console.log(`• Frente Y (Elevado): ${FRONT_POS_Y_MM} mm`);
console.log(`• Dorso Y: ${BACK_POS_Y_MM} mm`);
console.log(`• Separación: ${SPACING_MM.toFixed(2)} mm`);

assert.equal(POS_X_MM, 62.20, 'El centrado X debe ser exactamente 62.20 mm');
assert.equal(FRONT_POS_Y_MM, 35.00, 'Frente Y debe ser 35.00 mm');
assert.equal(BACK_POS_Y_MM, 115.00, 'Dorso Y debe ser 115.00 mm');
assert.ok(Math.abs(ASPECT_RATIO - 1.586) < 0.001, 'La proporción debe ser 1.586');
assert.ok(SPACING_MM >= 25 && SPACING_MM <= 32, 'La separación debe estar entre 25 y 32 mm');

// 3. Verificación de cálculo a 300 DPI
const TARGET_DPI = 300;
const MM_TO_PX = TARGET_DPI / 25.4;
const CANVAS_WIDTH_PX = Math.round(WIDTH_MM * MM_TO_PX);
const CANVAS_HEIGHT_PX = Math.round(HEIGHT_MM * MM_TO_PX);
const CANVAS_RADIUS_PX = CORNER_RADIUS_MM * MM_TO_PX;

console.log(`• Resolución a 300 DPI: ${CANVAS_WIDTH_PX} × ${CANVAS_HEIGHT_PX} px (Radio: ${CANVAS_RADIUS_PX.toFixed(1)} px)`);
assert.equal(CANVAS_WIDTH_PX, 1011, 'Ancho canvas a 300 DPI debe ser 1011 px');
assert.equal(CANVAS_HEIGHT_PX, 638, 'Alto canvas a 300 DPI debe ser 638 px');

// 4. Test de creación de PDF con jsPDF
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

doc.setProperties({
  title: 'Test Fotocopia Documento ID-1',
  creator: 'CardPDF'
});

// En CardPDF las fotografías se posicionan limpias sin marcos ni líneas de borde
const testJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
doc.addImage(testJpeg, 'JPEG', POS_X_MM, FRONT_POS_Y_MM, WIDTH_MM, HEIGHT_MM, undefined, 'FAST');
doc.addImage(testJpeg, 'JPEG', POS_X_MM, BACK_POS_Y_MM, WIDTH_MM, HEIGHT_MM, undefined, 'FAST');

const pdfBytes = doc.output('arraybuffer');
assert.ok(pdfBytes.byteLength > 1000, 'El PDF generado debe tener contenido válido');
console.log(`• PDF generado exitosamente en memoria (${pdfBytes.byteLength} bytes)`);

console.log('✅ ¡Todas las verificaciones matemáticas y de PDF pasaron correctamente!');
