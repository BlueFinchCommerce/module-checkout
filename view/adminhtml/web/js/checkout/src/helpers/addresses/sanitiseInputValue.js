import DOMPurify from 'dompurify';

export default (input, type) => {
  // Use DOMPurify to sanitize and remove any script tags
  const sanitizedInput = DOMPurify.sanitize(input);

  // Prevent users from entering emojis but still allow certain
  // special characters (such as Cyrillic or Japanese Kanji etc.)
  let allowedCharactersRegex;

  if (type === 'email') {
    /* eslint-disable max-len */
    allowedCharactersRegex = /^[\u0600-\u06FF\u0750-\u077F\u0400-\u04FF\u2E80-\u9FFF\w\s.@+_]*[^,#?][\u0600-\u06FF\u0750-\u077F\u0400-\u04FF\u2E80-\u9FFF\w\s.@+_]*$/;
  } else if (type === 'tel') {
    allowedCharactersRegex = /^[0-9+-]+$/;
  } else {
    /* eslint-disable max-len */
    allowedCharactersRegex = /^[\u0600-\u06FF\u0750-\u077F\u0400-\u04FF\u2E80-\u9FFF\w\s.,\-áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÄËÏÖÜÿŸçÇ]*$/;
  }

  // Test if the input contains only allowed characters
  // Escape special characters to prevent script injection
  return allowedCharactersRegex.test(sanitizedInput);
};
