import merge from 'lodash/merge';
import * as types from '../constants';

export default function news(state = {}, action) {
  switch (action.type) {
    case types.LOAD_NEWS_REQUEST:
      return {};
    case types.LOAD_NEWS_SUCCESS:
      const { topAds, bottomAds, news, newsInfo } = action.response.data;
      return {
        newsInfo: newsInfo,
        topAdsList: topAds,
        bottomAdsList: bottomAds,
        recommendNewsList: news.Items,
      };
    default:
      return state;
  }
}
