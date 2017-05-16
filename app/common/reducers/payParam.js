import merge from 'lodash/merge';
import * as types from '../constants';

export default function payParam(state = {}, action) {
  const { orderId, channel, error, response, type } = action;

  switch (type) {
    case types.GET_PAY_PARAM_REQUEST:
      return {
        orderId,
        channel,
        submitting: true,
        cardPacketLock: true,
      };
    case types.GET_PAY_PARAM_SUCCESS:
      const { data, success, orderState, errorInfo } = response;

      return merge({}, state, {
        data,
        success,
        channel,
        state: parseInt(orderState, 10),
        submitting: false,
        cardPacketLock: true,
        error: errorInfo,
      });
    case types.GET_PAY_PARAM_FAILURE:
      return {
        orderId,
        channel,
        submitting: false,
        cardPacketLock: true,
        error,
      };
    default:
      return state;
  }
}
