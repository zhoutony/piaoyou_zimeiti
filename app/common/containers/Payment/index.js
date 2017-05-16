import $ from 'jquery';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Dialog, Toast } from 'react-weui';
import merge from 'lodash/merge';

import { getPayParam } from '../../actions';
import { pay as weixinPay } from '../../utils/wxBridge';

import TicketInfo from './TicketInfo';
import PaymentTool from './PaymentTool';
import PaymentSubmit from './PaymentSubmit';
import CardPacketListModal from '../../components/CardPacketListModal';
import RedPacketListModal from '../../components/RedPacketListModal';
import CodePacketListModal from '../../components/CodePacketListModal';
import Helper from '../../components/Helper';

import styles from './styles.css';

const { Alert } = Dialog;

class Payment extends Component {
  state = {
    selectedRedPacketId: null,
    selectedRedPacket: 0,
    selectedCodePacketId: null,
    selectedCodePacket: 0,
    selectedCardPacketId: null,
    selectedCardPacket: 0,
    openCardPacketModal: false,
    message: '',
    messageCallback: null,
  };

  get wxChannel() {
    return this.props.params.wxChannel || localStorage.getItem('wxChannel') || 'dypy';
  }

  render() {
    const { movie, cinema, showtime, seats, mobile, lockInfo, payParam } = this.props;
    const {
      selectedRedPacketId,
      selectedRedPacket,
      selectedCodePacketId,
      selectedCodePacket,
      selectedCardPacketId,
      selectedCardPacket,
      isOpenCardPacketModal,
      isOpenRedPacketModal,
      isOpenCodePacketModal,
      message,
      messageCallback,
    } = this.state;

  const total = seats.length * parseInt(showtime.price, 10) / 100;
  const selectCardPacket = selectedCardPacket <= total ? selectedCardPacket : total;
  // const checkedCode = selectedCodePacket != 0? parseInt(showtime.price, 10) / 100 : 0 ;
  var checkedCode = '';
  var selectedRedNum = '';
  var selectedCardNum = '';
  if( window.redarray != null){
  const arrayLength = window.redarray.length || 0;
  checkedCode = arrayLength == 0 ? 0 : ((arrayLength < seats.length) ? arrayLength*parseInt(showtime.price, 10) / 100 : total) ;
  selectedRedNum = window.redarray.length != 0 ? null : selectedRedPacket;
  selectedCardNum = window.redarray.length != 0 ? null : selectCardPacket;
  }
  else{
  selectedRedNum = selectedRedPacket;
  selectedCardNum = selectCardPacket;
  }
  
  const remain = parseFloat(total - selectedRedNum - selectedCardNum - checkedCode, 10);

    return (
      <div className={styles.container}>
        <TicketInfo movie={movie} cinema={cinema} showtime={showtime} />
        <PaymentTool
          seats={seats}
          showtime={showtime}
          mobile={mobile}
          onOpenCardPacketModal={() => payParam.cardPacketLock ? '' : this.handleOpenCardPacketModal()}
          onOpenCodePacketModal={() => payParam.cardPacketLock ? '' : this.handleOpenCodePacketModal()}
          onOpenRedPacketModal={() => payParam.cardPacketLock ? '' : this.handleOpenRedPacketModal()}
          // onOpenRedPacketModal={() => this.handleOpenRedPacketModal()}
          redPackets={lockInfo.redEnvelopes}
          cardPackets={lockInfo.piaoyouCards}
          codePackets={lockInfo.redeemCode}
          selectedCardPacket={selectedCardPacket}
          selectedRedPacket={selectedRedPacket}
          selectedCodePacket={selectedCodePacket}
          cardPacketLock={payParam.cardPacketLock} />
        <PaymentSubmit
          remain={remain}
          selectedCardPacket={selectedCardPacket}
          selectedRedPacket={selectedRedPacket}
          selectedCodePacket={selectedCodePacket}
          channel={this.wxChannel}
          endTime={new Date(lockInfo.playEndTime).getTime()}
          onSubmit={channel => this.handleSubmit(channel)}
          onExpire={() => this.handleExpire()}
          submitting={payParam.submitting} />
        <div className={styles.helpInfo}>
          <a href="tel:4008-123-867">客服电话：4008-123-867</a>
          <p>电影票友服务由北京亚视联合在线科技有限公司提供</p>
        </div>
        <Helper />
        {isOpenCardPacketModal && <CardPacketListModal
          cardPacketList={lockInfo.piaoyouCards}
          onSelect={(cardPacketId, amount) => this.handleSelectCardPacket(cardPacketId, amount)}
          onClose={() => this.handleCloseCardPacketModal()}
          />}
        {isOpenRedPacketModal && <RedPacketListModal
          redPacketList={lockInfo.redEnvelopes}
          onSelect={(redPacketId, amount) => this.handleSelectRedPacket(redPacketId, amount)}
          onClose={() => this.handleCloseRedPacketModal()}
          />}
        {isOpenCodePacketModal && <CodePacketListModal
          codePacketList={lockInfo.redeemCode}
          onSelect={(codePacketId, amount) => this.handleSelectCodePacket(codePacketId, amount)}
          onClose={() => this.handleCloseCodePacketModal()}
          onCheck={(codeId) => this.checkSelectCode(codeId)}
          />}  
        <Alert
          show={!!message}
          title="提示"
          buttons={[{
            label: '好的',
            onClick: () => {
              this.setState(merge({}, this.state, {
                message: '',
                messageCallback: null,
              }));
              messageCallback && messageCallback();
            }
          },]}>
            {message}
        </Alert>
      </div>
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.payParam !== this.props.payParam) {
      this.pay(nextProps.payParam);
    }
  }

