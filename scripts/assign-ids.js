/* eslint-disable */
const fs = require('fs');
const armoryData = require('../public/static/data/data-original-es.json');
const heroData = require('../public/static/data/heroes-original-es.json');
//const esLocales = require('../public/static/data/locales/es.json'); // Asegúrate de la ruta

// function applyTranslations(item, translations) {
//   if (!translations) return;
//   if (translations.name) item.name = translations.name;
//   if (translations.description) {
//     // Busca el atributo de descripción y reemplázalo
//     if (item.attributes) {
//       const descAttr = item.attributes.find(a => a.type === 'description');
//       if (descAttr) descAttr.value = translations.description;
//     }
//   }
// }

//function assignIdsAndLocales(data, locales) {
function assignIds(data) {
  const counters = {};
  let powerCounter = 0;
  const result = JSON.parse(JSON.stringify(data));

  for (const [tabName, tabContent] of Object.entries(result.tabs)) {
    if (tabName === 'poderes') continue;

    for (const [rarity, items] of Object.entries(tabContent)) {
      if (Array.isArray(items)) {
        const counterKey = `${tabName}${rarity}`;
        if (!counters[counterKey]) {
          counters[counterKey] = 0;
        }

        items.forEach((item) => {
          const tabPrefix = tabName.charAt(0).toLowerCase();
          const rarityPrefix = rarity.charAt(0).toLowerCase();
          item.id = `i${tabPrefix}${rarityPrefix}${counters[counterKey]}`;
          // // Aplica traducción si existe
          // if (locales.items && locales.items[item.id]) {
          //   applyTranslations(item, locales.items[item.id]);
          // }
          counters[counterKey]++;
        });
      }
    }
  }

  if (result.tabs.powers) {
    for (const [character, powers] of Object.entries(result.tabs.powers)) {
      if (Array.isArray(powers)) {
        powers.forEach((power) => {
          power.id = `p${powerCounter}`;
          // if (locales.powers && locales.powers[power.id]) {
          //   applyTranslations(power, locales.powers[power.id]);
          // }
          powerCounter++;
        });
      }
    }
  }

  return result;
}

function assignHeroIds(data) {
  const counters = {};
  let heroCounter = 0;
  const result = JSON.parse(JSON.stringify(data));
  for (const [hero, heroData] of Object.entries(result.heroes)) {
    heroData.id = heroCounter;
    heroCounter++;
  }
  return result;
}

//fs.writeFileSync('public/static/data/data.json', JSON.stringify(assignIdsAndLocales(armoryData, esLocales)));
fs.writeFileSync('public/static/data/data.json', JSON.stringify(assignIds(armoryData)));
console.log('Armory Data has been saved to data.json');

fs.writeFileSync('public/static/data/heroes.json', JSON.stringify(assignHeroIds(heroData)));
console.log('Hero data has been saved to heroes.json');
