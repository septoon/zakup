import React from 'react'
import { Link } from 'react-router-dom'
import MangalGoods from './MangalGoods'
import { Button } from 'primereact/button'

const Mangal = () => {
  return (
    <div className='flex flex-col relative'>
      <div className='flex justify-start items-center pl-5 h-16 text-blue font-semibold'>
        <Link to='/zakup'>Назад</Link>
      </div>
      <MangalGoods />
      <div className='w-full px-5 fixed bottom-20'>
        <Button label="Отправить" className="bg-blue w-full text-white py-2 rounded-lg" />
      </div>
    </div>
  )
}

export default Mangal