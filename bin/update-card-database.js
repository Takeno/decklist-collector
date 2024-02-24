const {writeFileSync} = require('fs');

async function downloadCards() {
  const response = await fetch('https://mtgjson.com/api/v5/AtomicCards.json');

  if (response.ok === false) {
    throw new Error(response.statusText);
  }

  return response.json();
}

function generateDataset(cards) {
  const newData = {};

  for (let card in cards) {
    if (cards[card][0].subtypes[0] === 'Attraction') {
      newData[card.toLowerCase()] = 'Attraction';
    } else {
      newData[card.toLowerCase()] = cards[card][0].types;
    }
  }

  return newData;
}

(async function () {
  const {data: cards} = await downloadCards();

  const dataset = generateDataset(cards);

  writeFileSync(
    __dirname + '/../src/utils/all-cards.json',
    JSON.stringify(dataset)
  );
})();
