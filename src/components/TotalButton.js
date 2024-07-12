import React from 'react'
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { setTotalVisible } from '../Redux/totalBtnSlice';


const TotalButton = () => {
  const dispatch = useDispatch()

  const show = () => {
    dispatch(setTotalVisible(true))
  };

  return (
    <div className='w-full px-5 fixed bottom-5'>
      <Button label="Итог" onClick={() => show('bottom')} className="bg-blue w-full text-white py-3 rounded-lg" />
    </div>
  )
}

export default TotalButton
