import './App.css';
import React from 'react'
import Chef from './common/images/chef.png'
import Bar from './common/images/bar.png'
import Grill from './common/images/grill.png'
import House from './common/images/household.png'
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen pl-2">
      <Link to='/kitchen' className='w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver rounded-lg'>
        <img src={Chef} className='h-5 mr-3' alt='kitchen'/>
        Кухня
      </Link>
      <Link to='/bar' className='w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver rounded-lg'>
        <img src={Bar} className='h-5 mr-3' alt='bar'/>
        Бар
      </Link>
      <Link to='/mangal' className='w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver rounded-lg'>
        <img src={Grill} className='h-5 mr-3' alt='grill'/>
        Мангал
      </Link>
      <Link to='/house' className='w-[80%] h-20 flex justify-start pl-5 items-center bg-silver rounded-lg'>
        <img src={House} className='h-5 mr-3' alt='household'/>
        Хоз товары
      </Link>
    </div>
  );
}

export default App;
