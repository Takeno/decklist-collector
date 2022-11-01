import type {NextPage} from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import {PageTitle} from '../components/Typography';
import {useRequiredUser} from '../contexts/UserContext';
import {formatDate} from '../utils/dates';
import {fetchMyTournaments, fetchTournaments} from '../utils/supabase';

const mapStatus: Record<TournamentPlayer['status'], string> = {
  'payment-pending': 'Waiting for payment',
  paid: 'Paid',
  'decklist-submitted': 'Decklist submitted',
};

const mapStatus2CTA: Record<TournamentPlayer['status'], string> = {
  'payment-pending': 'Show payment info',
  paid: 'Submit your decklist',
  'decklist-submitted': 'Show your decklist',
};

const Home: NextPage = () => {
  const user = useRequiredUser();

  const {data: tournaments} = useSWR('/tournaments', () => fetchTournaments());
  const {data: myTournaments} = useSWR('/my-tournaments', () =>
    fetchMyTournaments(user.id)
  );

  return (
    <div className="container mx-auto px-4 mt-6">
      <PageTitle>All our events</PageTitle>

      <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Tournament
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Start Date
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Format
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tournaments?.map((t, i) => {
              const myTournament = myTournaments?.find(
                (myT) => myT.tournament_id === t.id
              );

              return (
                <tr
                  key={t.id}
                  className={i % 2 === 0 ? undefined : 'bg-gray-50'}
                >
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    {t.name}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Title</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {formatDate(t.start_date)}
                      </dd>
                      <dt className="sr-only sm:hidden">Format</dt>
                      <dd className="mt-1 truncate text-gray-500 sm:hidden first-letter:uppercase">
                        {t.format}
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {formatDate(t.start_date)}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell first-letter:uppercase">
                    {t.format}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {myTournament?.status
                      ? mapStatus[myTournament?.status]
                      : '-'}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link href={`/t/${t.id}`}>
                      <a className="text-indigo-600 hover:text-indigo-900">
                        {myTournament?.status
                          ? mapStatus2CTA[myTournament?.status]
                          : 'Register now'}
                      </a>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
