import { useEffect, useLayoutEffect } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { parseList } from "../utils/decklist";

type DecklistFormProps = {
  initialValues?: Partial<DecklistForm>
  onSubmit: SubmitHandler<DecklistForm>
}

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

const LEGACY_DECKS = [
  'Izzet Delver',
  'Jeskai Control',
  'Elves',
  'Death and Taxes',
  'Reanimator',
  'Selesnya Depths',
  '8-Cast',
  'Painter',
  'Lands',
  'Ad Nauseam Tendrils',
  'Doomsday',
  'Mono-Green Cloudpost',
  'Sneak and Show',
  'Burn',
  'Stoneblade',
  'Death\'s Shadow',
  'Mono R Prison',
].sort();

const VINTAGE_DECKS = [
  'Blue Tinker',
  'Hogaak',
  'Paradoxical Outcome',
  'Doomsday',
  'Prison Shops',
  'Aggro Shops',
  'Sultai Midrange',
  'Blue Tempo',
  'Squee Hollow Vine',
  'Dredge',
  'Jeskai Control',
  'Oath of Druids',
  'Goblins',
  'Standstill',
  'Hogaak Vine',
  'Mono-White Aggro',
  'RUG Control',
].sort();


export default function DecklistForm({onSubmit, initialValues}:DecklistFormProps) {
  const { register, handleSubmit, setError, reset, control, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<DecklistForm>();

  const decklist = useWatch({
    control,
    name: "decklist",
  });

  const parsedDecklist = parseList(decklist || '');

  useEffect(() => {
    if(initialValues) {
      reset(initialValues);
    }
  }, [reset, initialValues]);


  const internalOnSubmit:SubmitHandler<DecklistForm> = async (data) => {
    try {
      await onSubmit(data);
    } catch(e:any) {
      if(e.code === "23505") {
        setError('tournament', {type:'custom', message: 'You\'ve already submitted a decklist for this tournament'});
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(internalOnSubmit)}>
        <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Tournament:</label>
            <select className="w-full" {...register('tournament', {required: true})}>
              <option value="">---</option>
              <optgroup label="Saturday Sep. 10th">
                <option value="Main Modern">Main Modern - Sep. 10th</option>
                <option value="Super Side Legacy">Super Side Legacy - Sep. 10th</option>
                <option value="Super Vintage">Super Vintage - Sep. 10th</option>
              </optgroup>
              <optgroup label="Sunday Sep. 11th">
                <option value="Main Legacy">Main Legacy - Sep. 11th</option>
                <option value="Super Side Modern">Super Side Modern - Sep. 11th</option>
              </optgroup>
            </select>
            {errors.tournament && <p className="text-red-700">{errors.tournament.message || 'This field is required'}</p>}
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Player:</label>
            <input type="text" className="w-full" {...register("player", {required: true})} />
            <p className="text-sm italic">Use the same of your companion account.</p>
            {errors.player && <p className="text-red-700">This field is required</p>}
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Deck Archetype:</label>
            <select className="w-full" {...register('deck_archetype', {required: true})}>
              <option value="">---</option>
              <optgroup label="Modern">
                {MODERN_DECKS.map(deck => <option key={deck} value={deck}>{deck}</option>)}
                <option value="other">Other</option>
              </optgroup>
              <optgroup label="Legacy">
                {LEGACY_DECKS.map(deck => <option key={deck} value={deck}>{deck}</option>)}
                <option value="other">Other</option>
              </optgroup>
              <optgroup label="Vintage">
                {VINTAGE_DECKS.map(deck => <option key={deck} value={deck}>{deck}</option>)}
                <option value="other">Other</option>
              </optgroup>
            </select>
            {errors.deck_archetype && <p className="text-red-700">This field is required</p>}
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Deck name (optional):</label>
            <input type="text" className="w-full" {...register("deck_name")} />
          </div>
        </div>


        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg mt-6">Decklist:</label>
            <div className="w-full">
              <textarea className="w-full min-h-[240px]" {...register('decklist', {required: true})} />
              {errors.decklist && <p className="text-red-700">This field is required</p>}
            </div>
          </div>
          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg mt-6">
              Parsed Decklist ({parsedDecklist.maindeck} / {parsedDecklist.sideboard})
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
                'Sideboard'
              ].map((type) => {
                if(parsedDecklist.cards.some(c => c.type === type) === false) {
                  return null;
                }

                return <div key={type} className="break-inside-avoid-column">
                  <h3 className="font-bold text-lg mt-2">{type}</h3>
                  <ul>
                    {parsedDecklist.cards.filter(c => c.type === type).map((card, i) => (<li key={i}>{card.amount}x {card.name}</li>))}
                  </ul>
                </div>
              })}
            </div>
          </div>
        </div>

        {isSubmitSuccessful && <p className="text-green-700 font-bold">Decklist saved!</p>}

        <button className="button" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
      </form>
    </>
  )
}