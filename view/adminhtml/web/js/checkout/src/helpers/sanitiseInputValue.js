import DOMPurify from 'dompurify';

export default (input) => {
  // Use DOMPurify to sanitize and remove any script tags
  const sanitizedInput = DOMPurify.sanitize(input);

  // Prevent users from entering emojis but still allow certain
  // special characters (such as Cyrillic or Japanese Kanji etc.)
  const allowedCharactersRegex = /^[\u0600-\u06FF\u0750-\u077F\u0400-\u04FF\u2E80-\u9FFF\w\s?.,@~+-]*$/;

  // Test if the input contains only allowed characters
  // Escape special characters to prevent script injection
  return allowedCharactersRegex.test(sanitizedInput);
};
