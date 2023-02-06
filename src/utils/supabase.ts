import {createClient} from '@supabase/supabase-js';

const CHANNEL = '4seasons';

const supabaseUrl = 'https://ezkbsplhdpfqdtdbgiir.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6a2JzcGxoZHBmcWR0ZGJnaWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk1NDQ1MTgsImV4cCI6MTk3NTEyMDUxOH0.uZVn_g8HZufxsCGWO_YFUlgor0tm3JKZwsxaabEJBj0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: false,
  },
});

export async function fetchMyLists(): Promise<Decklist[]> {
  const {data, error} = await supabase.from('decklists').select();
  if (error) {
    throw error;
  }

  return data;
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const {data, error} = await supabase
    .from('tournaments')
    .select()
    .order('start_date')
    .eq('channel', CHANNEL);

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchMyTournaments(
  userId: string
): Promise<TournamentPlayer[]> {
  const {data, error} = await supabase
    .from('players')
    .select()
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchTournament(
  tournamentId: string
): Promise<Tournament | null> {
  const {data, error} = await supabase
    .from('tournaments')
    .select()
    .eq('id', tournamentId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchAllPlayersByTournament(
  tId?: string
): Promise<Array<TournamentPlayer & {tournaments: {name: string}}>> {
  let ops = supabase
    .from('players')
    .select('*, tournaments!inner(*)')
    .eq('tournaments.channel', CHANNEL)
    .order('last_name');

  if (tId) {
    ops = ops.eq('tournament_id', tId);
  }

  const {data, error} = await ops;

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchPlayerTournament(
  userId: string,
  tournamentId: string
): Promise<TournamentPlayer | null> {
  const {data, error} = await supabase
    .from('players')
    .select()
    .eq('tournament_id', tournamentId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  if (data.length === 0) {
    return null;
  }

  return data[0];
}

export async function createPlayerTournament(
  body: Omit<TournamentPlayer, 'id'>
): Promise<TournamentPlayer> {
  const {data, error} = await supabase.from('players').insert(body).select();

  if (error) {
    throw error;
  }

  return data[0];
}
export async function updatePlayerTournament(
  body: Partial<TournamentPlayer>
): Promise<TournamentPlayer> {
  const {id, ...player} = body;

  const {data, error} = await supabase
    .from('players')
    .update(player)
    .match({id: id})
    .select();

  if (error) {
    throw error;
  }

  return data[0];
}

export async function deletePlayerTournament(id: number): Promise<void> {
  const {error} = await supabase.from('players').delete().match({id: id});

  if (error) {
    throw error;
  }
}

export async function fetchTournamentPlayer(
  id: string
): Promise<TournamentPlayer | null> {
  const {data, error} = await supabase.from('players').select().eq('id', id);

  if (error) {
    throw error;
  }

  if (data.length === 0) {
    return null;
  }

  return data[0];
}
