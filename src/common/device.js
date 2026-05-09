export const prepareWebApp = () => {
  document.documentElement.classList.add('web-pwa');
};

export const impact = (pattern = 12) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export const notifySuccess = () => impact([20, 30, 20]);

export const notifyWarning = () => impact([45, 40, 45]);
