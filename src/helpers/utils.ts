export const isPlainObject = (obj: object) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
