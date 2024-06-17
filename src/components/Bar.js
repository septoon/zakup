import React from 'react'
import { Link } from 'react-router-dom'

const Bar = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex justify-start pl-3'>
        <Link to='/zakup'>Назад</Link>
      </div>
      <h1>Bar</h1>
    </div>
  )
}

export default Bar