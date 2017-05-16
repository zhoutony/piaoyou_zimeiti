var _ = require('lodash');
var Vue = require('vue');
var moment = require('moment');
var cookie = require("../util/cookie.js");
var $ = require('../lib/zepto.js');
var Util = require('../util/widgets.js');
var Dialogs = require('../util/dialogs');
var ScrollBottomPlus = require('../util/scrollBottomPlus.js');

moment.locale('zh-cn');

//-----------------------------------------------------------红包-------------------------------------------------------------

function RedBagModal() {}

_.extend(RedBagModal.prototype, {
  template: require('./templates/redBagModal.jade'),
  open: function() {
    var that = this;
    var template = this.template;
    var loading = Dialogs.Loading();

    $.get('/my/myredbag', function(data) {
      // if (!data || !data.redEnvelopes) {
      //   return;
      // }
      setTimeout(function() {
          loading(true);
        }, 100);

      Dialogs.pop(template);
      that.render(data || []);
    });
  },

  render: function(redBagList) {
    var data = {
      currentTab: 1,
      hasNoRedBag: _.isEmpty(redBagList),
      redBagList: redBagList,
      redBag: null,
    };

    var threshold = 3 * 24 * 60 * 60 * 1e3;
    _.each(redBagList, function(redBag) {
      var endTime = moment(redBag.endTime, 'YYYY-MM-DD HH:mm:ss');
      redBag.expiredTime = endTime.format('YYYY-MM-DD');

      var remainTime = endTime - new Date();
      if (remainTime > 0 && remainTime <= threshold) {
        redBag.remainTime = moment.duration(remainTime).humanize();
      }
    });

    var groupedRedBag = _.groupBy(redBagList, function(redBag) {
      return parseInt(redBag.state, 10);
    });

    data.unusedCount = (groupedRedBag['1'] || []).length;
    data.expiredCount = (groupedRedBag['3'] || []).length;
    data.usedCount = (groupedRedBag['2'] || []).length;

    var vm = new Vue({
      el: '#redBag',
      data: data,
      methods: {
        changeTab: function(index) {
          this.currentTab = index;
        },
        showDetail: function(redBagId) {
          $.get('/my/myredbag/' + redBagId, function(redBag) {
            vm.redBag = redBag;
          });
        },
        showList: function() {
          vm.redBag = null;
        }
      }
    });
  },

  close: function() {}
});

//-----------------------------------------------------------卡包-------------------------------------------------------------
function PiaoModal() {}

  
_.extend(PiaoModal.prototype, {
  template: require('./templates/piaoModal.jade'),
  open: function() {
    var that = this;
    var template = this.template;
    var loading = Dialogs.Loading();

    $.get('/my/mypiao', function(data) {

      setTimeout(function() {
          loading(true);
        }, 100);

      Dialogs.pop(template);
      that.render(data.piaoyouCards || []);
    });
  },

	  addCard: function(){
	    // var cardnum = $('input[name="cardnum"]').val();
	    var cardnum = $('input[name="cardnum"]').val();
	    var pwd = $('input[name="pwd"]').val();
	    var mobile = $('input[name="mobile"]').val();
	    var code = $('input[name="code"]').val();

    $.post('/my/addcard?cardnum='+cardnum+'&pwd='+pwd+'&mobile='+mobile+'&code='+code+'', function(data) {
      // console.log(data);
      $('.bindcheck').html(data.msg);
      $('.bindcheck').css('opacity','1');
      $('.testcode input').focus(function(){
      $('.bindcheck').css('opacity','0');
      });

      if(data.state == 1){
           setTimeout(function () { 
            location.href=location.href+'?'+Math.random();
          }, 1000);  
        }
    });
  },

	  getCodeImg:function() {
	  	var param={guid:cookie.getItem('guid')};
	  	if(param.guid==null)
	  		param=null;
	      $.get('http://weiticket.com:8086/validateCode.aspx',param,function(data){
	        // console.log(data.data.guid);
	        $('#changeImg').attr('src',data.data.img);
	        // 设置 Cookie
        var cookieExpired = 0; 
        var cookiePath = '/';
        cookie.setItem('guid', data.data.guid, cookieExpired, cookiePath);
	      })
	  },

  render: function(piaoList) {
    var data = {
      hasNoRedBag: _.isEmpty(piaoList),
      piaoList: piaoList,
      piao: null,
    };

	    var vm = new Vue({
	      el: '#piaoModal',
	      data: data,
	      methods: {
	        showDetail: function(piaoId) {
	          $.get('/my/mypiao/' + piaoId, function(piao) {
	            vm.piao = piao;
	          });
	        },
	        showList: function() {
	          vm.piao = null;
	        },
	        showCard: function() {
	            $('.orderbox').addClass('m-hide');
	            $('.regist').removeClass('m-hide');
	            new PiaoModal().getCodeImg();
	        }
	      }
	    });

    var vm = new Vue({
        el: '#addCard',
        data: data,
        methods: {
          changeCode: function() {
              new PiaoModal().getCodeImg();
          },
          bindCard: function() {
              var cardnum = $('input[name="cardnum"]').val();
              var pwd = $('input[name="pwd"]').val();
              var mobile = $('input[name="mobile"]').val();
              var code = $('input[name="code"]').val();
              if(cardnum == '' || pwd == '' || mobile == '' || code == ''){
                Dialogs.alert('请完善信息');
              }
              else{
                new PiaoModal().addCard();
              }
              
                
            }
        }
      });
  },

  close: function() {}
});

