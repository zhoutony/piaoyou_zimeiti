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

  render() {
    const { onSubmit, submitted } = this.props;
    const { endTime } = this.state;
    const remainTime = endTime - new Date().getTime();

    return (
      <div className={styles.paymentSubmit}>
        <p className={styles.warn}>
          <span className={icons['icon-cancel-circled2']}>不支持退款</span>
          <span className={icons['icon-cancel-circled2']}>不支持更换场次</span>
        </p>
        <span
          className={classNames({ [styles.submit]: true, [styles.submitted]: submitted })}
          onClick={onSubmit}>{submitted ? '正在支付，请稍后...' : '立即支付'}</span>
        <p className={styles.remainTime}>
          支付剩余时间&nbsp;&nbsp;
          <span>{remainTime > 0 ? formatDuration(remainTime) : '支付时间已过期'}</span>
        </p>
      </div>
    );
  }
}

export default PaymentSubmit;
