const fs = require('fs');
const path = require('path');

const es = JSON.parse(fs.readFileSync('data-original-es.json', 'utf8'));

function extraeTraducciones(items) {
  const out = {};
  for (const item of items) {
    if (!item.id) continue;
    out[item.id] = {};
    if (item.name) out[item.id].name = item.name;
    if (item.attributes && Array.isArray(item.attributes)) {
      // Extrae descripción si existe
      const desc = item.attributes.find(a => a.type === 'description');
      if (desc && desc.value) out[item.id].description = desc.value;
      // Extrae otros atributos traducibles
      out[item.id].attributes = item.attributes
        .filter(a => a.type && a.type !== 'description')
        .map(a => ({
          type: a.type || null,
          value: a.value || null
        }));
    }
    // Se puede agregar aquí otros campos traducibles si los hay
    if (item.character) out[item.id].character = item.character;
  }
  return out;
}

function extraeDeTabs(obj) {
  let result = {};
  for (const category of Object.values(obj.tabs)) {
    for (const level of Object.values(category)) {
      Object.assign(result, extraeTraducciones(level));
    }
  }
  return result;
}

// Agregar lógica si powers tiene otra estructura

const traducciones = extraeDeTabs(es);

const outputPath = path.join(__dirname, 'locales/es.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(traducciones, null, 2), 'utf8');
console.log('Archivo locales/es.json generado.');