//-----------------------------------------------------------兑换码-------------------------------------------------------------

function CodeModal() {}

  
_.extend(CodeModal.prototype, {
  template: require('./templates/codeModal.jade'),
  open: function() {
    var that = this;
    var template = this.template;
    var loading = Dialogs.Loading();

    $.get('/my/mycode', function(data) {
      // if (!data || !data.redEnvelopes) {
      //   return;
      // }
      setTimeout(function() {
          loading(true);
        }, 100);

      Dialogs.pop(template);
      that.render(data || []);
    });
  },

    addCode: function(){
      // var cardnum = $('input[name="cardnum"]').val();
      var codenum = $('input[name="codenum"]').val();
      // var pwd = $('input[name="pwd"]').val();
      var mobile = $('input[name="mobile"]').val();
      // var code = $('input[name="code"]').val();

    $.post('/my/addcode?codenum='+codenum+'&mobile='+mobile+'', function(data) {
      // console.log(data);
      $('.bindcheck').html(data.msg);
      $('.bindcheck').css('opacity','1');
      $("input[type='text']").focus(function(){
      $('.bindcheck').css('opacity','0');
      });

      if(data.state == 1){
           setTimeout(function () { 
            location.href=location.href+'?'+Math.random();
          }, 1000);  
        }
    });
  },

  hasValue: function() {
    var flag = true;
        [].forEach.call(document.querySelectorAll('input'), function(e) {
            if (!e.value) {
                e.placeholder = e.placeholder;
                flag = false;
            }
        });
        return flag;
  },

  checkPhone: function() {
    if (new CodeModal().hasValue()) {
            var phone = document.querySelector('input[name="mobile"]');
            if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone.value))) {
                phone.value = null;
                phone.placeholder = "手机号码有误，请重填";
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
  },

  render: function(redBagList) {
    var data = {
      currentTab: 1,
      hasNoRedBag: _.isEmpty(redBagList),
      redBagList: redBagList,
      redBag: null,
    };


    var threshold = 3 * 24 * 60 * 60 * 1e3;
    _.each(redBagList, function(redBag) {
      var endTime = moment(redBag.endTime, 'YYYY-MM-DD HH:mm:ss');
      redBag.expiredTime = endTime.format('YYYY-MM-DD');

      var remainTime = endTime - new Date();
      if (remainTime > 0 && remainTime <= threshold) {
        redBag.remainTime = moment.duration(remainTime).humanize();
      }
    });

    var groupedRedBag = _.groupBy(redBagList, function(redBag) {
      return parseInt(redBag.state, 10);
    });

    data.unusedCount = (groupedRedBag['1'] || []).length;
    data.expiredCount = (groupedRedBag['3'] || []).length;
    data.usedCount = (groupedRedBag['2'] || []).length;


      var vm = new Vue({
        el: '#codeBag',
        data: data,
        methods: {
          changeTab: function(index) {
            this.currentTab = index;
          },
          showDetail: function(redBagId) {
          $.get('/my/mycode/' + redBagId, function(redBag) {
              vm.redBag = redBag;
            });
          },
          showList: function() {
              vm.redBag = null;
            },
          showCard: function() {
              $('.orderbox').addClass('m-hide');
              $('.regist').removeClass('m-hide');
              
          }
        }
      });

    var vm = new Vue({
        el: '#addCode',
        data: data,
        methods: {
          bindCard: function() {
              var codenum = $('input[name="codenum"]').val();
              
              var mobile = $('input[name="mobile"]').val();
              
              if(new CodeModal().checkPhone()){
                Dialogs.confirm('<p class="confirmPhone">请确定您的手机号是否正确:<br/>'+mobile+'</p>',function(){
                  new CodeModal().addCode();
                });
                
              }
              // else{
              //   new CodeModal().addCode();
              // }
              
                
            }
        }
      });
  },

  close: function() {}
});

