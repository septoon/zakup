import React from 'react';
import Template from '../Template';
import { vegetablesDataBar } from '../../common/data/bar/vegetablesDataBar';
import { duzinaDataBar } from '../../common/data/bar/duzinaDataBar';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';

const Bar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-[95%] overflow-y-hidden">
      <Template vegetablesData={vegetablesDataBar} duzinaData={duzinaDataBar} />
      <BackButton onClick={() => navigate('/zakup')} />
    </div>
  );
};

export default withOrderProps(Bar);