export const isPlainObject = function(obj: Object) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
