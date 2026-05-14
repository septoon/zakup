export const normalizeQuantityInput = (value) => {
  const normalized = String(value || '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '');
  const [integerPart, ...decimalParts] = normalized.split('.');

  return decimalParts.length
    ? `${integerPart}.${decimalParts.join('')}`
    : integerPart;
};

export const parseQuantity = (value, fallback = 0) => {
  const rawValue = String(value || '').replace(',', '.');

  if (!rawValue.trim()) {
    return fallback;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
};
