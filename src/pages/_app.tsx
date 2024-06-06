import '../../styles/global.scss'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'

import { Poppins } from 'next/font/google'

import { AuthProvider } from '../contexts/AuthContext'

const roboto = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
      <ToastContainer autoClose={2000} />
    </AuthProvider> 
  )
}
