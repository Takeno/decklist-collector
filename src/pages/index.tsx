import type { NextPage } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import { PageTitle } from '../components/Typography'
import { formatDate } from '../utils/dates'
import { fetchMyLists } from '../utils/supabase'

const Home: NextPage = () => {
  const {data, isValidating} = useSWR('/decklists', () => fetchMyLists())


  return (
    <div className="container mx-auto px-4 mt-6">

      <PageTitle>Le tue decklist</PageTitle>

      <table className="table-auto w-full">
        <thead>
          <tr className="border-b font-bold">
            <td>Tournament</td>
            <td>Archetype</td>
            <td>Deck name</td>
            {/* <td>Player</td> */}
            <td>Submission date</td>
            {/* <td>Update date</td> */}
          </tr>
        </thead>
        <tbody>
          {data?.map((decklist) => (
            <tr key={decklist.id}>
              <td>{decklist.tournament}</td>
              <td>{decklist.deck_archetype}</td>
              <td>{decklist.deck_name}</td>
              {/* <td>{decklist.player}</td> */}
              {/* <td>{formatDate(decklist.created_at)}</td> */}
              <td>{formatDate(decklist.updated_at)}</td>
              <td><Link href={`/edit/${decklist.id}`}><a>Edit</a></Link></td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className='flex justify-end'>
        <Link href="/new">
        <a>
            New decklist
        </a>
        </Link>
      </div>

    </div>
  )
}

export default Home
