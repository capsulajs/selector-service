import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';

export const isValidSetItemsRequest = (request: any) => {
  return request && request.items && Array.isArray(request.items);
};

export const isValidSelectRequest = (request: any) => {
  return request && request.key && isPlainObject(request.key) && !isEmpty(request.key);
};
