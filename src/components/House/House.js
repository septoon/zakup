import React from 'react';
import Template from '../Template';
import { houseData } from '../../common/data/house/houseData';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';

const House = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-[95%] overflow-y-hidden">
      <Template houseData={houseData} />
      <BackButton onClick={() => navigate('/zakup')} />
    </div>
  );
};

export default withOrderProps(House);