  pay(payParam) {
    const { orderId, data, success, state, error, channel } = payParam;
    
    if (data && success) {

      if (channel === 'weixin') {
        // 微信支付
        weixinPay(data, error => {
          if (error) {
            this.setState(merge({}, this.state, {
              message: error,
            }));
          } else {
            location.href = `/${this.wxChannel}/pay/orderwait/${orderId}`;
          }
        });
      } else if ( channel === 'huafei') {
        $('body').append(decodeURIComponent(data));
      } else if ( channel === 'aLipay') {
        $('body').append(decodeURIComponent(data));
      } 
    } else if (success) {
      if( channel === 'direct' ){
        location.href = `/${this.wxChannel}/pay/orderwait/${orderId}`;
      }
    } else if (state === 0) {
      setTimeout(() => {
        this.handleSubmit(channel);
      }, .5e3);
    } else if (error) {
      this.setState(merge({}, this.state, {
        message: error,
      }));
    }
  }

  handleSubmit(channel) {
    const { lockInfo, getPayParam } = this.props;
    const { selectedRedPacketId, selectedCardPacketId, selectedCodePacketId } = this.state;
    var selectedCodeId = '';
    var selectedRedId = '';
    var selectedCardId = '';
    if(window.redarray!=null){
      selectedCodeId = window.redarray.join('&');
      selectedRedId = null;
      selectedCardId = null;
      getPayParam(channel, lockInfo.orderID, selectedRedId, selectedCardId, selectedCodeId, this.wxChannel);
      return;
    }
    getPayParam(channel, lockInfo.orderID, selectedRedPacketId, selectedCardPacketId, selectedCodePacketId, this.wxChannel);
  }

  handleExpire() {
    this.setState(merge({}, this.state, {
      message: '未在10分钟内完成支付，所选座位已被取消',
      messageCallback: () => {
        location.href = '/';
      }
    }));
  }


