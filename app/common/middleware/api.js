import $ from 'jquery';
import fetch from 'isomorphic-fetch';
import { CALL_API } from '../constants';

export default store => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { types, params={} } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return fetch(`http://weiticket.com:8088/${endpoint}.aspx?${$.param(params)}`)
    .then(response => response.json())
    .then(response => response.success ? response : new Error(response.errorInfo))
    .then(
      response => next(actionWith({
        response,
        type: successType,
      })),
      error => next(actionWith({
        type: failureType,
        error: error.message || '',
      }))
    );
};
