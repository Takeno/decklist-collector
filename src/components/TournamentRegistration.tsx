import Link from 'next/link';
import {SubmitHandler, useForm} from 'react-hook-form';
import {mutate} from 'swr';
import {useRequiredUser} from '../contexts/UserContext';
import {createPlayerTournament} from '../utils/supabase';
import TournamentStatus from './TournamentStatus';
import {PageTitle} from './Typography';

type Props = {
  tournament: Tournament;
};

type TournamentRegistrationForm = {
  first_name: string;
  last_name: string;
  order_number: string;
};

export default function TournamentRegistration({tournament}: Props) {
  const user = useRequiredUser();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<TournamentRegistrationForm>();

  const internalHandleSubmit: SubmitHandler<
    TournamentRegistrationForm
  > = async (data) => {
    try {
      await createPlayerTournament({
        first_name: data.first_name,
        last_name: data.last_name,
        email: user.email,
        status: 'paid',
        user_id: user.id,
        tournament_id: tournament.id,
        deckchecked: false,
        notes: '',
        table: null,
        additional_data: {
          orderNumber: data.order_number,
        },
      });
      mutate(`/player/${user.id}/${tournament.id}`);
    } catch (e: any) {
      console.error(e);
      // if (e.code === '23505') {
      //   setError('tournament', {
      //     type: 'custom',
      //     message: "You've already submitted a decklist for this tournament",
      //   });
      // }
    }
  };

  if (tournament.blocked) {
    return (
      <div className="container mx-auto mt-6 px-4">
        <Link href="/">
          <a>Back to the list</a>
        </Link>
        <TournamentStatus tournament={tournament} />

        <PageTitle>Registration for {tournament.name} are closed.</PageTitle>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-6 px-4">
      <Link href="/">
        <a>Back to the list</a>
      </Link>
      <TournamentStatus tournament={tournament} />

      <PageTitle>Registration for {tournament.name}</PageTitle>
      <p>First of all, insert your first name and last name.</p>

      <p className="">
        <span className="italic">Caution:</span> Accounts are individual, so you
        can&apos;t register more than one player per tournament.
      </p>

      {tournament.registration_info && (
        <div dangerouslySetInnerHTML={{__html: tournament.registration_info}} />
      )}

      <form className="mt-4" onSubmit={handleSubmit(internalHandleSubmit)}>
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">First Name:</label>
            <input
              type="text"
              className="w-full"
              {...register('first_name', {required: true})}
            />
            <p className="text-sm italic">
              Use the same full name of your companion account.
            </p>
            {errors.first_name && (
              <p className="text-red-700">This field is required</p>
            )}
          </div>

          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Last Name:</label>
            <input
              type="text"
              className="w-full"
              {...register('last_name', {required: true})}
            />

            {errors.last_name && (
              <p className="text-red-700">This field is required</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Order number:</label>
            <input
              type="text"
              className="w-full"
              {...register('order_number', {required: true})}
            />
            {errors.order_number && (
              <p className="text-red-700">This field is required</p>
            )}
          </div>
          <div className="md:flex-1 pr-4">
            <label className="block font-bold text-lg">Email:</label>
            <input type="text" className="w-full" disabled value={user.email} />
            <p className="text-sm italic">This field is not editable.</p>
          </div>
        </div>
        {isSubmitSuccessful && (
          <p className="text-green-700 font-bold">Decklist saved!</p>
        )}

        <button className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Next'}
        </button>
      </form>
    </div>
  );
}