  checkSelectCode(codeId) {
    // $('strong:eq(0)').css('display',$('strong').css('display') == 'none' ? 'block' : 'none');
    for (var x = 0; x < $('i').length; x++) {
        if ($('i:eq(' + x + ')').text() == codeId) {
            var iParent = $('i:eq(' + x + ')').parent().parent().parent().find('strong');

            iParent.css('display', iParent.css('display') == 'none' ? 'block' : 'none');
            if (iParent.css('display') == 'block') {
                if (window.redarray == null) {
                    window.redarray = new Array(iParent.parent().find('i').text());
                    // console.log(window.redarray);
                } else {
                    var array = window.redarray;
                    var id = iParent.parent().find('i').text();
                    for (var i = 0; i < array.length; i++) {
                        if (id == array[i]) {
                            return;
                        }
                    }
                    window.redarray.push(iParent.parent().find('i').text());
                    // console.log(window.redarray);
                }
            } else {
                if (window.redarray == null) {
                    // window.redarray=new Array(iParent.parent().find('i').text());
                    // console.log(window.redarray);
                } else {
                    for (var i = 0; i < window.redarray.length; i++) {
                        if (iParent.parent().find('i').text() == window.redarray[i]) {
                            window.redarray.splice(i, 1);
                            // console.log(window.redarray);
                        }
                    }
                }
            }
        }

    }
}


  // 关闭卡包
  handleCloseCardPacketModal() {
    this.setState(merge({}, this.state, {
      isOpenCardPacketModal: false,
    }));
  }

  // 关闭红包
  handleCloseRedPacketModal() {
    this.setState(merge({}, this.state, {
      isOpenRedPacketModal: false,
    }));
  }

  // 关闭兑换码
  handleCloseCodePacketModal() {
    this.setState(merge({}, this.state, {
      isOpenCodePacketModal: false,
    }));
  }

  // 打开卡包
  handleOpenCardPacketModal() {
    this.setState(merge({}, this.state, {
      isOpenCardPacketModal: true,
      isOpenRedPacketModal: false,
      isOpenCodePacketModal: false,
    }));
  }

  // 打开红包
  handleOpenRedPacketModal() {
    this.setState(merge({}, this.state, {
      isOpenRedPacketModal: true,
      isOpenCardPacketModal: false,
      isOpenCodePacketModal: false,
    }));
  }

  // 打开兑换码
  handleOpenCodePacketModal() {
    this.setState(merge({}, this.state, {
      isOpenCodePacketModal: true,
      isOpenRedPacketModal: false,
      isOpenCardPacketModal: false,
    }));
  }

  // 选择卡包
  handleSelectCardPacket(cardPacketId, amount) {
    this.setState(merge({}, this.state, {
      selectedCardPacketId: cardPacketId,
      selectedCardPacket: amount,
      selectedRedPacketId: null,
      selectedRedPacket: 0,
      selectedCodePacketId: null,
      selectedCodePacket: 0,
      isOpenCardPacketModal: false,
    }));
  }

  // 选择红包
  handleSelectRedPacket(redPacketId, amount) {
    this.setState(merge({}, this.state, {
      selectedRedPacketId: redPacketId,
      selectedRedPacket: amount,
      selectedCardPacketId: null,
      selectedCardPacket: 0,
      selectedCodePacketId: null,
      selectedCodePacket: 0,
      isOpenRedPacketModal: false,
    }));
  }

  // 选择兑换码
  handleSelectCodePacket(codePacketId, amount) {
    this.setState(merge({}, this.state, {
      selectedCodePacketId: codePacketId,
      selectedCodePacket: amount,
      selectedCardPacketId: null,
      selectedCardPacket: 0,
      selectedRedPacketId: null,
      selectedRedPacket: 0,
      isOpenCodePacketModal: false,
    }));
  }
}

