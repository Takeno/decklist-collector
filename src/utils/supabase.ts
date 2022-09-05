import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabaseUrl = 'https://ezkbsplhdpfqdtdbgiir.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6a2JzcGxoZHBmcWR0ZGJnaWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk1NDQ1MTgsImV4cCI6MTk3NTEyMDUxOH0.uZVn_g8HZufxsCGWO_YFUlgor0tm3JKZwsxaabEJBj0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


export async function signUp(email: string) {
  await supabase.auth.signIn({ email })
}


export function getCurrentUser(): User|null {
  const user = supabase.auth.user();
  if(user === null) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!
  }
}

export function getCurrentRequiredUser() : User {
  const user = getCurrentUser();
  if(user === null) throw new Error('User is null');

  return user;
}

export async function logout():Promise<void> {
  const { error } = await supabase.auth.signOut();

  if(error)
    throw error;
}

export function useSupabaseUser() {
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(getCurrentUser());
      }

      if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    });

    setUser(getCurrentUser());

    return () => {
      authListener?.unsubscribe()
    };
  }, []);

  return user;
}


export async function fetchMyLists():Promise<Decklist[]> {
  const {data, error} = await supabase
    .from('decklists')
    .select();

  if(error) throw error;

  return data;
}

export async function fetchListByTournament(t:string):Promise<Decklist[]> {
  const {data, error} = await supabase
    .from('decklists')
    .select()
    .eq('tournament', t);

  if(error) throw error;

  return data;
}

export async function fetchList(id:string):Promise<Decklist|undefined> {
  const {data, error} = await supabase
    .from('decklists')
    .select()
    .eq('id', id)

  if(error) throw error;

  return data[0];
}

export async function createNewDecklist(decklist:DecklistForm) {
  const {data, error} = await supabase
    .from('decklists')
    .insert({
      created_by: getCurrentRequiredUser().id,
      ...decklist
    }, { returning: 'minimal' });

  if(error) throw error;

  return data;
}

export async function updateDecklist(id:string, decklist:DecklistForm) {
  const { data, error } = await supabase
    .from('decklists')
    .update(decklist)
    .match({ id });

  if(error) throw error;

  return data;
}