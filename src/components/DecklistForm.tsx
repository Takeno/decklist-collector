import Link from 'next/link';
import {useCallback, useEffect, useRef} from 'react';
import {
  useForm,
  SubmitHandler,
  useWatch,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import {parseList} from '../utils/decklist';

import LEGACY_DECKS from '../data/legacy-meta.json';
import VINTAGE_DECKS from '../data/vintage-meta.json';
import DecklistInput from './DecklistInput';

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

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [reset, initialValues]);

  const internalOnSubmit: SubmitHandler<DecklistFormType> = async (data) => {
    const parsed = parseList(data.decklist);

    if (parsed.maindeck < 60) {
      setError('decklist', {
        type: 'custom',
        message: 'The mainboard must have at least 60 cards',
      });
      throw new Error('Invalid form');
    }

    if (parsed.sideboard > 15) {
      setError('decklist', {
        type: 'custom',
        message: 'The sideboard must have a maximum of 15 cards',
      });
      throw new Error('Invalid form');
    }

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
            <Controller
              control={control}
              name="decklist"
              render={({field}) => (
                <DecklistInput
                  format={undefined}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.decklist && (
              <p className="text-red-700">
                Decklist is invalid: {errors.decklist?.message}
              </p>
            )}
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
