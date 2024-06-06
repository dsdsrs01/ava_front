import { FormEvent, useState, useEffect } from 'react'
import Head from "next/head"
import { BiArrowBack } from 'react-icons/bi'
import { BsCheck } from 'react-icons/bs'

import Router from 'next/router'
import { useRouter } from 'next/router'

import { Header } from '../../components/header/index'
import { Input } from '../../components/ui/Input/index'
import styles from './styles.module.scss'
import { canSSRAuth } from "@/utils/canSSRAuth"
import { setupAPIClient } from "@/services/api"
import { toast } from 'react-toastify'

type RemedyProps = {
    id: string;
    name: string;
    class: string;
    count: string;
}

interface HomeProps {
    orders: RemedyProps[];
}

export default function Edit({ orders }: HomeProps) {
    const [ orderList, setOrderList ] = useState(orders || []);
    const [ data, setData ] = useState<RemedyProps>();

    const router = useRouter()
    const id = router.query.remedy;

    const [name, setName] = useState(data?.name);
    const [category, setCategory] = useState(data?.class);
    const [count, setCount] = useState(data?.count);

    async function handleEdit(event: FormEvent) {
        event.preventDefault();
        const apiClient = setupAPIClient();

        const response = await apiClient.put(`/remedy/edit?remedy_id=${id}`, {
            name: name,
            category: category,
            count: count
        })

        setOrderList(response.data) 
        toast.success('Card alterado com sucesso!')
        Router.push('/')
    }

    async function handleBack(event: FormEvent) {
        event.preventDefault();
    
        Router.push('/dashboard')
    }

    useEffect(() => {
        async function loadInfo() {
            const apiClient = setupAPIClient();

            console.log(id)
            const response = await apiClient.put(`/remedy/edit?remedy_id=${id}`)

            setData(response.data);
        }

        loadInfo();
    })

    return(
        <>
            <Head>
                <title>Painel editar card</title>
            </Head>

            <Header />
            <div className={styles.boxContent}>          
                        <div className={styles.boxContainer}>
                            <form onSubmit={handleEdit}>
                                <h1>EDITAR CARD</h1>
                                <p>Nome: <strong>{data?.name}</strong></p>
                                <Input value={name} onChange={(e) => setName(e.target.value)}/>
                                <p>Categoria:  <strong>{data?.class}</strong></p>
                                <Input value={category} onChange={(e) => setCategory(e.target.value)}/>
                                <p>Count: <strong>{data?.count}</strong></p>
                                <Input value={count} onChange={(e) => setCount(parseInt(e.target.value))}/>
                                <button>
                                    <BsCheck size={20} />
                                    Concluir Edicao
                                </button>
                                <button onClick={handleBack}>
                                    <BiArrowBack  size={15} />
                                    Voltar
                                </button>
                            </form>  
                        </div>      
            </div>
        </>
    )
}

//Server side
export const getServerSideProps = canSSRAuth(async (context) => {
    const apiClient = setupAPIClient(context);

    const response = await apiClient.get('/remedy')
    //console.log(response.data);

    return {
        props: {
            orders: response.data
        }
    }
})