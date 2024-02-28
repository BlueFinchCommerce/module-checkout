export default (url) => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = url;

  script.addEventListener('load', () => {
    resolve();
  }, false);

  script.addEventListener('error', () => {
    reject();
  }, false);

  document.body.appendChild(script);
});
