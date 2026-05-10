import React from 'react';
import Template from '../Template';
import { mangalData } from '../../common/data/mangal/mangalData';
import { vegetablesData } from '../../common/data/mangal/vegetablesData';
import { duzinaData } from '../../common/data/mangal/duzinaData';
import { lyudaData } from '../../common/data/mangal/lyudaData';
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
      <Template
        sectionSource="mangal"
        mangalData={mangalData}
        vegetablesData={vegetablesData}
        duzinaData={duzinaData}
        lyudaData={lyudaData}
      />
    </div>
  );
};

export default withOrderProps(Mangal);
