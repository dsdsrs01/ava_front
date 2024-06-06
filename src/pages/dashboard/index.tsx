
import { FormEvent, useState } from 'react'
import Router from 'next/router'
import Head from "next/head"

import styles from './styles.module.scss'
import { Header } from '../../components/header/index'
import { canSSRAuth } from '../../utils/canSSRAuth'

import { FaPlus } from 'react-icons/fa'
import { MdDownload } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BiSearchAlt  } from 'react-icons/bi'
import { Input } from '../../components/ui/Input/index'

import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'
import { FaPencilRuler, FaTrash } from 'react-icons/fa'

type RemedyProps = {
    id: string;
    name: string;
    class: string;
    count: string;
}

interface HomeProps {
    orders: RemedyProps[];
}

export default function Dashboard({ orders }: HomeProps) {
    const [ isHidden, setIsHidden ] = useState(false)
    const [ isHiddenEdit, setIsHiddenEdit ] = useState(true)

    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [count, setCount] = useState('')
    const [orderList, setOrderList] = useState(orders || [])
    const [ search, setSearch ] = useState('');
    
    //100% const de busca
    const searchFiltrado = 
        orderList.filter(({ name }) => 
            name.toLowerCase().includes(search.toLowerCase()));

    //Function 100%
    function visibility() {
        setIsHidden(!isHidden);
        console.log(isHidden)
    }

    // Function 100%
    async function handleRegisterRemedy(event: FormEvent) {
        event.preventDefault();

        if(name == '' || category === '') {
            return;
        }

        
        const apiClient = setupAPIClient();
        await apiClient.post('/remedy', {
            name: name,
            category: category,
            count: count
        })

        
        toast.success('Remedio cadastrado com sucesso!')
        setName('')
        setCategory('')
        setCount('')
    }

    //Function 100%
    async function handleDeleteRemedy(id: string) {
        const apiClient = setupAPIClient();

        await apiClient.delete(`/remedy?remedy_id=${id}`);

        const response = await apiClient.get('/remedy');
        setOrderList(response.data);

        toast.success('Deletado com sucesso!');
    }

    async function handleEditRemedy(id: string) {
        const apiClient = setupAPIClient();

        await apiClient.put(`/remedy/edit/?remedy_id=${id}`)
        //await apiClient.put(`/remedy?remedy_id=${id}`)

        const response = await apiClient.put(`/remedy/edit/?remedy_id=${id}`);
        console.log(response.data);

        Router.push(`/remedy/?remedy=${id}`)
    }

    //Fuction 100%
    async function handleRefresh() {
        const apiClient = setupAPIClient();

        const response = await apiClient.get('/remedy');
        setOrderList(response.data);

        toast.warning('Atualizado com sucesso!')
    }

    const divStyle = {
        display: isHidden ? 'none' : 'block'
    }
    const sectionStyle = {
        display: isHiddenEdit ? 'none' : 'block'
    }

    return (
        <>
        <Head>
            <title>Painel Dashboard</title>
        </Head>

        <Header />
        <div className={styles.boxContent}>   
            <div className={styles.topIconsAddAndActualizar}>
                <h1>Lista de remedios</h1>
                <div className={styles.plus}>
                <div className={styles.separeteButton}>
                    <button onClick={visibility} style={divStyle}>
                        <FaPlus color='#FFF' size={30}/>
                    </button>
                    <button onClick={handleRefresh} style={divStyle}>
                        <MdDownload color='#FFF' size={30}/>
                    </button>
                </div>  
                {
                    isHidden 
                    ?
                    <>
                    <div className={styles.boxContentFormRemedy}>
                        <button className={styles.buttonPlus} onClick={visibility}>
                            <AiFillCloseCircle size={30} color='#808080'/>
                        </button>
                        <form onSubmit={handleRegisterRemedy}>
                            <Input
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                placeholder="Classe"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <Input
                                placeholder="Quantidade"
                                type="number"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value))}
                            />
                            <button>
                                Cadastrar
                            </button>
                        </form>
                    </div>
                    </>
                    :
                    null
                }
            </div> 
        </div>
        <div className={styles.boxSearch}>
            <BiSearchAlt size={20} color='gray' className={styles.BiSearchAlt}/>
            <Input placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
        <div className={styles.boxCard}>
            <div className={styles.cardBox}>
                    {searchFiltrado.map(item => (
                        <section key={item.id} className={styles.boxContainer} >
                            <div className={styles.boxText}>
                                <p className={styles.titulo}>{item.name}</p>
                                <p>{item.class}</p>
                                <p>Quantidade: <span>{item.count}</span></p>
                            </div>
                            <div className={styles.boxButton}>
                                <button onClick={() => handleEditRemedy(item.id)} className={styles.editar}>
                                    Editar
                                    <span><FaPencilRuler /></span>
                                </button>
                                <button onClick={() => handleDeleteRemedy(item.id)} className={styles.deletar}>
                                    Excluir
                                    <span><FaTrash /></span>
                                </button>
                            </div>
                        </section>     
                    ))}
                </div>
        </div>
            {/* Card */}
          </div>
        </>
    )
}

//Server side
export const getServerSideProps = canSSRAuth(async (context) => {
    const apiClient = setupAPIClient(context);

    const response = await apiClient.get('/remedy')

    return {
        props: {
          orders:  response.data 
        }
    }
})