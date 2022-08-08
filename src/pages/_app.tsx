import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Login from './login';
import { useSupabaseUser } from '../utils/supabase';
import Header from '../components/Layout/Header';

function MyApp({ Component, pageProps }: AppProps) {
  const user = useSupabaseUser();

  if(user === null) {
    return <Login />
  }

  return <main>

    <Header />
    <Component {...pageProps} />


</main>
}

export default MyApp
