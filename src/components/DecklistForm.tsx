import { useForm, SubmitHandler } from "react-hook-form";

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


export default function DecklistForm({onSubmit, initialValues = {}}:DecklistFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DecklistForm>();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Tournament:</label>
            <select className="w-full" {...register('tournament')} defaultValue={initialValues.tournament}>
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
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Player:</label>
            <input type="text" className="w-full" {...register("player", {required: true})} defaultValue={initialValues.player} />
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Deck Archetype:</label>
            <select className="w-full" {...register('deck_archetype')} defaultValue={initialValues.deck_archetype}>
              <option value="">---</option>
              <option value="other">Other</option>
              <optgroup label="Modern">
                {MODERN_DECKS.map(deck => <option key={deck} value={deck}>{deck}</option>)}
              </optgroup>
              <optgroup label="Legacy">
                {LEGACY_DECKS.map(deck => <option key={deck} value={deck}>{deck}</option>)}
              </optgroup>
              <optgroup label="Vintage">
                {VINTAGE_DECKS.map(deck => <option key={deck} value={deck}>{deck}</option>)}
              </optgroup>
            </select>
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Deck name (optional):</label>
            <input type="text" className="w-full" {...register("deck_name", {required: true})} defaultValue={initialValues.deck_name} />
          </div>
        </div>


        <label className="block font-bold text-lg mt-6">Decklist:</label>
        <div className="w-full h-40">
          <textarea className="w-full h-40" {...register('decklist')} defaultValue={initialValues.decklist} />
        </div>

        <button>Save</button>
      </form>
    </>
  )
}