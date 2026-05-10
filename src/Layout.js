import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalVisible, selectTotalVisible } from './Redux/totalBtnSlice';
import { createSelector } from 'reselect';
import { selectVegetablesItems } from './Redux/vegetSlice';
import { fetchCatalog } from './Redux/catalogSlice';
import Order from './components/Order';
import { impact } from './common/device';
import { CATALOG_ADD_EVENT, CATALOG_SECTION_BY_PATH } from './common/catalogSchema';
import { useAdminAccess } from './common/useAdminAccess';

const selectOrderData = createSelector(
  [selectVegetablesItems],
  (items) => ({ items })
);

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const shellRef = useRef(null);

  const totalVisible = useSelector(selectTotalVisible);
  const { items } = useSelector(selectOrderData);
  const isAdmin = useAdminAccess();
  const isPurchasesPage = location.pathname.endsWith('/purchases');
  const catalogSection = CATALOG_SECTION_BY_PATH[location.pathname];

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      shellRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    scrollToTop();
    window.requestAnimationFrame(scrollToTop);
  }, [location.pathname]);

  const handleButtonClick = () => {
    impact();
    dispatch(setTotalVisible(true));
  };

  const handleAddClick = () => {
    if (!catalogSection) {
      return;
    }

    impact();
    window.dispatchEvent(new CustomEvent(CATALOG_ADD_EVENT, {
      detail: { section: catalogSection },
    }));
  };
  
  const buttonLabel = `Итог${items.length ? ` (${items.length})` : ''}`;

  return (
    <div className="app-shell" ref={shellRef}>
      <main className="app-content">
        <Outlet />
      </main>
      {!isPurchasesPage && (
        <>
          <Order totalVisible={totalVisible} />
          <div className={`bottom-action-bar ${isAdmin && catalogSection && !totalVisible ? 'bottom-action-bar--split' : ''}`}>
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
            ) : isAdmin && catalogSection ? (
              <>
                <button
                  className="secondary-action"
                  type="button"
                  onClick={handleAddClick}
                >
                  Добавить
                </button>
                <button
                  className="primary-action"
                  type="button"
                  onClick={handleButtonClick}
                >
                  {buttonLabel}
                </button>
              </>
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
