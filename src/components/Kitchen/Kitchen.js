import React from 'react';
import Template from '../Template';
import { vegetablesData } from '../../common/data/kitchen/vegetablesData';
import { duzinaData } from '../../common/data/kitchen/duzinaData';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';

const Kitchen = () => {
  const navigate = useNavigate();
  return (
    <div className="section-screen">
      <header className="section-header">
        <button type="button" onClick={() => navigate('/')} aria-label="Назад">
          <i className="pi pi-arrow-left" aria-hidden="true" />
        </button>
        <div>
          <span>Раздел</span>
          <h1>Кухня</h1>
        </div>
      </header>
      <Template vegetablesData={vegetablesData} duzinaData={duzinaData} />
    </div>
  );
};

export default withOrderProps(Kitchen);
