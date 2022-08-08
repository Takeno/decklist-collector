import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWR from "swr";
import { fetchList, updateDecklist } from "../../utils/supabase";
import DecklistForm from "../../components/DecklistForm";
import { PageTitle } from "../../components/Typography";

export default function EditDecklist() {
  const router = useRouter();

  const decklistId = router.query.id as string;

  const {data, isValidating} = useSWR('/decklists/' + decklistId, () => fetchList(decklistId));

  const onSubmit:SubmitHandler<DecklistForm> = async data => {
    await updateDecklist(decklistId, data);

    router.push('/');
  }

  if(!data) {
    return <h1>Boh</h1>
  }

  return (
    <div className="container mx-auto mt-6 px-4">
      <PageTitle>Edit decklist</PageTitle>
      <DecklistForm onSubmit={onSubmit} initialValues={data} />
    </div>
  )
}