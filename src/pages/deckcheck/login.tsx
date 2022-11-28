import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {supabase} from '../../utils/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await supabase.auth.signInWithPassword({
      email,
      password,
    });

    router.replace('/deckcheck');
  };

  return (
    <div className="container mx-auto px-4 mt-6 flex flex-col flex-1 justify-center">
      <form onSubmit={(e) => handleSubmit(e)} className="">
        <div>
          <label className="block font-bold text-lg">Email:</label>
          <input
            type="email"
            required
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-bold text-lg">Password:</label>
          <input
            type="password"
            required
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
