import Link from 'next/link';
import {useMemo, useState} from 'react';
import useSWR from 'swr';
import {useLocalStorage} from 'usehooks-ts';
import {PageTitle} from '../../components/Typography';
import {useRequiredAdmin} from '../../contexts/UserContext';
import {formatDate} from '../../utils/dates';
import {
  fetchAllPlayersByTournament,
  fetchTournaments,
  updatePlayerTournament,
} from '../../utils/supabase';

export default function Admin() {
  useRequiredAdmin();
  const [tournament, setTournament] = useLocalStorage('DC-T', '');
  const [nameFilter, setNameFilter] = useState('');
  const {data: players, mutate} = useSWR(
    '/player-by-tournament/' + tournament,
    () => fetchAllPlayersByTournament(tournament)
  );

  const {data: tournaments} = useSWR('/tournaments', () => fetchTournaments());

  const markAsPaid = async (id: number) => {
    try {
      const p = players?.find((p) => p.id === id);
      if (p === undefined) {
        throw new Error('player not found');
      }
      // const t = tournaments?.find(t => t.id === p.tournament_id);
      // if(t === undefined) throw new Error('tournament not found');

      await updatePlayerTournament({
        id: id,
        status: 'paid',
      });

      await fetch(
        `/api/mark-paid?tournament=${p.tournament_id}&email=${p.email}`
      );

      mutate();
    } catch (e: any) {
      alert(e);
      console.error(e);
    }
  };

  const filtered = useMemo(() => {
    if (players === undefined) {
      return [];
    }

    return players
      .filter((d) =>
        `${d.first_name} ${d.last_name}`
          .toLowerCase()
          .includes(nameFilter.toLowerCase())
      )
      .map((d) => ({
        ...d,
        fullname: `${d.last_name} ${d.first_name}`,
      }))
      .sort((a, b) =>
        a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase())
      );
  }, [players, nameFilter]);

  return (
    <div className="container mx-auto px-4 mt-6">
      <PageTitle>Admin panel</PageTitle>

      <div className="flex flex-col mb-8 md:flex-row md:justify-between">
        <div className="md:flex-1 pr-4">
          <label className="block font-bold text-lg">Tournament:</label>
          <select
            className="w-full"
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
          >
            <option value="">---</option>
            {tournaments?.map((t) => (
              <option value={t.id} key={t.id}>
                {t.name} - {formatDate(t.start_date)}
              </option>
            ))}
          </select>
        </div>

        <div className="md:flex-1 pr-4">
          <label className="block font-bold text-lg">Player:</label>
          <input
            type="search"
            className="w-full"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
      </div>

      <h1>{filtered.length} players found</h1>

      <table className="table-auto w-full">
        <thead>
          <tr className="border-b font-bold">
            <td>Player</td>
            <td className="hidden md:block">Torneo</td>
            <td>Status</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {filtered.map((player, i) => (
            <tr
              key={player.id}
              className={i % 2 === 0 ? undefined : 'bg-gray-50'}
            >
              <td>
                {player.fullname}
                <span className="md:hidden">{player.tournaments.name}</span>
              </td>
              <td className="hidden md:block">{player.tournaments.name}</td>
              <td>{player.status}</td>
              <td>
                {player.status === 'payment-pending' && (
                  <button onClick={() => markAsPaid(player.id)}>
                    Mark as paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
