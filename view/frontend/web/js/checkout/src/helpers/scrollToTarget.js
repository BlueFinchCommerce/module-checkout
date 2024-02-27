export default (target) => {
  const element = typeof target === 'string'
    ? document.querySelector(target)
    : target;

  element.scrollIntoView({
    behavior: 'smooth',
  });
};
