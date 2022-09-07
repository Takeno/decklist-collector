import { parseList } from "./decklist"

describe('Decklist parser', () => {

  it('should return empty cards if nothing is provided', () => {
    const parsed = parseList('');
    expect(parsed.cards).toHaveLength(0);
  });

  it('should return correct decklist #1', () => {
    const parsed = parseList(
`3x Lightning Bolt
3 Rift Bolt
x4 Goblin Guide

 4X Deflecting Palm`
    );


    expect(parsed.cards).toHaveLength(4);

    expect(parsed.cards).toContainEqual({
      amount: 3,
      name: 'Lightning Bolt',
      type: 'Instant',
      validated: true,
    });

    expect(parsed.cards).toContainEqual({
      amount: 4,
      name: 'Goblin Guide',
      type: 'Creature',
      validated: true,
    });

    expect(parsed.cards).toContainEqual({
      amount: 4,
      name: 'Deflecting Palm',
      type: 'Sideboard',
      validated: true,
    });
  })

  it('should return correct decklist #2', () => {
    const parsed = parseList(`//Main
    3 Arid Mesa
    1 Barbarian Ring
    4 Bloodstained Mire
    4 Chain Lightning
    4 Eidolon of the Great Revel
    4 Fireblast
    4 Goblin Guide
    1 Grim Lavamancer
    4 Lava Spike
    2 Light Up the Stage
    4 Lightning Bolt
    4 Monastery Swiftspear
    9 Mountain
    4 Price of Progress
    4 Rift Bolt
    1 Roiling Vortex
    1 Scalding Tarn
    2 Skewer the Critics

    //Sideboard
    2 Cemetery Gatekeeper
    2 Pyroblast
    2 Pyrostatic Pillar
    1 Roiling Vortex
    2 Searing Blood
    2 Shattering Spree
    1 Smash to Smithereens
    3 Surgical Extraction`);


    expect(parsed.cards).toHaveLength(26);

    expect(parsed.cards).toContainEqual({
      amount: 2,
      name: 'Pyroblast',
      type: 'Sideboard',
      validated: true,
    });

    expect(parsed.cards).toContainEqual({
      amount: 1,
      name: 'Scalding Tarn',
      type: 'Land',
      validated: true,
    });
  })

  it('should return correct decklist ARENA style #3', () => {
    const parsed = parseList(`1 Aether Spellbomb (JMP) 456
    4 Darksteel Citadel (C21) 285
    1 Dispatch (NEC) 83
    4 Esper Sentinel (MH2) 12
    2 Flooded Strand (KTK) 233
    3 Hallowed Fountain (RTR) 241
    4 Ingenious Smith (AFR) 21
    3 Memnite (SOM) 174
    3 Metallic Rebuke (2XM) 59
    1 Nettlecyst (MH2) 231
    1 Otawara, Soaring City (NEO) 271
    1 Plains (SNC) 262
    4 Portable Hole (AFR) 33
    4 Razortide Bridge (MH2) 252
    1 Relic of Progenitus (ALA) 218
    3 Seachrome Coast (SOM) 229
    1 Shadowspear (THB) 236
    3 Springleaf Drum (2XM) 291
    2 Teferi, Time Raveler (WAR) 221
    4 Thought Monitor (MH2) 71
    3 Thoughtcast (NEC) 99
    4 Urza's Saga (MH2) 259
    3 Urza, Lord High Artificer (MH1) 75

    // SIDEBOARD
    1 Chalice of the Void (A25) 222
    1 Damping Sphere (DOM) 213
    2 Dispatch (NEC) 83
    1 Grafdigger's Cage (M20) 227
    1 Hurkyl's Recall (MM2) 48
    2 March of Otherworldly Light (NEO) 28
    2 Meddling Mage (PLS) 116
    1 Pithing Needle (MID) 257
    1 Soul-Guide Lantern (THB) 237
    2 Spell Pierce (NEO) 80
    1 Void Mirror (MH2) 242`);


    expect(parsed.cards).toHaveLength(34);

    expect(parsed.cards).toContainEqual({
      amount: 4,
      name: 'Darksteel Citadel',
      type: 'Land',
      validated: true,
    });

    expect(parsed.cards).toContainEqual({
      amount: 1,
      name: 'Relic of Progenitus',
      type: 'Artifact',
      validated: true,
    });

    expect(parsed.cards).toContainEqual({
      amount: 1,
      name: 'Pithing Needle',
      type: 'Sideboard',
      validated: true,
    });
  })

  it('should return correct decklist NOT ENGLISH #4', () => {
    const parsed = parseList(`4x Miniera di diamanti
    3x Darkslick Shores
    4x Patto di Negazione
    4x Gioco di prestigio
    4x Costa del mar di Cromo
    Sideboard
    1x Patto del massacro
    4x Prismatic Ending
    4x Leyline of Sanctity
    2x Rubapensieri
    1x Verità riecheggiante
    3x Veil of summer`);


    expect(parsed.cards).toHaveLength(11);

    expect(parsed.cards).toContainEqual({
      amount: 3,
      name: 'Darkslick Shores',
      type: 'Land',
      validated: true,
    });

    expect(parsed.cards).toContainEqual({
      amount: 4,
      name: 'Miniera di diamanti',
      type: 'Other',
      validated: false,
    });

    expect(parsed.cards).toContainEqual({
      amount: 1,
      name: 'Patto del massacro',
      type: 'Sideboard',
      validated: false,
    });

    expect(parsed.cards).toContainEqual({
      amount: 3,
      name: 'Veil of summer',
      type: 'Sideboard',
      validated: true,
    });
  })

  it('should return correct decklist SOME NUMBERS #5', () => {
    const parsed = parseList(`Old School Swedish Deck:

    Creatures [9]
    1 Serendib Djinn
    4 Serendib Efreet
    4 Flying Men

    Instants [11]
    1 Ancestral Recall
    1 Shatter
    4 Lightning Bolt
    1 Mana Drain
    4 Psionic Blast

    Sorceries [13]
    3 Recall
    1 Demonic Tutor
    1 Fireball
    1 Mind Twist
    1 Time Walk
    1 Timetwister
    1 Wheel of Fortune
    4 Chain Lightning

    Artifacts [7]
    1 Black Lotus
    1 Chaos Orb
    1 Mox Jet
    1 Mox Ruby
    1 Mox Sapphire
    1 Sol Ring
    1 Black Vise

    Lands [20]
    5 Island
    1 Tolaria
    4 Volcanic Island
    2 Badlands
    2 City of Brass
    1 Library of Alexandria
    1 Strip Mine
    4 Mishra's Factory

    Sideboard [15]
    4 Blood Moon
    3 Shatter
    2 Hurkyl's Recall
    3 Black Vise
    2 Red Elemental Blast
    1 Blue Elemental Blast
`);


    expect(parsed.maindeck).toEqual(60);
    expect(parsed.sideboard).toEqual(15);
  })

  it('should return correct decklist Ragavan #6', () => {
    const parsed = parseList(`2 Archmage's Charm
    4 Ragavan, Nimble Pilferer
    4 Consider
    4 Counterspell`);


    expect(parsed.maindeck).toEqual(14);
    expect(parsed.sideboard).toEqual(0);


    expect(parsed.cards).toContainEqual({
      amount: 4,
      name: 'Ragavan, Nimble Pilferer',
      type: 'Creature',
      validated: true,
    });

  })
})

