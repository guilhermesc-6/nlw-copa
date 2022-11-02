import { FormEvent, useState } from "react";
import Image from "next/image";

import appPreviewImg from "../assets/app-example-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvataresExample from "../assets/avatares-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";

interface HomeProps {
  poolsCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);
      alert(
        "Bolão criado com sucesso, o código foi copiado para a área de tranferência"
      );

      setPoolTitle("");
    } catch (err) {
      console.log(err);
      alert("Erro ao criar o bolão, tente novament!");
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt='Logo' />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvataresExample} alt='' />

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.usersCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex items-center gap-2'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type='text'
            placeholder='Qual nome do seu bolão?'
            required
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className='bg-nlwyellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-nlwyellow-700 transition-colors'
            type='submit'
          >
            CRIAR MEU BOLÃO
          </button>
        </form>

        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between items-center  text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />

            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolsCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />

            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt='Dois celulares mostrando uma prévia do app mobile'
        quality={100}
      />
    </div>
  );
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolsCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: userCountResponse.data.count,
    },
  };
};
