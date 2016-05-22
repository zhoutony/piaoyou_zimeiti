import merge from 'lodash/merge';
import * as types from '../constants';

export default function payParams(state = {}, action) {
  const { orderId, error, response, type } = action;

  switch (type) {
    case types.GET_PAY_PARAMS_REQUEST:
      return {
        orderId,
        submitting: true,
      };
    case types.GET_PAY_PARAMS_SUCCESS:
      const { data, success, orderState, errorInfo } = response;

      return merge({}, state, {
        data,
        success,
        state: parseInt(orderState, 10),
        submitting: false,
        error: errorInfo,
      });
    case types.GET_PAY_PARAMS_FAILURE:
      return {
        orderId,
        submitting: false,
        error,
      };
    default:
      return state;
  }
}
