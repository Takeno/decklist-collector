import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Login from './login';
import { useSupabaseUser } from '../utils/supabase';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  const user = useSupabaseUser();

  if(user === null) {
    return <main className="min-h-screen flex flex-col">
      <Header />
      <div className='flex flex-1'><Login /></div>
      <Footer />
    </main>
  }

  return <main className="min-h-screen flex flex-col">
    <Header />
    <div className='flex-1'>
      <Component {...pageProps} />
    </div>
    <Footer />

</main>
}

export default MyApp
