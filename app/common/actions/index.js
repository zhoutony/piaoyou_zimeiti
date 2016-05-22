import * as types from '../constants';
import cookies from 'browser-cookies';

// 加载首页广告列表
export function loadHomeAdsList(wxChannel) {
  return {
    [types.CALL_API]: {
      types: [types.LOAD_HOME_ADSLIST_REQUEST, types.LOAD_HOME_ADSLIST_SUCCESS, types.LOAD_HOME_ADSLIST_FAILURE],
      endpoint: 'queryAdvertisements',
      params: {
        type: 'HomePageTop',
        wxchannelCode: wxChannel,
      },
    },
  };
};

// 加载首页新闻列表
export function loadHomeNewsList(page) {
  return {
    page,
    [types.CALL_API]: {
      types: [types.LOAD_HOME_NEWSLIST_REQUEST, types.LOAD_HOME_NEWSLIST_SUCCESS, types.LOAD_HOME_NEWSLIST_FAILURE],
      endpoint: 'queryTopLineMovieNews',
      params: {
        type: -1,
        pageIndex: page,
        pageSize: 10,
      },
    },
  };
};

// 加载视频页广告列表
export function loadVideosAdsList(wxChannel) {
  return {
    [types.CALL_API]: {
      types: [types.LOAD_VIDEOS_ADSLIST_REQUEST, types.LOAD_VIDEOS_ADSLIST_SUCCESS, types.LOAD_VIDEOS_ADSLIST_FAILURE],
      endpoint: 'queryAdvertisements',
      params: {
        type: 'VideoTop',
        wxchannelCode: wxChannel,
      },
    },
  };
};

// 加载视频页新闻列表
export function loadVideosNewsList(page) {
  return {
    page,
    [types.CALL_API]: {
      types: [types.LOAD_VIDEOS_NEWSLIST_REQUEST, types.LOAD_VIDEOS_NEWSLIST_SUCCESS, types.LOAD_VIDEOS_NEWSLIST_FAILURE],
      endpoint: 'queryVideos',
      params: {
        videoType: 0,
        pageIndex: page,
        pageSize: 10,
      },
    },
  };
};

// 加载在线电影广告列表
export function loadMoviesAdsList(wxChannel) {
  return {
    [types.CALL_API]: {
      types: [types.LOAD_MOVIES_ADSLIST_REQUEST, types.LOAD_MOVIES_ADSLIST_SUCCESS, types.LOAD_MOVIES_ADSLIST_FAILURE],
      endpoint: 'queryAdvertisements',
      params: {
        type: 'MovieTop',
        wxchannelCode: wxChannel,
      },
    },
  };
};

// 加载在线电影新闻列表
export function loadMoviesNewsList(page, filters) {
  return {
    page,
    filters,
    [types.CALL_API]: {
      types: [types.LOAD_MOVIES_NEWSLIST_REQUEST, types.LOAD_MOVIES_NEWSLIST_SUCCESS, types.LOAD_MOVIES_NEWSLIST_FAILURE],
      endpoint: 'queryVideos',
      params: {
        videoType: 1,
        pageIndex: page,
        pageSize: 10,
        isFree: filters[0],
        ctgs: filters[1],
      },
    },
  };
};

// 刷新在线电影新闻列表
export function refreshMoviesNewsList(page, filters) {
  return {
    page,
    filters,
    [types.CALL_API]: {
      types: [types.REFRESH_MOVIES_NEWSLIST_REQUEST, types.REFRESH_MOVIES_NEWSLIST_SUCCESS, types.REFRESH_MOVIES_NEWSLIST_FAILURE],
      endpoint: 'queryVideos',
      params: {
        videoType: 1,
        pageIndex: page,
        pageSize: 10,
        isFree: filters[0],
        ctgs: filters[1],
      },
    },
  };
};

export function loadPublisherNewsList(page, publisherId) {
  return {
    page,
    publisherId,
    [types.CALL_API]: {
      types: [types.LOAD_PUBLISHER_NEWSLIST_REQUEST, types.LOAD_PUBLISHER_NEWSLIST_SUCCESS, types.LOAD_PUBLISHER_NEWSLIST_FAILURE],
      endpoint: 'queryTopLineMovieNews',
      params: {
        type: publisherId,
        pageIndex: page,
        pageSize: 10,
      },
    },
  };
}

// 切换订阅自媒体
export function toggleSubscribePublisher(subscribe, publisherId) {
  return {
    publisherId,
    subscribe,
    [types.CALL_API]: {
      types: [types.TOGGLE_SUBSCRIBE_PUBLISHER_REQUEST, types.TOGGLE_SUBSCRIBE_PUBLISHER_SUCCESS, types.TOGGLE_SUBSCRIBE_PUBLISHER_FAILURE],
      endpoint: subscribe ? 'SubscriberWeMedia' : 'UnSubscriberWeMedia',
      params: {
        sourceID: publisherId,
        openId: cookies.get('openids') || '',
      },
    },
  };
}

// 加载新闻详情
export function loadNews(newsId) {
  return {
    [types.CALL_API]: {
      types: [types.LOAD_NEWS_REQUEST, types.LOAD_NEWS_SUCCESS, types.LOAD_NEWS_FAILURE],
      endpoint: 'queryMovieNewsByID',
      params: {
        newsID: newsId,
        openId: cookies.get('openids') || '',
      },
    },
  };
}

// 支付订单
export function getPayParam(orderId, redPacketId, cardPacketId, wxChannel) {
  return {
    orderId,
    [types.CALL_API]: {
      types: [types.GET_PAY_PARAM_REQUEST, types.GET_PAY_PARAM_SUCCESS, types.GET_PAY_PARAM_FAILURE],
      endpoint: 'QueryWeixinPlayParam',
      params: {
        orderID: orderId,
        openID: cookies.get('openids') || '',
        wxtype: wxChannel,
        redEnvelopeID: redPacketId || '',
        piaoyouCardID: cardPacketId || '',
      },
    },
  };
}

