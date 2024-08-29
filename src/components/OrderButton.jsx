import React, { useState } from 'react';
import './OrderButton.css';
import logo from '../common/images/shd-logo-mini.png'

const OrderButton = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 10000);
  };

  return (
    <button className={`order ${isAnimating ? 'animate' : ''}`} onClick={handleClick}>
      <span className="default">Заказать</span>
      <span className="success">
        Заказ оформлен <svg viewBox="0 0 12 10" xmlns="http://www.w3.org/2000/svg">
          <polyline points="1.5 6 4.5 9 10.5 1" fill="none" stroke="currentColor" strokeWidth="2"></polyline>
        </svg>
      </span>
      <div className="truck">
        <div className="back">
          <img className='logo-shd' src={logo} alt="logo" />
        </div>
        <div className="front">
          <div className="window"></div>
          <div className="light top"></div>
          <div className="light bottom"></div>
        </div>
      </div>
      <div className="box"></div>
      <div className="lines"></div>
    </button>
  );
};

export default OrderButton;