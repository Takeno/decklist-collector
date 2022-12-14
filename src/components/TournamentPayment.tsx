import Link from 'next/link';
import {PageTitle} from './Typography';

type Props = {
  tournament: Tournament;
  player: TournamentPlayerPending;
};

export default function TournamentPayment({tournament, player}: Props) {
  if (tournament.price === 0) {
    return (
      <div className="container mx-auto mt-6 px-4 space-y-4">
        <Link href="/">
          <a>Back to the list</a>
        </Link>
        <PageTitle>
          {player.first_name}, thanks for your registration!
        </PageTitle>

        <p>
          There is no payment needed, but your registration must be validated
          manually.
        </p>
        <p>You will receive an email once your registration is approved.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-6 px-4 space-y-4">
      <Link href="/">
        <a>Back to the list</a>
      </Link>
      <PageTitle>{player.first_name}, thanks for your registration!</PageTitle>

      <p>
        We&apos;ve received your registration request and your seat is reserved!
      </p>
      <p>
        Now, the next step is paying the entry fee. Currently, we accept only
        Paypal.
      </p>
      <p className="">
        <span className="italic">Caution:</span> The validation is manual; you
        will receive an email when the payment is registered.
      </p>

      {tournament.payment_info && (
        <div dangerouslySetInnerHTML={{__html: tournament.payment_info}} />
      )}

      {/* <TournamentStatus tournament={tournament} player={player} /> */}

      <div className="flex justify-center align-middle">
        <a
          href={`https://www.paypal.com/paypalme/4STournaments/${
            tournament.price / 100
          }`}
          className="button"
          target="_blank"
          rel="noreferrer"
        >
          Pay here{' '}
          {new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'EUR',
          }).format(tournament.price / 100)}
        </a>
        .
      </div>
    </div>
  );
}
