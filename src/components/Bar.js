import React from 'react'
import { Link } from 'react-router-dom'
import Vegetables from './Vegetables'

const Bar = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex justify-start items-center pl-5 h-16 text-blue font-semibold'>
        <Link to='/zakup'>Назад</Link>
      </div>
      <Vegetables />
    </div>
  )
}

export default Bar