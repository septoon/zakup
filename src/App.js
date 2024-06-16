import './App.css';
import Chef from './common/images/chef.png'
import Bar from './common/images/bar.png'
import Grill from './common/images/grill.png'

function App() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen pl-2">
      <div className='w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver rounded-lg'>
        <img src={Chef} className='h-5 mr-3' alt='kitchen'/>
        Кухня
      </div>
      <div className='w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver rounded-lg'>
        <img src={Bar} className='h-5 mr-3' alt='bar'/>
        Бар
      </div>
      <div className='w-[80%] h-20 flex justify-start pl-5 items-center bg-silver rounded-lg'>
        <img src={Grill} className='h-5 mr-3' alt='grill'/>
        Мангал
      </div>
    </div>
  );
}

export default App;
