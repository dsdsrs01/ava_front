import { useContext, FormEvent, useState } from 'react'
import Head from "next/head"

import styles from "../../styles/home.module.scss"
import { Input } from '../components/ui/Input/index'
import { Button } from '../components/ui/Button/index'
import { toast } from 'react-toastify'

import { AuthContext } from '../contexts/AuthContext'

import { canSSRGuest } from '../utils/canSSRGuest'
import Image from 'next/image'
import logo from '@/assets/Connection_caf.png'

export default function Login() {
  const { signIn } = useContext(AuthContext)
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ loading, setLoading ] = useState(false)

  async function handlelogin(event: FormEvent) {
    event.preventDefault();

    if(email === '' || password === '') {
      toast.warning('Preencha os campos!')
      return;
    }

    setLoading(true)

    let data = {
      email,
      password
    }

    await signIn(data)
    
    setLoading(false)
  }

  return(
    <>
      <Head>
        <title>Social-caf</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image
          src={logo}
          width={230}
          height={220}
          alt="Picture of the author" 
        />
        {/* <h1>Connection</h1>
        <h1>CAF</h1> */}

        <div className={styles.login}>
          <form onSubmit={handlelogin}>
            <Input
              placeholder="Email"
              value={email}
              onChange={ (e) => setEmail(e.target.value)} 
            />
            
            <Input 
              placeholder="Password"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button 
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

//Structure server side, uso por volta o canSSRGuest, para verificar quem esta logado ou nao
//Primeiro renderiza isso aqui, se tiver cookie ele manda para a dashboar, se nao vai pro login
export const getServerSideProps = canSSRGuest(async (context) => {
  return {
    props: {}
  }
})