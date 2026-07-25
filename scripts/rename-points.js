// Script para convertir nomenclatura de puntos: 1P → P1, 36E → E36, etc.
// Uso: node scripts/rename-points.js

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Mapeo de meridianos
const meridians = ['P', 'IG', 'E', 'BP', 'C', 'ID', 'V', 'R', 'MC', 'TR', 'VB', 'H', 'DM', 'RM'];

// Función para convertir ID de punto
// "1P" → "P1", "36E" → "E36"
function transformPointId(id) {
  for (const meridian of meridians) {
    if (id.startsWith(meridian)) {
      // Ya está en nuevo formato (P1, E36)
      if (/^[A-Z]+\d+$/.test(id)) {
        return id;
      }
      // Formato antiguo: 1P, 36E
      const match = id.match(/^(\d+)(" + meridian + ")$/);
      if (match) {
        return meridian + match[1];
      }
    }
  }
  return id;
}

// Mejor versión: detectar número al inicio
function convertPointId(id) {
  // Si ya tiene el formato nuevo (letras primero), devolvertal cual
  if (/^[A-Z]{2,3}\d+$/.test(id)) {
    return id;
  }
  
  // Buscar si termina con una letra (meridiano)
  for (const meridian of meridians) {
    if (id.endsWith(meridian) && !id.startsWith(meridian)) {
      const num = id.slice(0, -meridian.length);
      if (/^\d+$/.test(num)) {
        return meridian + num;
      }
    }
  }
  
  return id;
}

// Leer archivo
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// Escribir archivo
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Transformar contenido del archivo
function transformContent(content) {
  // Buscar todos los IDs de puntos en el formato antiguo
  // Ejemplos: "1P", "36E", "1IG", etc.
  const oldPattern = /(\d+)((?:P|IG|E|BP|C|ID|V|R|MC|TR|VB|H|DM|RM))\b/g;
  
  return content.replace(oldPattern, (match, num, meridian) => {
    return meridian + num;
  });
}

// Procesar todos los archivos .ts en data
function processAllFiles() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));
  
  console.log('📁 Archivos a procesar:', files.length);
  
  let totalChanges = 0;
  
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const content = readFile(filePath);
    const newContent = transformContent(content);
    
    const changes = (content.match(/\d+[A-Z]{2,3}\b/g) || []).length - 
                   (newContent.match(/\d+[A-Z]{2,3}\b/g) || []).length;
    
    if (content !== newContent) {
      writeFile(filePath, newContent);
      console.log(`  ✅ ${file}: ${Math.abs(changes)} cambios`);
      totalChanges += Math.abs(changes);
    } else {
      console.log(`  ⏭️  ${file}: sin cambios`);
    }
  }
  
  console.log(`\n🎯 Total de cambios: ${totalChanges}`);
}

// Ejecutar
console.log('🚀 Iniciando transformación de nomenclatura de puntos...\n');
console.log('   De: 1P, 36E, 1IG');
console.log('   A: P1, E36, IG1\n');

processAllFiles();

console.log('\n✅ Transformación completada!');
console.log('\n⚠️  IMPORTANTE: Ahora necesitas actualizar las referencias en:');
console.log('   - Fórmulas (formulas.ts)');
console.log('   - Cualquier otro archivo que use pointId');
