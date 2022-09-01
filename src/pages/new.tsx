import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import DecklistForm from "../components/DecklistForm";
import { PageTitle } from "../components/Typography";
import { createNewDecklist, getCurrentRequiredUser, getCurrentUser } from "../utils/supabase";

export default function NewDecklist() {
  const router = useRouter();

  const onSubmit:SubmitHandler<DecklistForm> = async data => {
    await createNewDecklist(data);

    setTimeout(() => {
      router.push('/');
    }, 2000)
  }

  return (
    <div className="container mx-auto mt-6 px-4">
      <PageTitle>Nuova decklist</PageTitle>
      <DecklistForm onSubmit={onSubmit} />
    </div>
  )
}