import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Dialog, Toast } from 'react-weui';
import merge from 'lodash/merge';

import TicketInfo from './TicketInfo';
import PaymentTool from './PaymentTool';
import PaymentSubmit from './PaymentSubmit';
import Helper from '../../components/Helper';

import styles from './styles.css';

const { Alert } = Dialog;

class Payment extends Component {
  state = {
    selectedRedPacket: 0,
    selectedCardPacket: 0,
    message: '',
  };

  render() {
    const { movie, cinema, showtime, seats, mobile, lockInfo, submitted } = this.props;
    const { selectedRedPacket, selectedCardPacket, message } = this.state;

    return (
      <div className={styles.container}>
        <TicketInfo movie={movie} cinema={cinema} showtime={showtime} />
        <PaymentTool
          seats={seats}
          showtime={showtime}
          mobile={mobile}
          selectedCardPacket={selectedCardPacket}
          selectedRedPacket={selectedRedPacket} />
        <PaymentSubmit
          endTime={new Date(lockInfo.playEndTime).getTime()}
          onSubmit={() => this.handleSubmit()}
          onExpire={() => this.handleExpire()}
          submitted={submitted} />
        <div className={styles.helpInfo}>
          <a href="tel:4008-123-867">客服电话：4008-123-867</a>
          <p>电影票友服务由北京亚视联合在线科技有限公司提供</p>
        </div>
        <Alert
          show={!!message}
          title="提示"
          buttons={[{
            label: '好的',
            onClick: () => {location.href = '/';}
          },]}>
            {message}
        </Alert>
        <Helper />
      </div>
    );
  }

  handleSubmit() {

  }

  handleExpire() {
    this.setState(merge({}, this.state, {
      message: '未在10分钟内完成支付，所选座位已被取消',
    }));
  }
}

function mapStateToProps(state, ownProps) {
  // const movie = JSON.parse(localStorage.getItem('movie') || '{}');
  const movie = {'movieID':292,'movieNameCN':'美国队长3','movieNameEN':'','movieImage':'http://image.moviefan.com.cn/Movie/2016-4-28/635974456520549641.jpg','movieVersions':'IMAX3D,中国巨幕3D','intro':'奥创留后患，联盟生内乱','isBuyTicket':true,'isFriendsPay':false,'isMoneyPacket':false};

  // const cinema = JSON.parse(localStorage.getItem('cinema') || '{}');
  const cinema = {'cinemaID':2750,'cinemaName':'嘉禾北京上地影城','cinemaAddress':'海淀区上地南口华联商厦4F','provinceID':0,'cityID':110100,'districtID':0,'provinceName':null,'cityName':null,'districtName':null,'showTimeCount':null,'voucherNote':null,'retailPrice':null,'limitPrice':null,'latitude':0,'longitude':0,'isTicket':false,'RecentShowtime':null};

  // const showtime = JSON.parse(localStorage.getItem('showtime') || '{}');
  const showtime = {'showtimeID':70454652,'movieID':292,'cinemaID':2750,'hallID':1147,'hallName':'4号厅','version':'3D','language':'英文版','ticketStartTime':'22:05','ticketEndTime':'23:35结束','price':'6000','retailPrice':'6800','voucherNote':'猴年特惠减8.00元','showTime':'2016-05-15 22:05','duration':90,'stopSellTime':true,'isSun':false};
  // const seats = JSON.parse(localStorage.getItem(`seats_${showtime.showtimeID}`) || '[]').map(seat => seat.split('#')[1]);
  const seats = ['3排02座','3排03座','3排05座','3排06座'];

  // const mobile = localStorage.getItem('tel');
  const mobile = '18612258193';

  // const lockInfo = JSON.parse(localStorage.getItem(`lockseats_${showtime.showtimeID}`) || '{}');
  const lockInfo = {"orderID":"4978","lockTime":5,"movieName":null,"version":null,"showTime":null,"cinemaID":0,"seatIDs":null,"seatNames":null,"playEndTime":"2016/5/15 18:10:00","movieID":0};

  const submitted = false;

  return {
    movie,
    cinema,
    showtime,
    mobile,
    seats,
    lockInfo,
    submitted,
  };
}

export default connect(mapStateToProps, {})(Payment);
