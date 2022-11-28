import {useRouter} from 'next/router';
import useSWR from 'swr';
import {
  fetchTournament,
  fetchTournamentPlayer,
  updatePlayerTournament,
} from '../../utils/supabase';
import {PageTitle} from '../../components/Typography';
import {parseList} from '../../utils/decklist';
import Link from 'next/link';
import {useCallback, useMemo, useRef} from 'react';

export default function ShowDecklist() {
  const router = useRouter();
  const decklistId = router.query.id as string;
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const {data, mutate, isValidating} = useSWR(
    decklistId && '/decklists/' + decklistId,
    () => fetchTournamentPlayer(decklistId)
  );
  const {data: tournament} = useSWR(
    data?.tournament_id && '/tournament/' + data.tournament_id,
    () => fetchTournament(data!.tournament_id)
  );

  const copy = useCallback(async () => {
    if (!data || data.status !== 'decklist-submitted') {
      return;
    }

    const parsedDecklist = parseList(data.decklist);
    const mainboard = parsedDecklist.cards.filter(
      (c) => c.type !== 'Sideboard'
    );
    const sideboard = parsedDecklist.cards.filter(
      (c) => c.type === 'Sideboard'
    );
    const text = `${data.first_name} ${data.last_name}\n\nmaindeck\n${mainboard
      .map((c) => `${c.amount} ${c.name}`)
      .join('\n')}\n\nsideboard\n${sideboard
      .map((c) => `${c.amount} ${c.name}`)
      .join('\n')}`;
    await navigator.clipboard.writeText(text);
    alert('copied!');
  }, [data]);

  const parsedDecklist = useMemo(() => {
    if (!data) {
      return null;
    }

    if (data.status !== 'decklist-submitted') {
      return null;
    }

    return parseList(data.decklist);
  }, [data]);

  const changeDC = useCallback(async () => {
    if (!data) {
      return;
    }

    await updatePlayerTournament({
      id: data.id,
      deckchecked: !data.deckchecked,
    });

    mutate();
  }, [data]);

  const saveNotes = useCallback(async () => {
    if (!notesRef.current || !data) {
      return;
    }

    await updatePlayerTournament({
      id: data.id,
      notes: notesRef.current.value,
    });

    mutate();
  }, [data]);

  if (!data) {
    return <h1>Loading</h1>;
  }

  if (data.status !== 'decklist-submitted' || !parsedDecklist) {
    return (
      <div className="container mx-auto mt-6 px-4">
        <Link href="/deckcheck">
          <a>Back to the list</a>
        </Link>

        <h1>Decklist not submitted</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-6 px-4">
      <Link href="/deckcheck">
        <a>Back to the list</a>
      </Link>
      <PageTitle>
        {data.first_name} {data.last_name}{' '}
        {parsedDecklist.maindeck < 60 && (
          <span title="Minimum 60 cards">⚠️</span>
        )}
        {parsedDecklist.maindeck} /{' '}
        {parsedDecklist.sideboard > 15 && (
          <span title="Maximum 15 cards">⚠️</span>
        )}{' '}
        {parsedDecklist.sideboard}{' '}
        <a href="#" className="text-lg" onClick={copy}>
          Copy
        </a>
      </PageTitle>
      <p>
        <span className="font-bold">Archetype:</span> {data.deck_archetype}
      </p>
      <p>
        <span className="font-bold">Deck Name:</span> {data.deck_name}
      </p>
      <p>
        <span className="font-bold">Tournament:</span>{' '}
        {tournament?.name || data.tournament_id}
      </p>
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
          'Sideboard',
        ].map((type) => {
          if (parsedDecklist.cards.some((c) => c.type === type) === false) {
            return null;
          }
          return (
            <div key={type} className="break-inside-avoid-column">
              <h3 className="font-bold text-lg mt-2">
                {type === 'Other' ? (
                  <abbr title="Not recognized cards, not a problem">Other</abbr>
                ) : (
                  type
                )}
              </h3>
              <ul>
                {parsedDecklist.cards
                  .filter((c) => c.type === type)
                  .map((card, i) => (
                    <li
                      key={i}
                      className={card.validated ? '' : 'text-red-400'}
                    >
                      {card.amount}x {card.name}
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </div>
      <hr />
      <h3 className="text-lg font-bold my-4">Judge Stuffs</h3>
      <label>
        <input type="checkbox" checked={data.deckchecked} onChange={changeDC} />{' '}
        Deckcheck effettuato?
      </label>

      <br />
      <br />
      <label>
        Notes
        <textarea
          className="block w-full min-h-[120px]"
          defaultValue={data.notes}
          ref={notesRef}
        ></textarea>
      </label>
      <button className="button" onClick={saveNotes}>
        Save
      </button>
      {/* <hr />
      <h3 className="text-lg font-bold my-4">Source</h3>
      <pre>{data.decklist}</pre> */}
    </div>
  );
}
