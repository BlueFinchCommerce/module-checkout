export default async (type, parameters) => {
  if (window?.geneCheckout?.callbacks?.[type]) {
    let callbackReturn = null;

    Object.values(window.geneCheckout.callbacks[type]).forEach(async (callback) => {
      if (typeof callback === 'function') {
        callbackReturn = callback(parameters);
        return;
      }

      const { default: callbackFunction } = await import(callback);
      callbackReturn = callbackFunction(parameters);
    });

    return callbackReturn;
  }

  return parameters;
};
