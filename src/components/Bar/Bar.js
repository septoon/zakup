import React from 'react';
import Template from '../Template';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';

const Bar = () => {
  const navigate = useNavigate();

  return (
    <div className="section-screen">
      <header className="section-header">
        <button type="button" onClick={() => navigate('/')} aria-label="Назад">
          <i className="pi pi-arrow-left" aria-hidden="true" />
        </button>
        <div>
          <span>Раздел</span>
          <h1>Бар</h1>
        </div>
      </header>
      <Template sectionSource="bar" />
    </div>
  );
};

export default withOrderProps(Bar);
