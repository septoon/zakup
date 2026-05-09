import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTotalVisible, setTotalVisible } from '../Redux/totalBtnSlice';

const withOrderProps = (WrappedComponent) => {
  return (props) => {
    const totalVisible = useSelector(selectTotalVisible);
    const dispatch = useDispatch();

    const handleHide = () => {
      dispatch(setTotalVisible(false));
    };

    return <WrappedComponent totalVisible={totalVisible} onHide={handleHide} {...props} />;
  };
};

export default withOrderProps;