function mapStateToProps(state, ownProps) {
  const movie = JSON.parse(localStorage.getItem('movie') || '{}');
  // const movie = {'movieID':292,'movieNameCN':'美国队长3','movieNameEN':'','movieImage':'http://image.moviefan.com.cn/Movie/2016-4-28/635974456520549641.jpg','movieVersions':'IMAX3D,中国巨幕3D','intro':'奥创留后患，联盟生内乱','isBuyTicket':true,'isFriendsPay':false,'isMoneyPacket':false};

  const cinema = JSON.parse(localStorage.getItem('cinema') || '{}');
  // const cinema = {'cinemaID':2750,'cinemaName':'嘉禾北京上地影城','cinemaAddress':'海淀区上地南口华联商厦4F','provinceID':0,'cityID':110100,'districtID':0,'provinceName':null,'cityName':null,'districtName':null,'showTimeCount':null,'voucherNote':null,'retailPrice':null,'limitPrice':null,'latitude':0,'longitude':0,'isTicket':false,'RecentShowtime':null};

  const showtime = JSON.parse(localStorage.getItem('showtime') || '{}');
  // const showtime = {'showtimeID':70454652,'movieID':292,'cinemaID':2750,'hallID':1147,'hallName':'4号厅','version':'3D','language':'英文版','ticketStartTime':'22:05','ticketEndTime':'23:35结束','price':'6000','retailPrice':'6800','voucherNote':'猴年特惠减8.00元','showTime':'2016-05-15 22:05','duration':90,'stopSellTime':true,'isSun':false};
  const seats = JSON.parse(localStorage.getItem(`seats_${showtime.showtimeID}`) || '[]').map(seat => seat.split('@')[1]);
  // const seats = ['3排02座','3排03座','3排05座','3排06座'];

  const mobile = localStorage.getItem('tel');
  // const mobile = '18612258193';

  const lockInfo = JSON.parse(localStorage.getItem(`lockseats_${showtime.showtimeID}`) || '{}');
  // const lockInfo = {
  //   "orderID":"4978","lockTime":5,"movieName":null,"version":null,"showTime":null,"cinemaID":0,"seatIDs":null,"seatNames":null,
  //   "playEndTime":"2016/5/22 19:00:00","movieID":0,
  //   piaoyouCards: [
  //     {
  //       piaoyouCardID: 1,
  //       denomination: 100,
  //       remainder: 50,
  //       startTime: '2016-05-15 10:00:00',
  //       endTime: '2016-05-25 10:00:00',
  //     },
  //     {
  //       piaoyouCardID: 2,
  //       denomination: 200,
  //       remainder: 60,
  //       startTime: '2016-05-15 10:00:00',
  //       endTime: '2016-05-25 10:00:00',
  //     },
  //     {
  //       piaoyouCardID: 1,
  //       denomination: 100,
  //       remainder: 50,
  //       startTime: '2016-05-15 10:00:00',
  //       endTime: '2016-05-25 10:00:00',
  //     },
  //     {
  //       piaoyouCardID: 2,
  //       denomination: 200,
  //       remainder: 60,
  //       startTime: '2016-05-15 10:00:00',
  //       endTime: '2016-05-25 10:00:00',
  //     },
  //     {
  //       piaoyouCardID: 1,
  //       denomination: 100,
  //       remainder: 50,
  //       startTime: '2016-05-15 10:00:00',
  //       endTime: '2016-05-25 10:00:00',
  //     },
  //     {
  //       piaoyouCardID: 2,
  //       denomination: 200,
  //       remainder: 60,
  //       startTime: '2016-05-15 10:00:00',
  //       endTime: '2016-05-25 10:00:00',
  //     },
  //   ],
    // "redEnvelopes":[
    //   {"redEnvelopeID":"1","money":20,"lowest":50,"endTime":"2015-07-23 03:05:00","status":"1","remarks":"只能在本平台使用"},
    //   {"redEnvelopeID":"1","money":20,"lowest":50,"endTime":"2015-07-23 03:05:00","status":"2","remarks":"只能在本平台使用"},
    //   {"redEnvelopeID":"1","money":20,"lowest":50,"endTime":"2015-07-23 03:05:00","status":"3","remarks":"只能在本平台使用"},
    //   {"redEnvelopeID":"1","money":20,"lowest":50,"endTime":"2015-07-23 03:05:00","status":"1","remarks":"只能在本平台使用"},
    // ],
    // "redeemCode":[
    //   {"id":"1","endTime":"2016/12/6 11:17:47","movieName":"《奇异博士》","type","普通兑换券","cinema","全国影院","state",1},
    // ]
  // };

  let payParam = {};
  if (state.payParam.orderId === lockInfo.orderID) {
    payParam = state.payParam;
  }

  return {
    movie,
    cinema,
    showtime,
    mobile,
    seats,
    lockInfo,
    payParam,
  };
}

export default connect(mapStateToProps, {
  getPayParam,
})(Payment);
