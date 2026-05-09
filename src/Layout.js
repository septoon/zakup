import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalVisible, selectTotalVisible } from './Redux/totalBtnSlice';
import { createSelector } from 'reselect';
import { selectVegetablesItems } from './Redux/vegetSlice';
import Order from './components/Order';
import { impact } from './common/device';

const selectOrderData = createSelector(
  [selectVegetablesItems],
  (items) => ({ items })
);

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const totalVisible = useSelector(selectTotalVisible);
  const { items } = useSelector(selectOrderData);
  const isPurchasesPage = location.pathname.endsWith('/purchases');

  const handleButtonClick = () => {
    impact();
    dispatch(setTotalVisible(true));
  };
  
  const buttonLabel = `Итог${items.length ? ` (${items.length})` : ''}`;

  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet />
      </main>
      {!isPurchasesPage && (
        <>
          <Order totalVisible={totalVisible} />
          <div className="bottom-action-bar">
            {totalVisible ? (
              <button
                className="primary-action"
                type="button"
                onClick={() => {
                  impact();
                  dispatch(setTotalVisible(false));
                }}
              >
                Свернуть
              </button>
            ) : (
              <button
                className="primary-action"
                type="button"
                onClick={handleButtonClick}
              >
                {buttonLabel}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
