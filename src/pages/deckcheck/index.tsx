import Link from 'next/link';
import {useCallback, useMemo, useState} from 'react';
import useSWR from 'swr';
import {useLocalStorage} from 'usehooks-ts';
import latinize from 'latinize';
import {PageTitle} from '../../components/Typography';
import {useRequiredDeckcheck} from '../../contexts/UserContext';
import {formatDate} from '../../utils/dates';
import {parseList} from '../../utils/decklist';
import {
  clearTableNumber,
  fetchAllPlayersByTournament,
  fetchTournaments,
  updateTableNumber,
} from '../../utils/supabase';

export default function Admin() {
  useRequiredDeckcheck();
  const [tournament, setTournament] = useLocalStorage('DC-T', '');
  const [nameFilter, setNameFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'dc' | 'table'>('name');
  const {data: players, mutate} = useSWR(
    tournament && '/dc/' + tournament,
    () => fetchAllPlayersByTournament(tournament)
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
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.fullname
            .toLowerCase()
            .localeCompare(b.fullname.toLowerCase());
        }

        if (sortBy === 'table') {
          return a.table === null
            ? 1
            : b.table === null
            ? -1
            : a.table - b.table;
        }

        if (a.deckchecked === b.deckchecked) {
          return a.fullname
            .toLowerCase()
            .localeCompare(b.fullname.toLowerCase());
        }

        if (a.deckchecked) {
          return -1;
        }

        return 1;
      });
  }, [players, nameFilter, sortBy]);

  const downloadCsv = useCallback(() => {
    if (players === undefined) {
      return;
    }

    const content = [
      ['firstName', 'lastName', 'dci', 'country', 'role', 'status'],
    ].concat(
      players.map((p) => [
        latinize(p.first_name).replace("'", ' ').trim(),
        latinize(p.last_name).replace("'", ' ').trim(),
        '' + (10000 + p.id),
        'IT',
        'player',
        p.status === 'payment-pending' ? 'not enrolled' : 'enrolled',
      ])
    );

    const txt = content.map((row) => row.join(';')).join('\n');

    const a = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([txt], {type: 'text/csv'}));
    a.href = url;
    a.download = 'players.csv';

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }, [players]);

  const importTables = async () => {
    if (tournament === '') {
      alert('Seleziona un torneo');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';

    input.addEventListener('change', (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        //@ts-expect-error
        const rows = reader.result.split('\n');

        rows.forEach((row: string, index: number) => {
          if (index === 0 || index === 1) {
            return;
          }
          handleRow(row);
        });
      };

      reader.readAsText(file);
    });

    await clearTableNumber(tournament);

    input.click();

    function findUser(firstName: string, lastName: string) {
      return players?.find(
        (p) =>
          firstName.toLowerCase() ===
            latinize(p.first_name).replace("'", ' ').trim().toLowerCase() &&
          lastName.toLowerCase() ===
            latinize(p.last_name).replace("'", ' ').trim().toLowerCase()
      );
    }

    function handleRow(row: string) {
      // "135","Haudenschild, Fabian","IT","0","Bandera, Michele","IT","0"
      const [table, nameP1, , , nameP2] = row
        .split('","')
        .map((s) => s.replaceAll('"', ''));

      if (table === '-') {
        const [lastName1, firstName1] = nameP1.split(', ');
        const p = findUser(firstName1, lastName1);
        p && updateTableNumber(p.id, 0);

        return;
      }

      const [lastName1, firstName1] = nameP1.split(', ');
      const p1 = findUser(firstName1, lastName1);
      p1 && updateTableNumber(p1.id, +table);

      const [lastName2, firstName2] = nameP2.split(', ');
      const p2 = findUser(firstName2, lastName2);
      if (p2 === undefined) {
        console.log('Non ho trovato', [firstName2, lastName2, table]);
      }
      p2 && updateTableNumber(p2.id, +table);
    }
  };

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
          <label className="block font-bold text-lg">Sort by:</label>
          <select
            className="w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dc' | 'name')}
          >
            <option value="name">Name</option>
            <option value="dc">DC</option>
            <option value="table">Table</option>
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

      <button onClick={downloadCsv}>Download csv players</button>
      {' - '}
      <button onClick={importTables}>Import tables from Walter</button>

      <table className="table-auto w-full">
        <thead>
          <tr className="border-b font-bold">
            <td>Table</td>
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
              <td>{player.table}</td>
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
