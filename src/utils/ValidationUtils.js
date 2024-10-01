export const isStrongPassword = (password) => {
  const minLength = 6;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const hasUppercase = /[A-Z]/;

  if (password.length < minLength) {
    return "Password must be at least 6 characters long.";
  }
  if (!hasNumber.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!hasSpecialChar.test(password)) {
    return "Password must contain at least one special character.";
  }
  if (!hasUppercase.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  return ""; // No error, password is strong
};

// emailUtils.js
export const isValidEmail = (email) => {
  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  return ""; // No error, email is valid
};
