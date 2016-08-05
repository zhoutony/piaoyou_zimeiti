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

  render() {
    let { onSubmit, submitting, channel } = this.props;
    const { endTime } = this.state;
    const remainTime = endTime - new Date().getTime();

    if (submitting) {
      onSubmit = _.noop;
    }

    return (
      <div className={styles.paymentSubmit}>
        <p className={styles.warn}>
          <span className={[icons.icon, icons['icon-cancel-circled2']].join(' ')}>不支持退款</span>
          <span className={[icons.icon, icons['icon-cancel-circled2']].join(' ')}>不支持更换场次</span>
        </p>
        <p className={styles.buttonContainer}>
          {channel === 'huafeigouApp' ?
            null :
            <span
            className={classNames({ [styles.submit]: true, [styles.submitting]: submitting })}
            onClick={() => onSubmit('weixin')}>{submitting ? '正在支付...' : '微信支付'}</span>
          }
          <span
          className={classNames({ [styles.submit]: true, [styles.submitting]: submitting })}
          onClick={() => onSubmit('huafei')}>{submitting ? '正在支付...' : '话费购支付'}</span>
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
