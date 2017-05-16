import _ from 'lodash';
import React, {Component} from 'react';
import moment from 'moment';
import classNames from 'classnames';

import styles from './styles.css';
import icons from '../../fonts/hello/styles.css';

function fillZero(number) {
  return ('0' + number).slice(-2);
}

function formatDuration(duration) {
  const durationObj = moment.duration(duration, 'milliseconds');
  const minutes = durationObj.minutes();
  const seconds = durationObj.seconds();

  return `${fillZero(minutes)}分${fillZero(seconds)}秒`;
}

class PaymentSubmit extends Component{
  constructor(props) {
    super(props);
    const { endTime } = props;

    this.state = {
      endTime,
    };
  }

  componentWillMount() {
    this.countdown();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      endTime: nextProps.endTime,
    });
  }

  countdown() {
    const { endTime, onExpire } = this.props;
    const current = new Date().getTime();
    const remainTime = endTime - current;

    if (remainTime > 0) {
      this.setState({
        flush: current,
      });
    } else {
      onExpire();
    }

    this.countdownTime = setTimeout(() => this.countdown(), 1e3);
  }

  componentWillUnmount() {
    clearTimeout(this.countdownTime);
  }

  is_weixn(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
        return true;  
    } else {  
        return false;  
    }  
}

  render() {
    let { onSubmit, submitting, channel, remain, selectedCodePacket, selectedCardPacket, selectedRedPacket } = this.props;
    const { endTime } = this.state;
    const remainTime = endTime - new Date().getTime();

    if (submitting) {
      onSubmit = _.noop;
    }
    // if (selectedCodePacket != 0) {
    //   remain = 0;
    // }
    // console.log(this.props.remain)
    return (
      <div className={styles.paymentSubmit}>
        <p className={styles.warn}>
          <span className={[icons.icon, icons['icon-cancel-circled2']].join(' ')}>不支持退款</span>
          <span className={[icons.icon, icons['icon-cancel-circled2']].join(' ')}>不支持更换场次</span>
        </p>
        <p className={styles.buttonContainer}>
          {channel === 'huafeigouApp' || channel === 'huafeigouWeixin' || remain === 0 || !this.is_weixn()?
            null :
            <span
            className={classNames({ [styles.submit]: true, [styles.submitting]: submitting })}
            onClick={() => onSubmit('weixin')}>{submitting ? '正在支付...' : '微信支付'}</span>
          }
          {remain === 0 || selectedCodePacket != 0 || selectedCardPacket != 0 || selectedRedPacket != 0?
            null :
          <span
          className={classNames({ [styles.submit]: true, [styles.submitting]: submitting })}
          onClick={() => onSubmit('huafei')}>{submitting ? '正在支付...' : '联通话费支付'}</span>
          }
          {remain != 0?
            null :
            <span
            className={classNames({ [styles.submit]: true, [styles.submitting]: submitting })}
            onClick={() => onSubmit('direct')}>{submitting ? '正在支付...' : '立即支付'}</span>
          }
          {this.is_weixn() || remain == 0 || channel === 'huafeigouApp' || channel === 'huafeigouWeixin' ?
            null :
            <span
            className={classNames({ [styles.submit]: true, [styles.submitting]: submitting })}
            onClick={() => onSubmit('aLipay')}>{submitting ? '正在支付...' : '支付宝支付'}</span>
          }
          
        </p>
        <p className={styles.remainTime}>
          支付剩余时间&nbsp;&nbsp;
          <span>{remainTime > 0 ? formatDuration(remainTime) : '支付时间已过期'}</span>
        </p>
      </div>
    );
  }
}

export default PaymentSubmit;
