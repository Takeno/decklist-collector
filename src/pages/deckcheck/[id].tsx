import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWR from "swr";
import { fetchList, updateDecklist } from "../../utils/supabase";
import DecklistForm from "../../components/DecklistForm";
import { PageTitle } from "../../components/Typography";
import { parseList } from "../../utils/decklist";
import Link from "next/link";

export default function ShowDecklist() {
  const router = useRouter();

  const decklistId = router.query.id as string;

  const { data, isValidating } = useSWR('/decklists/' + decklistId, () => fetchList(decklistId));

  if (!data) {
    return <h1>Loading</h1>
  }

  const parsedDecklist = parseList(data.decklist);

  return (
    <div className="container mx-auto mt-6 px-4">
      <Link href="/deckcheck"><a>Back to the list</a></Link>
      <PageTitle>{data.player} {parsedDecklist.maindeck < 60 && <span title="Minimum 60 cards">⚠️</span>}
          {parsedDecklist.maindeck} / {parsedDecklist.sideboard > 15 && <span title="Maximum 15 cards">⚠️</span>} {parsedDecklist.sideboard}</PageTitle>

        <div className="columns-2">
          {[
            'Planeswalker',
            'Creature',
            'Instant',
            'Sorcery',
            'Artifact',
            'Enchantment',
            'Land',
            'Other',
            'Sideboard'
          ].map((type) => {
            if (parsedDecklist.cards.some(c => c.type === type) === false) {
              return null;
            }

            return <div key={type} className="break-inside-avoid-column">
              <h3 className="font-bold text-lg mt-2">
                {type === 'Other' ? <abbr title="Not recognized cards, not a problem">Other</abbr> : type}
              </h3>
              <ul>
                {parsedDecklist.cards.filter(c => c.type === type).map((card, i) => (<li key={i}>{card.amount}x {card.name}</li>))}
              </ul>
            </div>
          })}
        </div>
      </div>
  )
}