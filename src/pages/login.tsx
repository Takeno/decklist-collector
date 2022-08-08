import { FormEvent, FormEventHandler, useEffect, useState } from "react"
import Header from "../components/Layout/Header";
import { PageTitle } from "../components/Typography";
import {signUp } from "../utils/supabase";

import { useForm } from "react-hook-form";


export default function Login() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm();

  async function onSubmit(data:any) {
    await signUp(data.email);
    reset();
  }

  return <main>
    <Header />
    <div className="container mx-auto px-4 mt-6 flex flex-col justify-center items-center">

      <PageTitle>Login</PageTitle>

      <p>You will receive an email with a confirmation link to manage your decklists.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block font-bold text-lg">Insert your email:</label>
        <input type="email" {...register("email", { required: true })} />
        {errors.email && <p className="text-red-700">Email is required</p>}
        <br />
        <button disabled={isSubmitting}>Login</button>
      </form>

      {isSubmitSuccessful && <p className="text-green-700 font-bold">Email sent!</p>}
    </div>
    </main>
}