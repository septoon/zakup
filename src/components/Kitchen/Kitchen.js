import React from 'react';
import { Link } from 'react-router-dom';
import Template from '../Template';
import { vegetablesData } from '../../common/data/kitchen/vegetablesData';
import { duzinaData } from '../../common/data/kitchen/duzinaData';
import TotalButton from '../TotalButton';
import Order from '../Order';
import withOrderProps from '../withOrderProps';

const Kitchen = ({ totalVisible, onHide }) => {
  return (
    <div className="flex flex-col relative overflow-y-hidden">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <Template vegetablesData={vegetablesData} duzinaData={duzinaData} />
      <TotalButton />
      <Order totalVisible={totalVisible} isVisible={onHide} />
    </div>
  );
};

export default withOrderProps(Kitchen);