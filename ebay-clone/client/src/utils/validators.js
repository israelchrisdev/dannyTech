export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};

export const validatePrice = (price) => {
  return !isNaN(price) && parseFloat(price) > 0;
};

export const validateQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCreditCard = (cardNumber) => {
  const re = /^\d{13,19}$/;
  return re.test(cardNumber.replace(/\s/g, ''));
};

export const validateCVV = (cvv) => {
  const re = /^\d{3,4}$/;
  return re.test(cvv);
};

export const validateExpiryDate = (month, year) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
};