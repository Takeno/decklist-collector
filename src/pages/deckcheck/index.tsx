import type { NextPage } from 'next'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { useLocalStorage } from 'usehooks-ts'
import { PageTitle } from '../../components/Typography'
import { formatDate } from '../../utils/dates'
import { parseList } from '../../utils/decklist'
import { fetchListByTournament, fetchMyLists } from '../../utils/supabase'

const Home: NextPage = () => {
  const [tournament, setTournament] = useLocalStorage('DC-T', '');
  const [nameFilter, setNameFilter] = useState('');
  const {data, isValidating} = useSWR('/dc/' + tournament, () => fetchListByTournament(tournament));


  const parsedDecklists = useMemo(() => {
    if(data === undefined) return [];

    return data.filter(d => d.player.toLowerCase().includes(nameFilter.toLowerCase())).map(d => ({
      ...d,
      parsed: parseList(d.decklist)
    }))
  }, [data, nameFilter]);

  return (
    <div className="container mx-auto px-4 mt-6">
      <PageTitle>Deck Check Panel</PageTitle>

      <div className="flex flex-col mb-8 md:flex-row md:justify-between">
        <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Tournament:</label>
            <select className="w-full" value={tournament} onChange={e => setTournament(e.target.value)}>
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
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Player:</label>
            <input type="search" className="w-full" value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
          </div>
        </div>

      <table className="table-auto w-full">
        <thead>
          <tr className="border-b font-bold">
            <td>Player</td>
            <td className='hidden md:block'>Archetype</td>
            {/* <td>Player</td> */}
            {/* <td>Submission date</td> */}
            <td>Status</td>
            <td></td>
            {/* <td>Update date</td> */}
          </tr>
        </thead>
        <tbody>
          {parsedDecklists.length ? parsedDecklists.map((decklist) => (
            <tr key={decklist.id}>
              <td><Link href={`/deckcheck/${decklist.id}`}><a className='hover:underline'>{decklist.player}</a></Link></td>
              <td className='hidden md:block'>{decklist.deck_archetype}</td>
              {/* <td>{formatDate(decklist.created_at)}</td> */}
              {/* <td>{formatDate(decklist.updated_at)}</td> */}
              <td>{decklist.parsed.maindeck < 60 && <span title="Minimum 60 cards">⚠️</span>}
                {decklist.parsed.maindeck} / {decklist.parsed.sideboard > 15 && <span title="Maximum 15 cards">⚠️</span>} {decklist.parsed.sideboard}</td>
            </tr>
          )) : <tr>
              <td colSpan={4}><p className='text-lg text-center'>You have no registered decks yet.</p></td>
            </tr>}
        </tbody>
      </table>
    </div>
  )
}

export default Home
