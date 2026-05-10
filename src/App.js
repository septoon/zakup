import './App.css';
import React, { useEffect, useState } from 'react';
import Chef from './common/images/chef.png';
import Bar from './common/images/bar.png';
import Grill from './common/images/grill.png';
import House from './common/images/household.png';
import { Link } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVegetables,
  selectCurrentDate,
  selectVegetablesItems,
  setCurrentDate,
} from './Redux/vegetSlice';
import { impact, prepareWebApp } from './common/device';
import {
  ADMIN_PIN_ENV,
  grantAdminAccess,
  hasAdminAccess,
  revokeAdminAccess,
} from './common/adminAccess';
import {
  formatDateLabel,
  getMsUntilNextPurchaseRollover,
  getPurchaseDateKey,
} from './common/purchaseDate';

const categories = [
  {
    to: '/kitchen',
    title: 'Кухня',
    description: 'Овощи, зелень, дюжина',
    image: Chef,
    accent: 'category-card--green',
  },
  {
    to: '/bar',
    title: 'Бар',
    description: 'Барные позиции и расходники',
    image: Bar,
    accent: 'category-card--blue',
  },
  {
    to: '/mangal',
    title: 'Мангал',
    description: 'Мясо и позиции для жарки',
    image: Grill,
    accent: 'category-card--red',
  },
  {
    to: '/house',
    title: 'Хоз товары',
    description: 'Бытовые и сервисные мелочи',
    image: House,
    accent: 'category-card--amber',
  },
];

function App() {
  const dispatch = useDispatch();
  const selectedItems = useSelector(selectVegetablesItems);
  const currentDate = useSelector(selectCurrentDate);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [adminVisible, setAdminVisible] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdmin, setIsAdmin] = useState(hasAdminAccess);

  useEffect(() => {
    dispatch(setCurrentDate(getPurchaseDateKey()));
    dispatch(fetchVegetables());
    prepareWebApp();
  }, [dispatch]);

  useEffect(() => {
    const syncPurchaseDate = () => {
      dispatch(setCurrentDate(getPurchaseDateKey()));
      dispatch(fetchVegetables());
    };
    const timeoutId = window.setTimeout(syncPurchaseDate, getMsUntilNextPurchaseRollover() + 1000);
    const intervalId = window.setInterval(syncPurchaseDate, 60 * 60 * 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const onLinkClick = () => {
    impact();
  };

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const handleAdminSubmit = (event) => {
    event.preventDefault();

    if (isAdmin) {
      revokeAdminAccess();
      setIsAdmin(false);
      setAdminPin('');
      setAdminError('');
      setAdminVisible(false);
      return;
    }

    const expectedPin = process.env.REACT_APP_ADMIN_PIN;

    if (!expectedPin) {
      setAdminError(`Добавьте ${ADMIN_PIN_ENV} в .env.local и перезапустите dev server`);
      return;
    }

    if (adminPin.trim() !== expectedPin.trim()) {
      setAdminError('Неверный PIN');
      return;
    }

    grantAdminAccess();
    setIsAdmin(true);
    setAdminPin('');
    setAdminError('');
    setAdminVisible(false);
  };

  return (
    <div className="home-screen">
      <div className="home-hero">
        <div className="home-hero-copy">
          <p className="home-caption">Шашлычный дом</p>
          <div className="home-title-row">
            <h1>Закуп</h1>
            <button
              className={`admin-button ${isAdmin ? 'admin-button--active' : ''}`}
              type="button"
              onClick={() => {
                impact();
                setAdminVisible(true);
              }}
              aria-label="Админ"
            >
              <i className="pi pi-user" aria-hidden="true" />
            </button>
          </div>
          <p className="home-subtitle">Соберите позиции по цехам и отправьте итоговый список.</p>
        </div>
      </div>

      <section className="home-summary" aria-label="Сводка">
        <div>
          <span>{selectedItems.length}</span>
          <p>позиций в заявке</p>
        </div>
        <div>
          <span>на {formatDateLabel(currentDate).replace(/\sг\.$/, '')}</span>
          <p>дата закупа</p>
        </div>
      </section>

      {isAdmin && (
        <Link to="/purchases" className="all-purchases-tab" onClick={onLinkClick}>
          <span>
            <i className="pi pi-list-check" aria-hidden="true" />
            Все закупы
          </span>
          <i className="pi pi-chevron-right" aria-hidden="true" />
        </Link>
      )}

      <section className="category-grid" aria-label="Разделы закупа">
        {categories.map((category) => (
          <Link
            key={category.to}
            to={category.to}
            onClick={onLinkClick}
            className={`category-card ${category.accent}`}
          >
            <span className="category-icon">
              <img src={category.image} alt="" />
            </span>
            <span className="category-copy">
              <strong>{category.title}</strong>
              <small>{category.description}</small>
            </span>
            <i className="pi pi-chevron-right" aria-hidden="true" />
          </Link>
        ))}
      </section>

      {installPrompt && (
        <button className="install-card" type="button" onClick={handleInstall}>
          <i className="pi pi-mobile" aria-hidden="true" />
          <span>Установить на экран</span>
        </button>
      )}

      <Dialog
        header="Админ"
        visible={adminVisible}
        position="bottom"
        style={{ width: 'min(90vw, 440px)' }}
        onHide={() => {
          setAdminVisible(false);
          setAdminError('');
          setAdminPin('');
        }}
        dismissableMask
        draggable={false}
        resizable={false}
      >
        <form className="admin-form" onSubmit={handleAdminSubmit}>
          {isAdmin ? (
            <p className="admin-form__status">Админ-доступ уже включен</p>
          ) : (
            <>
              <label>
                <span>PIN код</span>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={adminPin}
                  onChange={(event) => {
                    setAdminPin(event.target.value);
                    setAdminError('');
                  }}
                  autoFocus
                />
              </label>
              {adminError && <p>{adminError}</p>}
            </>
          )}
          <button type="submit">{isAdmin ? 'Выйти' : 'Войти'}</button>
        </form>
      </Dialog>

    </div>
  );
}

export default App;