//-----------------------------------------------------------绑定手机号-------------------------------------------------------------

function BindNumberModal() {}

  
_.extend(BindNumberModal.prototype, {
  template: require('./templates/bindNumberModal.jade'),
  open: function() {
    var that = this;
    var template = this.template;

    $.get('/my/mycode', function(data) {
      // if (!data || !data.redEnvelopes) {
      //   return;
      // }

      Dialogs.pop(template);
      that.render(data || []);
    });
  },

    addCode: function(){
      var bindNum = $('input[name="bindNum"]').val();
      var bindCode = $('input[name="bindCode"]').val();
      var bindPwd = $('input[name="bindPwd"]').val();
      var bindPwd_5 = new BindNumberModal().MD5(bindPwd);

    $.post('/my/bindPhone?bindNum='+bindNum+'&bindCode='+bindCode+'&bindPwd='+bindPwd_5+'', function(data) {
      // console.log(data);
        
          $('.bindcheck').html(data.msg);
          $('.bindcheck').css('opacity','1');
          $("input[type='text']").focus(function(){
          $('.bindcheck').css('opacity','0');
          });
       

      if(data.success == 1){
            $('#bindTel').addClass('m-hide');
            $('#syncing').removeClass('m-hide');

           setTimeout(function () { 
            location.href=location.href+'?'+Math.random();
          }, 1000);  
        }
    });
  },

  getCodeImg:function() {
      var param={guid:cookie.getItem('guid')};
      if(param.guid==null)
        param=null;
        $.get('http://weiticket.com:8086/validateCode.aspx',param,function(data){
          // console.log(data.data.guid);
          $('#changeImg_bind').attr('src',data.data.img);
          // 设置 Cookie
        var cookieExpired = 0; 
        var cookiePath = '/';
        cookie.setItem('guid', data.data.guid, cookieExpired, cookiePath);
        })
    },

  sendMessage: function() {
    var wait = 60;

    function time(obj){
      if( wait == 0){
        $('.code_right').css({'background':'#00958E ','border':'2px solid #00958E !important'});
        obj.removeAttr('disabled');
        obj.val('发送验证码');
        wait = 60;
      }
      else{
        $('.code_right').css({'background':'#ccc','border':'2px solid #ccc !important'});
        obj.attr('disabled',true);
        obj.val('重新发送('+wait+')');
        wait--;
        setTimeout(function(){
          time(obj);
        },1e3)
      }
    }

    time($('.sendMessage'));
    var _phone = $('input[name="bindNum"]').val();
    var _code = $('input[name="code"]').val();
    var _guid = cookie.getItem('guid');
    $.get('http://weiticket.com:8086/SendMsgCode.aspx',{phone:_phone,code:_code,guid:_guid},function(data){
          
          // console.log(data);
          if(data.success == 0){
            $('.bindcheck').html(data.msg);
            $('.bindcheck').css('opacity','1');
            $("input[type='text'],input[name='code']").focus(function(){
            $('.bindcheck').css('opacity','0');
            });
          }
        })
  },

  hasValue: function() {
    var flag = true;
        [].forEach.call(document.querySelectorAll('#input_phone'), function(e) {
            if (!e.value) {
                e.placeholder = '请填写此项信息';
                flag = false;
            }
        });
        return flag;
  },

  checkPhone: function() {
    if (new BindNumberModal().hasValue()) {
            var phone = document.querySelector('#input_phone');
            if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone.value))) {
                phone.value = null;
                phone.placeholder = "手机号码有误，请重填";
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
  },

  render: function(redBagList) {
    var data = {
      currentTab: 1,
      hasNoRedBag: _.isEmpty(redBagList),
      redBagList: redBagList,
      redBag: null,
    };

    var vm = new Vue({
        el: '#addPhone',
        data: data,
        methods: {
          showBind: function() {
              if(new BindNumberModal().checkPhone()){
                $('#addPhone').addClass('m-hide');
                $('#bindTel').removeClass('m-hide');
                var inputPhone = $('#input_phone').val();
                $('.tel_name input').val(inputPhone);

                new BindNumberModal().getCodeImg();
              } 
          }
        }
      });

    var vm = new Vue({
        el: '#bindTel',
        data: data,
        methods: {
          bindCard: function() {
              var bindNum = $('input[name="bindNum"]').val();
              var bindPwd = $('input[name="bindPwd"]').val();
              var bindCode = $('input[name="bindCode"]').val();
              
              if(bindNum == '' || bindCode == '' || bindPwd == ''){
                Dialogs.alert('请完善信息');
              }
              else{
                new BindNumberModal().addCode();
              }   
            },
          empty_tel: function() {
            $('.tel_name input').val('');
          },
          changeCode: function() {
              new BindNumberModal().getCodeImg();
          },
          change_pwd: function() {
            
            if($('.showPwd').hasClass('f-hide')){
                $('.showPwd').removeClass('f-hide');
                $('.hidePwd').addClass('f-hide'); 
                $('.showPwd').val($('.hidePwd').val());
            }
            else{
                $('.showPwd').addClass('f-hide');
                $('.hidePwd').removeClass('f-hide'); 
                $('.hidePwd').val($('.showPwd').val());
            }
        
          },
          send_message: function() {
            new BindNumberModal().sendMessage();
          }
        }
      });
  },

    MD5 : function (string) {
  
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
  
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
  
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
  
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
  
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
  
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
  
        for (var n = 0; n < string.length; n++) {
  
            var c = string.charCodeAt(n);
  
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
  
        }
  
        return utftext;
    };
  
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
  
    string = Utf8Encode(string);
  
    x = ConvertToWordArray(string);
  
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
  
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
  
    return temp.toLowerCase();
  },

  close: function() {}
});






