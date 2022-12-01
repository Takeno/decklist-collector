import Link from 'next/link';
import {useMemo, useState} from 'react';
import useSWR from 'swr';
import {useLocalStorage} from 'usehooks-ts';
import {PageTitle} from '../../components/Typography';
import {useRequiredDeckcheck} from '../../contexts/UserContext';
import {formatDate} from '../../utils/dates';
import {parseList} from '../../utils/decklist';
import {
  fetchAllPlayersByTournament,
  fetchTournaments,
} from '../../utils/supabase';

export default function Admin() {
  useRequiredDeckcheck();
  const [tournament, setTournament] = useLocalStorage('DC-T', '');
  const [nameFilter, setNameFilter] = useState('');
  const {data: players} = useSWR(tournament && '/dc/' + tournament, () =>
    fetchAllPlayersByTournament(tournament)
  );

  const {data: tournaments} = useSWR('/tournaments', () => fetchTournaments());

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
      <PageTitle>Deck Check Panel</PageTitle>

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
            <td className="hidden md:block">Archetype</td>
            <td>DC</td>
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
                <Link href={`/deckcheck/${player.id}`}>
                  <a className="hover:underline">
                    {player.last_name} {player.first_name}
                  </a>
                </Link>
              </td>
              <td className="hidden md:block">
                {player.status === 'decklist-submitted' &&
                  player.deck_archetype}
              </td>
              <td>
                {player.deckchecked && '✅'}
                {player.notes && '📝'}
              </td>

              <td>
                {player.status === 'decklist-submitted' &&
                  ((): string => {
                    const p = parseList(player.decklist);

                    return `${p.maindeck}/${p.sideboard}`;
                  })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
