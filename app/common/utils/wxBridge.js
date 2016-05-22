import $ from 'jquery';
import wx from './wx';
import cookies from 'browser-cookies';

//验证签名
function verif(force, debug) {
  if (!wx) {return;}

  getcap(force, debug);
}

let tryCount = 0;

function getcap(force, debug) {
  var url = '/publicsignal/queryJsapiticket';
  var option = {
    url: location.href.split('#')[0],
    wxchannelCode: '',
  };

  $.post(url, option, function(result) {
    if (result && result.data) {
      const { success, errorCode, data } = JSON.parse(result.data);
      if (success && errorCode == 1) {
        const { appId, timestamp, nonceStr, signature } = data;

        wx.config({
          debug,//如果在测试环境可以设置为true，会在控制台输出分享信息； //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature,// 必填
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 必填
        });

        wx.error(function(res) {
          //签名过期导致验证失败
          if (res.errMsg !== 'config:ok' && tryCount <= 2) {//如果签名失效，不读缓存，强制获取新的签名
            // alert('签名失效2');
            console.log('签名失效');
            verif(1, false);
          }
        });
      }
    } else {
      // alert('签名失效1');
      console.log('签名失效');
    }

    tryCount++;
  });
}

function defaultCallback(wxChannel, sourceId, shareType, shareObj) {
  var options = {
    openId: cookies.get('openids'),
    id: sourceId,
    shareType,
    wxchannelCode: wxChannel,
    shareobj: shareObj,
  };

  $.post('/yesunion/sharecallback', options);
}

verif(0, false);

//分享
export function share(param) {
  const {
    title = '电影票友 --人人娱乐 人人收益 自媒体共享平台',
    timelineTitle = '电影票友 --人人娱乐 人人收益 自媒体共享平台',
    link = location.href,
    imgUrl = 'http://p2.pstatp.com/large/3245/1852234910',
    desc = '在电影的时光读懂自已     www.moviefan.com.cn',
    type = 'link',
    dataUrl = '',
    wxChannel,
    sourceId,
    shareType,
  } = param;

  const callback = param.callback || defaultCallback.bind(this, wxChannel, sourceId, shareType);

  wx.ready(function(res) {
    //  wx.hideAllNonBaseMenuItem();
    //alert('wx ready');
    wx.showOptionMenu({
      menuList: [
          'menuItem:share:appMessage',
          'menuItem:share:timeline',
      ],
    });

    //wx.hideMenuItems({
    //    menuList: ['menuItem:copyUrl','menuItem:openWithSafari','menuItem:share:brand'] // 要隐藏的菜单项，所有menu项见附录3
    //});
    //校验分享接口是否可用
    wx.checkJsApi({
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems'],
      success: function(res) {
        const { checkResult } = res;

        if ((checkResult.onMenuShareTimeline = !!false) ||
          (checkResult.onMenuShareAppMessage = !!false)) {
          return false;
        }
      },
    });

    //分享到朋友圈
    wx.onMenuShareTimeline({
      title: timelineTitle,
      desc,
      link,
      imgUrl,
      success: (res) => callback('timeline'),
      cancel: (res) => {},
    });

    //分享给朋友
    wx.onMenuShareAppMessage({
      title,
      desc,
      link,
      imgUrl,
      type,
      dataUrl,
      success: (res) => callback('appmessage'),
      cancel: (res) => {},
    });
  });
}