var Mine = {
  init: function() {
    this.initField();
    this.initEvent();
    this.fetchNews(1);
  },

  initField: function() {
    var $wrap = $('.wrap');

    // 用户足迹相关
    this.$newsList = $wrap.find('.userNews .mylistbox');
    this.$newsEmpty = $wrap.find('.userNews .empty');
    this.$newsLoading = $wrap.find('.userNews .loading');
    this.newsLength = this.$newsList.find('li[data-id]').length;
    this.newsPageIndex = 1;

    // 红包相关
    this.$openRedBagModal = $wrap.find('[data-item="myredbag"]');
    this.$openPiaoModal = $wrap.find('[data-item="mypiao"]');
    this.$openCodeModal = $wrap.find('[data-item="mycode"]');
    this.$openBindModal = $wrap.find('[data-item="bindNumber"]');

    this.$wrap = $wrap;
    this.$body = $('body');
  },

  initEvent: function() {
    var mine = this;

    // 打开红包层
    this.$openRedBagModal.on('click', this.openRedBagModal);
    this.$openPiaoModal.on('click', this.openPiaoModal);
    this.$openCodeModal.on('click', this.openCodeModal);
    this.$openBindModal.on('click', this.openBindModal);

    // 关闭卡包，红包等层
    this.$body.on('click', '.maskbtn .btn_close', this.closeMask);

    this.$newsList.on('click', '.myclose', this.deleteNews.bind(this));

    // 初始化滚动加载组件
    if (this.newsLength > 0) {
      ScrollBottomPlus.render({
        el: this.$newsList,
        footer: ' ',
        app_el: this.$newsList,
        callback: function() {
          mine.fetchNews(mine.newsPageIndex + 1);
        }
      });
    }
  },

  fetchNews: function(pageIndex) {
    var mine = this;

    if (this.fetchNewsLock) {
      return;
    }

    this.fetchNewsLock = true;
    this.$newsLoading.show();

    $.get('/my/usernews/' + pageIndex, function(res) {
      mine.fetchNewsLock = false;
      mine.$newsLoading.hide();

      if (res) {
        mine.$newsList.append(res);
        mine.newsLength = mine.$newsList.find('li[data-id]').length;
        mine.newsPageIndex = pageIndex;
      }
    });
  },

  deleteNews: function(event) {
    event.preventDefault();

    var mine = this;
    var $close = $(event.currentTarget);
    var $news = $close.parents('li[data-id]');
    var newsId = $news.data('id');

    $.get('/my/usernews/delete/' + newsId, function(res) {
      if (!res.err) {
        $news.remove();

        if (--mine.newsLength <= 0) {
          mine.fetchNews(1);
        }
      }
    });
  },

  closeMask: function(event) {
    var $closeBtn = $(event.currentTarget);
    $closeBtn.parents('.mask').remove();
  },

  openRedBagModal: function(event) {
    new RedBagModal().open();
  },

  openPiaoModal: function() {
    new PiaoModal().open();   
  },

  openCodeModal: function() { 
    new CodeModal().open();
  },

  openBindModal: function() { 
    new BindNumberModal().open();
  }

};

