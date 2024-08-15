export default async (type, parameters) => {
  if (window?.geneCheckout?.callbacks?.[type]) {
    Object.values(window.geneCheckout.callbacks[type]).forEach(async (callback) => {
      if (typeof callback === 'function') {
        return callback(parameters);
      }

      const { default: callbackFunction } = await import(callback);
      return callbackFunction(parameters);
    });
  }

  return parameters;
};
