export default () => {
  const element = document.querySelector('[data-static-path]');

  if (element) {
    const { staticPath } = element.dataset;
    const staticPathFragments = staticPath.split('/');
    const staticIndex = staticPathFragments.findIndex((path) => (path.startsWith('version')));
    return staticPathFragments.slice(0, staticIndex + 1).join('/');
  }

  return undefined;
};
