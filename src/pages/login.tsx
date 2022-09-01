import { FormEvent, FormEventHandler, useEffect, useState } from "react"
import Header from "../components/Layout/Header";
import { PageTitle } from "../components/Typography";
import {signUp } from "../utils/supabase";

import { useForm } from "react-hook-form";


export default function Login() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm();

  async function onSubmit(data:any) {
    await signUp(data.email);
    reset();
  }

  return <main>
    <Header />

    <div className="container mx-auto px-4 mt-6">

      <PageTitle>Register your decklists for 4Seasons Summer!</PageTitle>


      <p className="text-xl">Enter your email and receive an invite link to manage your decklists.</p>
      <p className="text-lg"><span className="italic">Caution:</span> Accounts are individual, so you can&apos;t submit more than one decklist per tournament.</p>


      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block font-bold text-lg">Enter your email:</label>
        <input type="email" {...register("email", { required: true })} />
        {errors.email && <p className="text-red-700">Email is required</p>}
        <br />
        <button disabled={isSubmitting} className="button">{isSubmitting ? 'Sending...' : 'Invite me!'}</button>
      </form>

      {isSubmitSuccessful && <p className="text-green-700 font-bold">Email sent!</p>}
    </div>
    </main>
}