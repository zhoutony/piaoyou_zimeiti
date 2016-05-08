import merge from 'lodash/merge';
import * as types from '../constants';

const initState = {
  adsList: [],
  newsList: [],
  newsPage: 0,
  newsLoading: false,
  filters: [0, '喜剧'],
};

function eqaulFilters(a, b) {
  return a.join(',') === b.join(',');
}

export default function newsList(state = initState, action) {
  switch (action.type) {
    case types.LOAD_MOVIES_NEWSLIST_SUCCESS:
      return merge({}, state, {
        newsList: state.newsList.concat(action.response.data.news),
        newsPage: action.page,
        newsLoading: false,
        filters: action.filters,
      });
    case types.REFRESH_MOVIES_NEWSLIST_SUCCESS:
      return merge({}, state,  {
        newsList: action.response.data.news,
        newsPage: action.page,
        newsLoading: false,
        filters: action.filters,
      });
    case types.LOAD_MOVIES_NEWSLIST_REQUEST:
    case types.REFRESH_MOVIES_NEWSLIST_REQUEST:
      return merge({}, state, {
        newsLoading: true,
      });
    case types.LOAD_MOVIES_NEWSLIST_FAILURE:
    case types.REFRESH_MOVIES_NEWSLIST_FAILURE:
      return merge({}, state, {
        newsLoading: false,
      });
    case types.LOAD_MOVIES_ADSLIST_SUCCESS:
      return merge({}, state, {
        adsList: action.response.data.advertisements,
      });
    default:
      return state;
  }
}
