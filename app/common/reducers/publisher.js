import merge from 'lodash/merge';
import * as types from '../constants';

const initState = {
  newsList: [],
  newsPage: 0,
  newsLoading: false,
  publisher: {},
  publisherId: null,
};

export default function publisher(state = initState, action) {
  const { publisherId } = action;

  switch (action.type) {
    case types.LOAD_PUBLISHER_NEWSLIST_SUCCESS:
      const { news, sourceInfo } = action.response.data;

      return merge({}, state, {
        newsList: state.newsList.concat(news),
        newsPage: action.page,
        newsLoading: false,
        publisher: sourceInfo,
        isSubscribed: sourceInfo.isSubscribe === 'true',
      });
    case types.LOAD_PUBLISHER_NEWSLIST_REQUEST:
      state = state.publisherId === publisherId ? state : initState;

      return merge({}, state, {
        newsLoading: true,
        publisherId,
      });
    case types.LOAD_PUBLISHER_NEWSLIST_FAILURE:
      state = state.publisherId === publisherId ? state : initState;

      return merge({}, state, {
        newsLoading: false,
        publisherId,
      });
    case types.TOGGLE_SUBSCRIBE_PUBLISHER_SUCCESS:
      const { publisherId, subscribe } = action;

      if (parseInt(publisherId, 10) === parseInt(state.publisherId, 10)) {
        return merge({}, state, {
          isSubscribed: subscribe,
        });
      } else {
        return state;
      }

    default:
      return state;
  }
}
