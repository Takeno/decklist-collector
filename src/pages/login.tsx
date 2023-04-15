import {PageTitle} from '../components/Typography';
import {fetchTournaments, supabase} from '../utils/supabase';

import {useForm} from 'react-hook-form';
import {useUser} from '../contexts/UserContext';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {formatDate} from '../utils/dates';

export default function Login() {
  const {user} = useUser();
  const router = useRouter();
  const {data: tournaments} = useSWR('/tournaments', () => fetchTournaments());

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitSuccessful, isSubmitting},
  } = useForm();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  async function onSubmit(data: any) {
    const {error} = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo:
          window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : window.location.protocol + '//' + window.location.hostname,
      },
    });

    if (error) {
      alert(
        'Si è verificato un errore. Si prega di riprovare più tardi. Ragavan sta creando qualche problema...'
      );
      return;
    }
    reset();
  }

  return (
    <div className="container mx-auto px-4 mt-6 flex flex-col flex-1 justify-center">
      <PageTitle>Welcome to Paupergeddon Pisa!</PageTitle>

      <p className="text-xl">
        Here you can reserve your seat, pay the entry fee and manage your
        decklists.
        <br />
        Enter your email and receive an invite link to manage your decklists.
      </p>
      <p className="text-lg">
        <span className="italic">Caution:</span> Accounts are individual, so
        each player must create they own account.
      </p>

      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block font-bold text-lg">Enter your email:</label>
        <input type="email" {...register('email', {required: true})} />
        {errors.email && <p className="text-red-700">Email is required</p>}
        <br />
        <button disabled={isSubmitting} className="button">
          {isSubmitting ? 'Sending...' : 'Invite me!'}
        </button>
      </form>

      {isSubmitSuccessful && (
        <p className="text-green-700 font-bold">Email sent!</p>
      )}

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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tournaments?.map((t, i) => {
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
