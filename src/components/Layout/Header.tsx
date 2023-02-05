import Link from 'next/link';
import {useRouter} from 'next/router';
import logo from '../../assets/logo-four-seasons.png';
import {useUser} from '../../contexts/UserContext';

export default function Header() {
  const router = useRouter();

  const {user, logout} = useUser();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <header>
      <nav className="bg-gray-900 border-gray-200 px-2 sm:px-4 py-2.5">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link href="/">
            <a className="flex items-center">
              <img src={logo.src} className="mr-3 h-6 sm:h-9" alt="4Seasons" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
                4Seasons
              </span>
            </a>
          </Link>

          <div className="flex flex-row">
            {user?.admin && (
              <div className="" id="navbar-default">
                <Link href="/admin">
                  <a className="block py-2 pr-4 pl-3 text-white">Admin</a>
                </Link>
              </div>
            )}
            {user?.deckcheck && (
              <div className="" id="navbar-default">
                <Link href="/deckcheck">
                  <a className="block py-2 pr-4 pl-3 text-white">Deckcheck</a>
                </Link>
              </div>
            )}
            {user && (
              <div className="" id="navbar-default">
                <button
                  onClick={handleLogout}
                  className="block py-2 pr-4 pl-3 text-white"
                >
                  Logout
                </button>
              </div>
            )}
            <div className="" id="navbar-default">
              <a
                href="mailto:Legacy4Seasons@gmail.com"
                className="block py-2 pr-4 pl-3 text-white"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
