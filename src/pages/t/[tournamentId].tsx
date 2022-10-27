import {useRouter} from 'next/router';
import useSWR from 'swr';
import TournamentDecklist from '../../components/TournamentDecklist';
import TournamentPayment from '../../components/TournamentPayment';
import TournamentRegistration from '../../components/TournamentRegistration';
import {useRequiredUser} from '../../contexts/UserContext';
import {fetchPlayerTournament, fetchTournament} from '../../utils/supabase';

const swrTournamentKey = (tId: any) => {
  return typeof tId !== 'string' ? undefined : `/tournament/${tId}`;
};

const swrPlayerTournamentKey = (uId: any, tId: any) => {
  if (typeof uId !== 'string') {
    return undefined;
  }

  if (typeof tId !== 'string') {
    return undefined;
  }

  return `/player/${uId}/${tId}`;
};

export default function TournamentPage() {
  const router = useRouter();
  const user = useRequiredUser();
  const tournamentId = router.query.tournamentId as string;

  const {data: tournament, isValidating: loading1} = useSWR(
    swrTournamentKey(tournamentId),
    () => fetchTournament(tournamentId)
  );
  const {data: player, isValidating: loading2} = useSWR(
    swrPlayerTournamentKey(user.id, tournamentId),
    () => fetchPlayerTournament(user.id, tournamentId)
  );

  if (
    (tournament === undefined && loading1) ||
    (player === undefined && loading2)
  ) {
    return <p>Loading...</p>;
  }

  if (tournament === undefined || tournament === null) {
    return <p>Torneo non trovato</p>;
  }

  if (player === undefined || player === null) {
    return <TournamentRegistration tournament={tournament} />;
  }

  if (player.status === 'payment-pending') {
    return <TournamentPayment tournament={tournament} player={player} />;
  }

  if (player.status === 'paid') {
    return <TournamentDecklist tournament={tournament} player={player} />;
  }

  if (player.status === 'decklist-submitted') {
    return <TournamentDecklist tournament={tournament} player={player} />;
  }

  return (
    <>
      It works
      <div>{JSON.stringify(tournament)}</div>
      <div>{JSON.stringify(player)}</div>
    </>
  );
}
