import magicevents from '../../assets/king.png';

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-8 px-4 py-6">
      <div className="container text-white h-full mx-auto">
        <p className="text-md text-center">
          Powered by{' '}
          <a
            className="hover:underline"
            href="https://magic-events.gg?utm_source=decklist&utm_medium=web&utm_campaign=4seasons-autumn"
            target="_blank"
            rel="noreferrer"
          >
            <img src={magicevents.src} className="h-8 inline-block" />{' '}
            magic-events.gg
          </a>
        </p>
      </div>
    </footer>
  );
}
