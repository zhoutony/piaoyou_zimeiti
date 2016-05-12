import merge from 'lodash/merge';
import * as types from '../constants';

export default function news(state = {}, action) {
  switch (action.type) {
    case types.LOAD_NEWS_REQUEST:
      return {
        newsId: state.newsId,
      };
    case types.LOAD_NEWS_SUCCESS:
      const { topAds, bottomAds, news, newsInfo } = action.response.data;
      return {
        newsInfo: newsInfo,
        topAdsList: topAds,
        bottomAdsList: bottomAds,
        recommendNewsList: news.Items,
        newsId: parseInt(newsInfo.newID, 10),
        isComplete: false,
      };
    case types.SHOW_COMPLETE_NEWS:
      return merge({}, state, {
        isComplete: true,
      });
    default:
      return state;
  }
}