describe('Split Maindeck and Sideboard', () => {
  it('#1 with double break', () => {
    const decklist = parseList(`3 Arid Mesa
    1 Barbarian Ring
    4 Bloodstained Mire

    2 Cemetery Gatekeeper
    2 Pyroblast`);

    expect(decklist.cards.filter(c => c.type === 'Sideboard')).toHaveLength(2)
  })

  it('#2 with SIDEBOARD text', () => {
    const decklist = parseList(`3 Arid Mesa
    1 Barbarian Ring
    4 Bloodstained Mire
    SIDEBOARD:
    2 Cemetery Gatekeeper
    2 Pyroblast`);

    expect(decklist.cards.filter(c => c.type === 'Sideboard')).toHaveLength(2)
  })

  it('#3 without SIDEBOARD', () => {
    const decklist = parseList(`3 Arid Mesa
    1 Barbarian Ring
    4 Bloodstained Mire`);

    expect(decklist.cards.filter(c => c.type === 'Sideboard')).toHaveLength(0)
  })


  it('#4 with SIDEBOARD text from real list', () => {
    const decklist = parseList(`18 LANDS
    2 Flooded Strand
    1 Island
    2 Misty Rainforest
    1 Mystic Sanctuary
    2 Polluted Delta
    2 Scalding Tarn
    1 Steam Vents
    4 Volcanic Island
    3 Wasteland
    12 CREATURES
    1 Brazen Borrower
    4 Dragon's Rage Channeler
    3 Ledger Shredder
    4 Murktide Regent
    26 INSTANTS and SORC.
    4 Brainstorm
    2 Daze
    4 Expressive Iteration
    4 Force of Will
    4 Lightning Bolt
    4 Ponder
    2 Predict
    2 Pyroblast
    4 OTHER SPELLS
    4 Mishra's Bauble
    SIDEBOARD
    1 Blue Elemental Blast
    1 End the Festivities
    2 Force of Negation
    1 Hullbreacher
    2 Meltdown
    1 Price of Progress
    3 Red Elemental Blast
    1 Submerge
    2 Surgical Extraction
    1 Unholy Heat`);

    expect(decklist.cards.filter(c => c.type === 'Sideboard')).toHaveLength(10)
  })


  it('#5 with SIDE text', () => {
    const decklist = parseList(`1 Aether Spellbomb
    4 Ancient Tomb
    4 Chalice of the Void
    Side:
    2 Brazen Borrower
    3 Dismember
    1 Faerie Macabre`);

    expect(decklist.cards.filter(c => c.type === 'Sideboard')).toHaveLength(3)
  })

  it('#6 exported Arena style', () => {
    const decklist = parseList(`1 Aether Spellbomb (JMP) 456
    4 Darksteel Citadel (C21) 285
    1 Dispatch (NEC) 83
    4 Esper Sentinel (MH2) 12

    // SIDEBOARD
    1 Chalice of the Void (A25) 222
    1 Damping Sphere (DOM) 213
    2 Dispatch (NEC) 83`);

    expect(decklist.cards.filter(c => c.type === 'Sideboard')).toHaveLength(3)
  })

  it('#7 with Consider', () => {
    const decklist = parseList(`2 Archmage's Charm
    4 Ragavan, Nimble Pilferer
    4 Consider
    4 Counterspell`);

    expect(decklist.cards.filter(c => c.type === 'Sideboard')).toHaveLength(0)
  })
});
