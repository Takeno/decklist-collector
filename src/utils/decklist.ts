import availableCards from './all-cards.json';

export type CardType =
  | 'Land'
  | 'Instant'
  | 'Sorcery'
  | 'Artifact'
  | 'Enchantment'
  | 'Creature'
  | 'Planeswalker'
  | 'Attraction'
  | 'Other'
  | 'Sideboard';

type DecklistCard = {
  amount: number;
  name: string;
  type: CardType;
  validated: boolean;
};

type DecklistParsed = {
  cards: DecklistCard[];
  maindeck: number;
  sideboard: number;
  unvalidated: number;
};

export function parseList(input: string): DecklistParsed {
  const [maindeck, sideboard] = splitMainSideboard(input);

  let cards: DecklistCard[] = [];

  for (let line of maindeck.split('\n')) {
    const parsedLine = splitCardLine(line);
    if (parsedLine === null) {
      continue;
    }

    const [amount, name] = parsedLine;

    const validated = name.toLowerCase() in availableCards;

    const type = extractType(name);

    cards.push({
      amount: amount,
      name: name,
      type,
      validated,
    });
  }

  if (typeof sideboard === 'string') {
    for (let line of sideboard.split('\n')) {
      const parsedLine = splitCardLine(line);
      if (parsedLine === null) {
        continue;
      }

      const [amount, name] = parsedLine;

      const validated = name.toLowerCase() in availableCards;

      const type = extractType(name);

      cards.push({
        amount: amount,
        name: name,
        type: type === 'Attraction' ? type : 'Sideboard',
        validated,
      });
    }
  }

  return {
    cards,
    maindeck: cards
      .filter((c) => c.type !== 'Sideboard')
      .reduce((a, c) => a + c.amount, 0),
    sideboard: cards
      .filter((c) => c.type === 'Sideboard')
      .reduce((a, c) => a + c.amount, 0),
    unvalidated: cards.filter((c) => c.validated === false).length,
  };
}

export function extractType(card: string): CardType {
  const validated = card.toLowerCase() in availableCards;

  if (validated === false) {
    return 'Other';
  }

  const types =
    availableCards[card.toLowerCase() as keyof typeof availableCards];

  for (let myType of [
    'Land',
    'Artifact',
    'Enchantment',
    'Creature',
    'Planeswalker',
    'Instant',
    'Sorcery',
    'Attraction',
  ] as CardType[]) {
    if (types.includes(myType)) {
      return myType;
    }
  }

  return 'Other';
}

const SIDEBOARD_REGEX = /^(?:[^0-9])*side(?:board)*:?/im;

function splitMainSideboard(input: string): [string, string?] {
  if (SIDEBOARD_REGEX.test(input)) {
    const [maindeck, sideboard] = input.trim().split(SIDEBOARD_REGEX);
    return [maindeck, sideboard];
  }

  const [maindeck, sideboard] = input.trim().split('\n\n');
  return [maindeck, sideboard];
}

function splitCardLine(input: string): [number, string] | null {
  const matches = input.trim().match(/^x? *([0-9]+) *x? *([^(]+)/i);
  if (matches === null) {
    return null;
  }

  const [, amount, name] = matches;

  return [parseInt(amount), name.trim()];
}
