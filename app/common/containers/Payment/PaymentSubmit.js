import React, {Component} from 'react';
import moment from 'moment';

import styles from './styles.css';

function fillZero(number) {
  return ('0' + number).slice(-2);
}

function formatDuration(duration) {
  const durationObj = moment.duration(duration, 'seconds');
  const minutes = durationObj.minutes();
  const seconds = durationObj.seconds();

  return `${fillZero(minutes)}分${fillZero(seconds)}秒`;
}

class PaymentSubmit extends Component{
  constructor(props) {
    this.setState({
      remainTime: new Date().getTime() - props.endTime,
    });
    this.countdown();

    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      remainTime: new Date().getTime() - nextProps.endTime,
    });

    super(nextProps);
  }

  countdown() {
    const remainTime = this.state.remainTime - 1e3;

    if (endTime > 0) {
      this.setState({
        remainTime,
      });
    }

    this.countdownTime = setTimeout(() => this.countdown(), 1e3);
  }

  componentWillUnmount() {
    clearTimeout(this.countdownTime);
  }

  render() {
    const { remainTime } = this.state;

    return (
      <div className={styles.paymentSubmit}>
        <p className={styles.warn}>
          <span>不支持退款</span>
          <span>不支持更换场次</span>
        </p>
        <button className={styles.submit}>立即支付</button>
        <p classname={styles.remainTime}>
          支付剩余时间&nbsp;&nbsp;{remainTime > 0 ? formatDuration(remainTime) : '支付时间已过期'}
        </p>
      </div>
    );
  }
}

export default PaymentSubmit;
