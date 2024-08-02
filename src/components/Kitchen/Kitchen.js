import React from 'react';
import Template from '../Template';
import { vegetablesData } from '../../common/data/kitchen/vegetablesData';
import { duzinaData } from '../../common/data/kitchen/duzinaData';
import Order from '../Order';
import withOrderProps from '../withOrderProps';
import { useNavigate } from 'react-router-dom';
import { BackButton, MainButton } from '@twa-dev/sdk/react';
import { useDispatch } from 'react-redux';
import { setTotalVisible } from '../../Redux/totalBtnSlice';

const Kitchen = ({ totalVisible, onHide }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const show = () => {
    dispatch(setTotalVisible(true))
  };
  return (
    <div className="flex flex-col relative overflow-y-hidden">
      <Template vegetablesData={vegetablesData} duzinaData={duzinaData} />
      {!totalVisible && (<MainButton text='Итог' onClick={() => show('bottom')} />)}
      <Order totalVisible={totalVisible} isVisible={onHide} />
      <BackButton onClick={() => navigate('/zakup')} />
    </div>
  );
};

export default withOrderProps(Kitchen);