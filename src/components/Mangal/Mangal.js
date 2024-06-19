import React from 'react'
import { Link } from 'react-router-dom'

const Mangal = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex justify-start items-center pl-5 h-16 text-blue font-semibold'>
        <Link to='/zakup'>Назад</Link>
      </div>
      <h1>Mangal</h1>
    </div>
  )
}

export default Mangal