import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import Template from '../Template'
import { mangalData } from '../../common/data/mangal/mangalData'
import { clearItems } from '../../Redux/vegetSlice'

const Mangal = () => {
  const dispatch = useDispatch();
  const { items } = useSelector(({ vegetables }) => ({
    items: vegetables.items
  }));

  const handleSend = () => {
    console.log(items);
    dispatch(clearItems());
    localStorage.removeItem('selectedItem');
    localStorage.removeItem('selectedItems');
  };

  return (
    <div className='flex flex-col relative'>
      <div className='flex justify-start items-center pl-5 h-16 text-blue font-medium'>
        <Link to='/zakup'>Назад</Link>
      </div>
      <Template mangalData={mangalData} />
      <div className='w-full px-5 fixed bottom-3'>
        <Button label="Отправить" onClick={handleSend} className="bg-blue w-full text-white py-3 rounded-lg" />
      </div>
    </div>
  )
}

export default Mangal