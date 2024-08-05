import isEmailValid from './isEmailValid';

export default (input, type) => {
  switch (type) {
    case 'alphanumeric':
      // Check if input consists of only alphanumeric characters
      return /^[a-zA-Z0-9]+$/.test(input);
    case 'alphanum-with-spaces':
      // Check if input consists of only alphanumeric characters and spaces
      return /^[a-zA-Z0-9\s]+$/.test(input);
    case 'numeric':
      // Check if input consists of only numeric characters
      return /^[0-9]+$/.test(input);
    case 'alpha':
      // Check if input consists of only alphabetic characters
      return /^[a-zA-Z]+$/.test(input);
    case 'url':
      // Check if input is a valid URL (not complete but we dont really use this anywhere)
      return /^(www\.|https?:\/\/)/.test(input);
    case 'email':
      // Check if input is a valid email address
      return isEmailValid(input);
    case 'length':
      // Length rules covers in seperate helpers therfore return true and let those functions handle the rule
      return true;
    default:
      return false;
  }
};
