const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;
const ROLLOVER_HOUR_MSK = 10;

const getMoscowMs = (date = new Date()) => date.getTime() + MSK_OFFSET_MS;

const getDateKeyFromMoscowMs = (moscowMs) => {
  const moscowDate = new Date(moscowMs);
  const year = moscowDate.getUTCFullYear();
  const month = String(moscowDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(moscowDate.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getDateKey = (date = new Date()) => getDateKeyFromMoscowMs(getMoscowMs(date));

export const getPurchaseDateKey = (date = new Date()) => {
  const moscowMs = getMoscowMs(date);
  const moscowDate = new Date(moscowMs);
  const hour = moscowDate.getUTCHours();
  const purchaseMoscowMs =
    hour >= ROLLOVER_HOUR_MSK ? moscowMs + 24 * 60 * 60 * 1000 : moscowMs;

  return getDateKeyFromMoscowMs(purchaseMoscowMs);
};

export const getMsUntilNextPurchaseRollover = (date = new Date()) => {
  const moscowMs = getMoscowMs(date);
  const moscowDate = new Date(moscowMs);
  const boundaryMoscowMs = Date.UTC(
    moscowDate.getUTCFullYear(),
    moscowDate.getUTCMonth(),
    moscowDate.getUTCDate(),
    ROLLOVER_HOUR_MSK,
    0,
    0,
    0
  );
  const nextBoundaryMoscowMs =
    moscowMs < boundaryMoscowMs
      ? boundaryMoscowMs
      : boundaryMoscowMs + 24 * 60 * 60 * 1000;

  return Math.max(0, nextBoundaryMoscowMs - moscowMs);
};

export const formatDateLabel = (dateKey) =>
  new Date(`${dateKey}T00:00:00`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
