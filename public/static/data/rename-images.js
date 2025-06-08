const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('data-original.json'));
const es = JSON.parse(fs.readFileSync('data-original-es.json'));

function normalizeWithAccents(name) {
  return name
    .toLowerCase()
    .replace(/['’"]/g, '') // quita comillas/apóstrofes
    .replace(/[^a-záéíóúüñ0-9]+/gi, '_') // permite tildes y ñ
    .replace(/_+/g, '_') // reemplaza múltiples guiones bajos por uno solo
    .replace(/^_+|_+$/g, ''); // quita guiones bajos al principio y al final
}

    // .replace(/[^a-záéíóúüñ0-9-]+/gi, '_') // permite tildes, ñ y guion
    // .replace(/-+/g, '-') // reemplaza múltiples guiones por uno solo
    // .replace(/^-+|-+$/g, ''); // quita guiones al principio y al final


function getAllItems(obj) {
  const items = [];
  for (const category of Object.values(obj.tabs)) {
    for (const level of Object.values(category)) {
      for (const item of level) {
        if (item.id && item.name) items.push(item);
      }
    }
  }
  return items;
}

function getAllPowers(obj) {
  const powers = [];
  // Intenta en obj.powers
  let powersObj = obj.powers;
  // Si no existe, intenta en obj.tabs.powers
  if (!powersObj && obj.tabs && obj.tabs.powers) {
    powersObj = obj.tabs.powers;
  }
  if (!powersObj) return powers;
  for (const hero of Object.values(powersObj)) {
    for (const power of hero) {
      if (power.id && power.name) powers.push(power);
    }
  }
  return powers;
}

function renameImages(enArr, esArr, dir) {
  enArr.forEach(enItem => {
    const esItem = esArr.find(e => e.id === enItem.id);
    if (!esItem) return;

    const src = path.join(dir, `${normalizeWithAccents(enItem.name)}.png`);
    const dest = path.join(dir, `${normalizeWithAccents(esItem.name)}.png`);

    if (!fs.existsSync(src)) {
      //console.log(`No existe: ${src}`);
      return;
    }
    if (fs.existsSync(dest)) {
      console.log(`Ya existe destino: ${dest}`);
      return;
    }
    console.log(`Intentando renombrar: ${src} -> ${dest}`);
    try {
      fs.renameSync(src, dest);
      console.log(`Renombrado: ${src} -> ${dest}`);
    } catch (err) {
      console.error(`Error al renombrar ${src} -> ${dest}:`, err.message);
    }
  });
}

renameImages(getAllItems(en), getAllItems(es), path.join(__dirname, '../items/'));
renameImages(getAllPowers(en), getAllPowers(es), path.join(__dirname, '../powers/'));