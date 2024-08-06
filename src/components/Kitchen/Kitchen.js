import React from 'react';
import Template from '../Template';
import { vegetablesData } from '../../common/data/kitchen/vegetablesData';
import { duzinaData } from '../../common/data/kitchen/duzinaData';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';

const Kitchen = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-[95%] overflow-y-hidden">
      <Template vegetablesData={vegetablesData} duzinaData={duzinaData} />
      <BackButton onClick={() => navigate('/zakup')} />
    </div>
  );
};

export default withOrderProps(Kitchen);