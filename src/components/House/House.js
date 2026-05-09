import React from 'react';
import Template from '../Template';
import { houseData } from '../../common/data/house/houseData';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';

const House = () => {
  const navigate = useNavigate();
  return (
    <div className="section-screen">
      <header className="section-header">
        <button type="button" onClick={() => navigate('/')} aria-label="Назад">
          <i className="pi pi-arrow-left" aria-hidden="true" />
        </button>
        <div>
          <span>Раздел</span>
          <h1>Хоз товары</h1>
        </div>
      </header>
      <Template houseData={houseData} />
    </div>
  );
};

export default withOrderProps(House);
