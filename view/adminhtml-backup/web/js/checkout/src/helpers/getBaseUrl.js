export default () => {
  const { location: { hostname, origin, pathname } } = window;
  const splitPathname = pathname.split('/');
  const suffix = splitPathname[1].length === 4 ? `/${splitPathname[1]}` : '';
  return hostname === 'localhost'
    ? 'https://party.loc'
    : `${origin}${suffix}`;
};
