import styles from './styles.module.scss'
import {InputHTMLAttributes, TextareaHTMLAttributes} from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

export function InputNumber({...rest}: InputProps) {
    return (
        <input type='number' className={styles.input} {...rest}/>
    )
}