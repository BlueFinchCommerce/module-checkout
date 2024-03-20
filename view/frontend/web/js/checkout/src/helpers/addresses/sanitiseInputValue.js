export default (input, type) => {
  // Prevent users from entering emojis but still allow certain
  // special characters (such as Cyrillic or Japanese Kanji etc.)
  let allowedCharactersRegex;

  if (type === 'email') {
    /* eslint-disable max-len */
    allowedCharactersRegex = /^[\u0600-\u06FF\u0750-\u077F\u0400-\u04FF\u2E80-\u9FFF\w\s.@+_]*[^,#?][\u0600-\u06FF\u0750-\u077F\u0400-\u04FF\u2E80-\u9FFF\w\s.@+_]*$/;
  } else if (type === 'tel') {
    allowedCharactersRegex = /^[\u0600-\u06FF\u0750-\u077F\u0400-\u04FF\u2E80-\u9FFF\w\s.+,-]*$/;
  } else {
    /* eslint-disable max-len */
    allowedCharactersRegex = /^[\u0600-\u06FF\u0750-\u077F\u0400-\u04FF\u2E80-\u9FFF\w\s.,\-áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÄËÏÖÜÿŸçÇ]*$/;
  }

  // Test if the input contains only allowed characters
  // Escape special characters to prevent script injection
  return allowedCharactersRegex.test(input);
};
