type Decklist = {
  id: string;
  tournament: string,
  deck_name: string
  deck_archetype: string
  decklist: string
  player: string
  created_by: string,
  created_at: string,
  updated_at: string,
};

type DecklistForm = Pick<Decklist, "deck_name" | "deck_archetype" | "player" | "tournament" | "decklist">


type User = {
  id: string;
  email: string;
}
