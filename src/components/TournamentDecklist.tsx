import Link from 'next/link';
import type {SubmitHandler} from 'react-hook-form';
import {updatePlayerTournament} from '../utils/supabase';
import DecklistForm from './DecklistForm';
import TournamentStatus from './TournamentStatus';
import {PageTitle} from './Typography';

type Props = {
  tournament: Tournament;
  player: TournamentPlayerPaid | TournamentPlayerDecklistSubmitted;
};

export default function TournamentDecklist({tournament, player}: Props) {
  if (tournament.decklist_required === false) {
    return (
      <div className="container mx-auto mt-6 px-4">
        <Link href="/">
          <a>Back to the list</a>
        </Link>
        <PageTitle>Your registration is complete!</PageTitle>

        <p>
          The decklist is not required for this tournament. See you on Bologna!
        </p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<DecklistFormType> = async (data) => {
    await updatePlayerTournament({
      ...player,
      ...data,
      status: 'decklist-submitted',
    });
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <Link href="/">
        <a>Back to the list</a>
      </Link>
      <PageTitle>Decklist time!</PageTitle>

      <TournamentStatus tournament={tournament} player={player} />

      <p className="my-4">
        Seat reserved, payment confirmed. You just need to submit your decklist!
      </p>

      <DecklistForm
        disabled={tournament.blocked}
        format={tournament.format}
        onSubmit={onSubmit}
        initialValues={player.status === 'paid' ? undefined : player}
      />
    </div>
  );
}
