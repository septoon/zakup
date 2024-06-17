import './App.css';
import React from 'react'
import Chef from './common/images/chef.png'
import Bar from './common/images/bar.png'
import Grill from './common/images/grill.png'
import House from './common/images/household.png'
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="flex flex-col justify-start items-center pt-20 w-screen h-screen pl-2">
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
    </div>
  );
}

export default App;