$(document).ready(function() {
  var movienewsPageindex = 1;
  var mylistbox = $('.mylistbox');
  var mymenuEl = $('.mymenu'),
  itemMask, itemMaskEl;

  mymenuEl.on('click', 'li', function(evt) {
    var el = $(this),
    item = el.data('item');
    itemMethod(item);
  });

  //加载足迹
  // function getmylistbox(){
  //        var _url = '/my/usernews/'+ sourceId +'/' + movienewsPageindex;
  //        $.get(_url, function(data) {
  //            if(data == ""){
  //              alert('a');
  //                ScrollBottomPlus.remove();
  //                return;
  //            }
  //            // var _el = $('<div></div>').html(data).appendTo(hotmovie);
  //            mylistbox.html(mylistbox.html() + data)
  //            ScrollBottomPlus.gotoBottomShowed = false;
  //            alert('b');
  //        });

  //    }

  //    ScrollBottomPlus.render({
  //        el: '.mylistbox',
  //        app_el: ' ',
  //        footer: ' ',
  //        callback: function(){
  //            movienewsPageindex++;
  //            getmylistbox();
  //        }
  //    })

  //查询卡包更换颜色
    function checkCards(){
        $.get('/my/mypiao',function(data){
          if(data.piaoyouCards.length !=0 ){
            $('#checkCards').css("border","1px solid #00978a");
            $('#checkCards p').css("color","#00978a");
            $('#checkCards i.n03').addClass('checkCards_add');
          }
        })
      }
      checkCards();

    function checkOrders(){
        $.get('/my/myorders_check',function(data){
          if(data.orders.length !=0 ){
            $('#checkOrders').css("border","1px solid #00978a");
            $('#checkOrders p').css("color","#00978a");
            $('#checkOrders i.n01').addClass('checkOrders_add');
          }
        })
      }
    checkOrders();

    function checkCodes(){
        $.get('/my/mycode',function(data){
          if(data.length !=0 ){
            $('#checkCodes').css("border","1px solid #00978a");
            $('#checkCodes p').css("color","#00978a");
            $('#checkCodes i.n02').addClass('checkCodes_add');
          }
        })
      }
    checkCodes();

    function checkReds(){
        $.get('/my/myredbag',function(data){
          if(data.length !=0 ){
            $('#checkReds').css("border","1px solid #00978a");
            $('#checkReds p').css("color","#00978a");
            $('#checkReds i.n04').addClass('checkReds_add');
          }
        })
      }
    checkReds();

    function checkBind(){
        $.get('/my/isBind',function(data){
          if(data.state == 1){
            $('.myBind').addClass('m-hide');
            $('.mytxt').removeClass('m-hide');
          }
        })
      }
    checkBind();

  function itemMethod(item) {
    if (item === 'myredbag' || item === 'mypiao' || item === 'mycode') {
      return;
    }

    switch (item){
      case 'myorders':
        itemMask = 'mask_myorder';
        break;
      case 'mypiao':
        itemMask = 'mask_mypiao';
        break;
      case 'myredbag':
        itemMask = 'mask_myredbag';
        break;

    }
    if (item && item != '') {
      var loading = Dialogs.Loading();
      var url = '/my/' + item;
      $.get(url, function(return_html) {
        setTimeout(function() {
          loading(true);
        }, 100);

        Dialogs.pop(return_html);
        maskMethod();
      });
    }

  }

  function maskMethod() {
    var maskotherEl = $('.maskother'),
    topEl, el, orderboxEl;

    if (maskotherEl.length > 0) {
      maskotherEl.on('click', function(evt) {
        el = evt.target;
        if (el.tagName == 'A') {
          orderboxEl = maskotherEl.find('.orderbox');
          if ($(el).hasClass('btn_back')) {
            orderboxEl.show();
            itemMaskEl.remove();
            return;
          }

          // getMaskHtml(maskotherEl, orderboxEl);
        }
      });
    }
  }

  function getMaskHtml(el, orderboxEl) {
    if (el && el.length > 0) {
      var url = '/my/' + itemMask;
      $.get(url, function(return_html) {
        orderboxEl.hide();
        itemMaskEl = $(return_html).appendTo(el);
      });
    }

  }

  //-发现弹出 即将开启
  var _findbox = $('#findbox ');
  _findbox.on('click', function() {
    _findbox.addClass('showtips');
    setTimeout(function() {
      _findbox.removeClass('showtips');
    }, 1000);
  });

  //- 我的页面切换
  $('.navmy li').on('click', function() {
      $(this).addClass('curr').siblings().removeClass('curr');
    $('.subtablist').eq($('.navmy li').index(this)).show().siblings('.subtablist').hide();
  });

  Mine.init();
});
