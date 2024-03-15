// Provide a default service that can be used to make calls before the payment call.
export default () => (
  // By default return a completed promise so it can be used either in either async/await or promise chains.
  Promise.resolve()
);
