type Format = 'modern' | 'legacy' | 'vintage';
type PlayerStatus = 'payment-pending' | 'paid' | 'decklist-submitted';

type Decklist = {
  id: string;
  tournament: string;
  deck_name: string;
  deck_archetype: string;
  decklist: string;
  player: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type User = {
  id: string;
  email: string;
  admin: boolean;
  deckcheck: boolean;
};

type Tournament = {
  id: string;
  name: string;
  format: Format;
  price: number;
  start_date: string;
  registration_info: string | null;
  payment_info: string | null;
  decklist_required: boolean;
  blocked: boolean;
};

type TournamentPlayerBasicInfo = {
  id: number;
  tournament_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  deckchecked: boolean;
  notes: string;
};

type TournamentPlayerPending = TournamentPlayerBasicInfo & {
  status: 'payment-pending';
};
type TournamentPlayerPaid = TournamentPlayerBasicInfo & {
  status: 'paid';
};

type TournamentPlayerDecklistSubmitted = TournamentPlayerBasicInfo & {
  status: 'decklist-submitted';
  decklist: string;
  deck_name: string;
  deck_archetype: string;
};

type TournamentPlayer =
  | TournamentPlayerPending
  | TournamentPlayerPaid
  | TournamentPlayerDecklistSubmitted;

type DecklistFormType = Pick<
  TournamentPlayerDecklistSubmitted,
  'deck_name' | 'deck_archetype'
> & {
  decklist: string;
};
