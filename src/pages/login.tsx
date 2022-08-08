import { FormEvent, FormEventHandler, useEffect, useState } from "react"
import Header from "../components/Layout/Header";
import { PageTitle } from "../components/Typography";
import {signUp } from "../utils/supabase";


export default function Login() {
  const [email, setEmail] = useState('');

  function handleSubmit(e:FormEvent) {
    e.preventDefault();

    signUp(email);
  }

  return <main>
    <Header />
    <div className="container mx-auto px-4 mt-6 flex flex-col justify-center items-center">

      <PageTitle>Login</PageTitle>

      <p>You will receive an email with a confirmation link to manage your decklists.</p>

      <form onSubmit={handleSubmit}>
        <label className="block font-bold text-lg">Insert your email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <br />
        <button>Login</button>
      </form>
    </div>
    </main>
}