export default (data, sections = []) => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));
  sections.forEach((section) => {
    mageCache[section] = data[section];
  });
  localStorage.setItem('mage-cache-storage', JSON.stringify(mageCache));
};
