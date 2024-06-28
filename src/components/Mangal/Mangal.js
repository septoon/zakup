import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import Template from '../Template'
import { mangalData } from '../../common/data/mangal/mangalData'

const Mangal = () => {
  return (
    <div className='flex flex-col relative'>
      <div className='flex justify-start items-center pl-5 h-16 text-blue font-medium'>
        <Link to='/zakup'>Назад</Link>
      </div>
      <Template mangalData={mangalData} />
      <div className='w-full px-5 fixed bottom-3'>
        <Button label="Отправить" className="bg-blue w-full text-white py-3 rounded-lg" />
      </div>
    </div>
  )
}

export default Mangal