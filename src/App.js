import './App.css';
import React, { useEffect, useState } from 'react'
import Chef from './common/images/chef.png'
import Bar from './common/images/bar.png'
import Grill from './common/images/grill.png'
import House from './common/images/household.png'
import { Link } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress } from './Redux/addressSlice';

function App() {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const { address } = useSelector(({ addressSelection }) => ({
    address: addressSelection.address
  }))

  useEffect(() => {
    address === '' ? setVisible(true) : setVisible(false)
  }, [])

  const selectAddress = (adr) => {
    dispatch(addAddress(adr))
    setVisible(false)
  }

  return (
    <div className="flex flex-col justify-start items-center pt-10 w-screen h-screen pl-2">
      <div onClick={() => setVisible(true)} className='w-[80%] h-20 flex justify-between px-5 items-center mb-5 bg-silver dark:bg-darkGray rounded-lg'>
        <span className='dark:text-white'>Закуп для кафе: </span>
        <span className='dark:text-white font-bold underline cursor-pointer'>{address}</span>
      </div>
      <Link to='/kitchen' className='w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver dark:bg-darkGray rounded-lg'>
        <img src={Chef} className='h-5 mr-3' alt='kitchen'/>
        <span className='dark:text-white'>Кухня</span>
      </Link>
      <Link to='/bar' className='w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver dark:bg-darkGray rounded-lg'>
        <img src={Bar} className='h-5 mr-3' alt='bar'/>
        <span className='dark:text-white'>Бар</span>
      </Link>
      <Link to='/mangal' className='w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver dark:bg-darkGray rounded-lg'>
        <img src={Grill} className='h-5 mr-3' alt='grill'/>
        <span className='dark:text-white'>Мангал</span>
      </Link>
      <Link to='/house' className='w-[80%] h-20 flex justify-start pl-5 items-center bg-silver dark:bg-darkGray rounded-lg'>
        <img src={House} className='h-5 mr-3' alt='household'/>
        <span className='dark:text-white'>Хоз товары</span>
      </Link>
      <Dialog header="Выберите кафе:"
        visible={visible}
        position={'bottom'}
        style={{ width: '95vw' }}
        onHide={() => { if (!visible) return; setVisible(false); }}
        draggable={false}
        resizable={false} >
          <div className='flex flex-col'>
            <span className='w-full cursor-pointer mb-3 font-semibold' onClick={() => selectAddress('Ленина')}>Ленина</span>
            <span className='w-full cursor-pointer font-semibold' onClick={() => selectAddress('Парковая')}>Парковая</span>
          </div>
        </Dialog>
    </div>
  );
}

export default App;
