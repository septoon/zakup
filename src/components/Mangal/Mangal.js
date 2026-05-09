import React from 'react';
import Template from '../Template';
import { mangalData } from '../../common/data/mangal/mangalData';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';

const Mangal = () => {
  const navigate = useNavigate();
  return (
    <div className="section-screen">
      <header className="section-header">
        <button type="button" onClick={() => navigate('/')} aria-label="Назад">
          <i className="pi pi-arrow-left" aria-hidden="true" />
        </button>
        <div>
          <span>Раздел</span>
          <h1>Мангал</h1>
        </div>
      </header>
      <Template mangalData={mangalData} />
    </div>
  );
};

export default withOrderProps(Mangal);
