import { useEffect, useState } from "react";
import type { DraftExpense } from "../types";
import type { Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
    const [expense, setExpense]  = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })

    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmount] = useState(0)
    const { dispatch, state, remainingBudget} = useBudget()

    useEffect(()=>{
        if(state.editingId){
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    },[state.editingId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value
        })
        
    }

    const handleChangeDate = (value : Value ) => {
        setExpense({
            ...expense,
            date: value
        })
        
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //Validar
        if(Object.values(expense).includes('')){
            setError('Todos los campos son obligatorios')
            return 
        }

        // Validar que no me pase del limite
        if((expense.amount - previousAmount) > remainingBudget){
            setError('Ese gasto se sale del saldo disponible')
            return 
        }

        //Agregar o actualizar un gasto

        if(state.editingId){
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
        }else{
            dispatch({type: 'add-expense', payload: {expense}})
        }

        //reinicar State
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date(),
        })
        setPreviousAmount(0)
        
    }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <legend className="uppercase text-center text-2xl font-black border-b-2 border-indigo-500 py-2"
        >
        {state.editingId ? 'Editar Gasto': 'Nuevo Gasto' }    
        </legend>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="expenseName"
                className="text-xl"
            >
                Nombre de Gasto:
            </label>
            <input 
                type="text" 
                id="expenseName"
                placeholder="Añade el Nombre del Gasto"
                className="bg-slate-100 p-2"
                name="expenseName"
                value={expense.expenseName}
                onChange={handleChange}
                
            />
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="amount"
                className="text-xl"
            >
                Cantidad:
            </label>
            <input 
                type="number" 
                id="amount"
                placeholder="Añade la cantidad del gasto: Ej. 300"
                className="bg-slate-100 p-2"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="category"
                className="text-xl"
            >
                Categoría:
            </label>
            <select 
                id="category"
                className="bg-slate-100 p-2"
                name="category"
                onChange={handleChange}
            >
                <option value="">-- Seleccione --</option>
                {categories.map(category => (
                    <option 
                        key={category.id}
                        value={category.id}
                    >{category.name}</option>
                ))}
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="date"
                className="text-xl"
            >
                Fecha Gasto:
            </label>
            <DatePicker
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>
        <input 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-800 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
            value={state.editingId ? 'Editar Gasto': 'Nuevo Gasto' } 
        />
    </form>
  )
}
