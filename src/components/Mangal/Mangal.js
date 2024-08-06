import React from 'react';
import Template from '../Template';
import { mangalData } from '../../common/data/mangal/mangalData';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';

const Mangal = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col  w-[95%] overflow-y-hidden">
      <Template mangalData={mangalData} />
      <BackButton onClick={() => navigate('/zakup')} />
    </div>
  );
};

export default withOrderProps(Mangal);