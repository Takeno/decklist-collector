import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type {PropsWithChildren} from 'react';
import {supabase} from '../utils/supabase';

type UserContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  logout: () => Promise.resolve(),
});

export const useUser = () => useContext(UserContext);

export const useRequiredUser = (): User => {
  const {user} = useContext(UserContext);

  if (user === null) {
    throw new Error('User required');
  }

  return user;
};

export const useRequiredAdmin = (): User => {
  const user = useRequiredUser();

  if (user.admin === false) {
    throw new Error('Admin required');
  }

  return user;
};

export const useRequiredDeckcheck = (): User => {
  const user = useRequiredUser();

  if (user.admin === false && user.deckcheck === false) {
    throw new Error('Admin required');
  }

  return user;
};

export const UserProvider = ({children}: PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // This need because of https://github.com/supabase/gotrue-js/blob/master/src/GoTrueClient.ts#L183-L188
    // session is replaced if error is present in the url and there is no way to trigger it manually

    // if access_token is present, set session
    if(getParameterByName('access_token')) {
      supabase.auth.setSession({
        access_token: getParameterByName('access_token')!,
        refresh_token: getParameterByName('refresh_token')!,
      });

      window.location.hash = '';

      return;
    }


    supabase.auth.getSession().then(({data: {session}}) => {
      if (session === null) {
        console.info('No session available');
        setLoading(false);
        return;
      }

      console.log(session.user);
      setLoading(false);

      setUser({
        id: session.user.id,
        email: session.user.email!,
        admin: session.user.user_metadata.admin || false,
        deckcheck: session.user.user_metadata.deckcheck || false,
      });
    });
  }, []);

  useEffect(() => {
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }

      if (session === null) {
        return;
      }

      console.log(event, session.user);
      setUser({
        id: session.user.id,
        email: session.user.email!,
        admin: session.user.user_metadata.admin || false,
        deckcheck: session.user.user_metadata.deckcheck || false,
      });
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    const {error} = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        loading,
        user,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


function getParameterByName(name: string, url?: string) {
  if (!url) url = window?.location?.href || ''
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}