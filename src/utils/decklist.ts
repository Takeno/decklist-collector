import availableCards from './legacy-cards.json';

type CardType = 'Land' | 'Instant' | 'Sorcery' | 'Artifact' | 'Enchantment' | 'Creature' | 'Planeswalker' | 'Other' | 'Sideboard';

type DecklistCard = {
  amount: number;
  name: string;
  type: CardType
  validated: boolean;
}

type DecklistParsed = {
  cards: DecklistCard[];
  maindeck: number;
  sideboard: number;
}


export function parseList(input:string):DecklistParsed {

  const [maindeck, sideboard] = splitMainSideboard(input)

  let cards:DecklistCard[] = [];

  for(let line of maindeck.split('\n')) {
    const parsedLine = splitCardLine(line);
    if(parsedLine === null) {
      continue;
    }

    const [amount, name] = parsedLine;

    const validated = name.toLowerCase() in availableCards;

    let type:CardType = 'Other';

    if(validated) {
      const types = availableCards[name.toLowerCase() as keyof typeof availableCards];

      for(let myType of ['Land' , 'Artifact' , 'Enchantment' , 'Creature' , 'Planeswalker', 'Instant', 'Sorcery'] as CardType[]) {
        if(types.includes(myType)) {
          type = myType;
          break;
        }
      }
    }

    cards.push({
      amount: amount,
      name: name,
      type,
      validated,
    });
  }


  if(typeof sideboard === 'string')
  for(let line of sideboard.split('\n')) {
    const parsedLine = splitCardLine(line);
    if(parsedLine === null) {
      continue;
    }

    const [amount, name] = parsedLine;

    const validated = name.toLowerCase() in availableCards;

    cards.push({
      amount: amount,
      name: name,
      type: 'Sideboard',
      validated,
    });
  }


  return {
    cards,
    maindeck: cards.filter(c => c.type !== 'Sideboard').reduce((a, c) => a + c.amount, 0),
    sideboard: cards.filter(c => c.type === 'Sideboard').reduce((a, c) => a + c.amount, 0),
  }
}


const SIDEBOARD_REGEX = /side(?:board)*:?/i

function splitMainSideboard(input:string): [string, string?] {
  if(SIDEBOARD_REGEX.test(input)) {
    const [maindeck, sideboard] = input.trim().split(SIDEBOARD_REGEX);
    return [maindeck, sideboard];
  }

  const [maindeck, sideboard] = input.trim().split('\n\n');
  return [maindeck, sideboard];
}

function splitCardLine(input:string): [number, string] | null {
  const matches = input.trim().match(/^x? *([0-9]+) *x? *([^(]+)/i);
  if(matches === null) {
    return null;
  }

  const [, amount, name] = matches;

  return [parseInt(amount), name.trim()]
}