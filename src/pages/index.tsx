import type { NextPage } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import { PageTitle } from '../components/Typography'
import { fetchMyLists } from '../utils/supabase'

const Home: NextPage = () => {
  const {data, isValidating} = useSWR('/decklists', () => fetchMyLists())


  return (
    <div className="container mx-auto px-4 mt-6">

      <PageTitle>Le tue decklist</PageTitle>

      <table className="table-auto w-full">
        <thead>
          <tr className="border-b font-bold">
            <td>Deck name</td>
            <td>Player</td>
            <td>Tournament</td>
            <td>Submission date</td>
          </tr>
        </thead>
        <tbody>
          {data?.map((decklist) => (
            <tr key={decklist.id}>
              <td>{decklist.deck_name}</td>
              <td>{decklist.player}</td>
              <td>{decklist.tournament}</td>
              <td>{decklist.created_at}</td>
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
