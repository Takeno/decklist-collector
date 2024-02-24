import {formatDate} from '../utils/dates';

type Props = {
  tournament: Tournament;
  player?: TournamentPlayer;
};

export default function TournamentStatus({tournament, player}: Props) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg my-4">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {tournament.name}
        </h3>
        {/* <p className="mt-1 max-w-2xl text-gray-500">Tournament infos</p> */}
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="font-medium text-gray-500">When</dt>
            <dd className="mt-1 text-gray-900">
              {formatDate(tournament.start_date)}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="font-medium text-gray-500">Format</dt>
            <dd className="mt-1 text-gray-900 first-letter:uppercase">
              {tournament.format}
            </dd>
          </div>
          {player && (
            <div className="sm:col-span-1">
              <dt className="font-medium text-gray-500">Player</dt>
              <dd className="mt-1 text-gray-900">
                {player.first_name} {player.last_name}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
