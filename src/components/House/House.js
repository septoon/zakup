import React from 'react';
import { Link } from 'react-router-dom';
import Template from '../Template';
import { houseData } from '../../common/data/house/houseData';
import TotalButton from '../TotalButton';
import Order from '../Order';
import withOrderProps from '../withOrderProps';

const House = ({ totalVisible, onHide }) => {
  return (
    <div className="flex flex-col relative overflow-y-hidden">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <Template houseData={houseData} />
      <TotalButton />
      <Order totalVisible={totalVisible} isVisible={onHide} />
    </div>
  );
};

export default withOrderProps(House);