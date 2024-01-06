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
        Bank Transfer:
      </p>
      <p>
        Bank Name: Sammelkartenspielverein
        <br />
        IBAN: AT61 3474 1000 0040 6454
        <br />
        BIC: RZOOAT2L741
      </p>
      <p>Please, specify tournament name and player name.</p>
      <p className="">
        <span className="italic">Caution:</span> The validation is manual; you
        will receive an email when the payment is registered.
      </p>

      {tournament.payment_info && (
        <div dangerouslySetInnerHTML={{__html: tournament.payment_info}} />
      )}

      {/* <TournamentStatus tournament={tournament} player={player} /> */}
    </div>
  );
}
