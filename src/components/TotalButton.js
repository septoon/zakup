import React from 'react'
import { useDispatch } from 'react-redux';
import { setTotalVisible } from '../Redux/totalBtnSlice';
import { MainButton } from '@twa-dev/sdk/react';


const TotalButton = () => {
  const dispatch = useDispatch()

  const show = () => {
    dispatch(setTotalVisible(true))
  };

  return (
    <>
      <MainButton label="Итог" onClick={() => show('bottom')} />
    </>
  )
}

export default TotalButton
