import merge from 'lodash/merge';
import * as types from '../constants';

const initState = {
  adsList: [],
  newsList: [],
  newsPage: 0,
  newsLoading: false,
  shareInfo: null,
};

export default function newsList(state = initState, action) {
  switch (action.type) {
    case types.LOAD_HOME_NEWSLIST_SUCCESS:
      return merge({}, state, {
        newsList: state.newsList.concat(action.response.data.news),
        newsPage: action.page,
        newsLoading: false,
      });
    case types.LOAD_HOME_NEWSLIST_REQUEST:
      return merge({}, state, {
        newsLoading: true,
      });
    case types.LOAD_HOME_NEWSLIST_FAILURE:
      return merge({}, state, {
        newsLoading: false,
      });
    case types.LOAD_HOME_ADSLIST_SUCCESS:
      return merge({}, state, {
        adsList: action.response.data.advertisements,
        shareInfo: action.response.data.shareInfo,
      });
    default:
      return state;
  }
}
