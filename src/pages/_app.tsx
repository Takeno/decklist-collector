import '../styles/globals.css';
import type {AppProps} from 'next/app';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import {UserProvider, useUser} from '../contexts/UserContext';
import {PropsWithChildren, useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';

export default function MyApp({Component, pageProps, router}: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to Impact Returns!</title>
        <meta
          name="description"
          content="Register, pay and upload your decklist fully online"
        />
      </Head>
      <UserProvider>
        <PrivateChecker priv={router.asPath.includes('login') === false}>
          <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flexe flex-1">
              <Component {...pageProps} />
            </div>
            <Footer />
          </main>
        </PrivateChecker>
      </UserProvider>
    </>
  );
}

const PrivateChecker = ({
  priv,
  children,
}: PropsWithChildren<{priv: boolean}>) => {
  const {user, loading} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (priv && user === null) {
      router.replace('/login');
    }
  }, [priv, loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (priv && user === null) {
    return <div>Missing authentication</div>;
  }

  return <div>{children}</div>;
};
