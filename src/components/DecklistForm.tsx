import Link from 'next/link';
import {useEffect} from 'react';
import {useForm, SubmitHandler, useWatch} from 'react-hook-form';
import {parseList} from '../utils/decklist';

import LEGACY_DECKS from '../data/legacy-meta.json';
import VINTAGE_DECKS from '../data/vintage-meta.json';

type DecklistFormProps = {
  format: Format | string;
  initialValues?: Partial<DecklistFormType>;
  onSubmit: SubmitHandler<DecklistFormType>;
};

const MODERN_DECKS = [
  'Murktide Regent',
  '4/5c Omnath',
  'Burn',
  'Hammer Time',
  'Amulet Titan',
  'Yawgmoth',
  'Living End',
  'Crashing Footfalls',
  'Tron',
  'UW/R Control',
  'Affinity',
  'Indomitable Creativity',
  'Asmo Food',
  'Jund',
  'BR Midrange',
  'Mill',
  'Goblin Charbelcher',
  'Merfolk',
  'Humans',
  'Infect',
].sort();

const format2decks: Record<Format, string[]> = {
  modern: MODERN_DECKS,
  vintage: VINTAGE_DECKS,
  legacy: LEGACY_DECKS,
};

const isValidFormat = (s: string): s is Format => {
  return s === 'modern' || s === 'legacy' || s === 'vintage';
};

export default function DecklistForm({
  format,
  onSubmit,
  initialValues,
}: DecklistFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<DecklistFormType>();

  const decklist = useWatch({
    control,
    name: 'decklist',
  });

  const parsedDecklist = parseList(decklist || '');

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [reset, initialValues]);

  const internalOnSubmit: SubmitHandler<DecklistFormType> = async (data) => {
    await onSubmit(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(internalOnSubmit)}>
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Deck Archetype:</label>
            <select
              className="w-full"
              {...register('deck_archetype', {required: true})}
            >
              <option value="">---</option>
              {(isValidFormat(format) ? format2decks[format] : []).map(
                (deck) => (
                  <option key={deck} value={deck}>
                    {deck}
                  </option>
                )
              )}
              <option value="Others">Others</option>
            </select>
            {errors.deck_archetype && (
              <p className="text-red-700">This field is required</p>
            )}
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">
              Deck name (optional):
            </label>
            <input type="text" className="w-full" {...register('deck_name')} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg mt-6">Decklist:</label>
            <div className="w-full">
              <textarea
                className="w-full min-h-[240px]"
                {...register('decklist', {required: true})}
                placeholder={
                  '4 Goblin Guide\n4 Lava Spike\n\n2 Deflecting Palm'
                }
              />
              {errors.decklist && (
                <p className="text-red-700">This field is required</p>
              )}
            </div>
          </div>
          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg mt-6">
              Parsed Decklist (
              {parsedDecklist.maindeck < 60 && (
                <span title="Minimum 60 cards">⚠️</span>
              )}
              {parsedDecklist.maindeck} /{' '}
              {parsedDecklist.sideboard > 15 && (
                <span title="Maximum 15 cards">⚠️</span>
              )}{' '}
              {parsedDecklist.sideboard})
            </label>
            <div className="columns-2">
              {[
                'Planeswalker',
                'Creature',
                'Instant',
                'Sorcery',
                'Artifact',
                'Enchantment',
                'Land',
                'Other',
                'Sideboard',
              ].map((type) => {
                if (
                  parsedDecklist.cards.some((c) => c.type === type) === false
                ) {
                  return null;
                }

                return (
                  <div key={type} className="break-inside-avoid-column">
                    <h3 className="font-bold text-lg mt-2">
                      {type === 'Other' ? (
                        <abbr title="Not recognized cards, not a problem">
                          Other
                        </abbr>
                      ) : (
                        type
                      )}
                    </h3>
                    <ul>
                      {parsedDecklist.cards
                        .filter((c) => c.type === type)
                        .map((card, i) => (
                          <li key={i}>
                            {card.amount}x {card.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isSubmitSuccessful && (
          <p className="text-green-700 font-bold">Decklist saved!</p>
        )}

        <button className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </>
  );
}
