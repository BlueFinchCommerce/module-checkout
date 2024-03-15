export default (param) => {
  const search = new URLSearchParams(window.location.search);
  return search.get(param);
};
