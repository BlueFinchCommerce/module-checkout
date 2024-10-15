export default (type, parameters) => {
  if (window?.geneCheckout?.callbacks?.[type]) {
    let callbackReturn = Promise.resolve(parameters);

    Object.values(window.geneCheckout.callbacks[type]).forEach((callback) => {
      if (typeof callback === 'function') {
        callbackReturn = callbackReturn.then((response) => callback(response));
        return;
      }

      callbackReturn = callbackReturn.then(async (response) => {
        const { default: callbackFunction } = await import(callback);
        return callbackFunction(response);
      });
    });

    return callbackReturn;
  }

  return parameters;
};
