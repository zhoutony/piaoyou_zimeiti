import React from 'react';

import styles from './styles.css';

const PaymentTool = ({
  seats,
  showtime,
  mobile,
  redPackets,
  selectedRedPacket,
  cardPackets,
  selectedCardPacket,
}) => {
  const total = seats.length * parseInt(showtime.price, 10) / 100;
  const remain = parseInt(total - selectedRedPacket - selectedCardPacket, 10);

  return (
    <ul className={styles.paymentTool}>
      <li className={styles.selected}>
        <ul>
          {seats.map(seat => <li>{seat}</li>)}
        </ul>
        <span>¥&nbsp;{total}</span>
      </li>
      <li className={[styles.redPacket, redPackets ? styles.hasPacket : ''].join('')}>
        {redPackets ? (selectedRedPacket ? `${selectedRedPacket}元` : `${redPackets.length}张`) : '无可用'}
      </li>
      <li className={[styles.cardPacket, cardPackets ? styles.hasPacket : ''].join('')}>
        {cardPackets ? (selectedCardPacket ? `${selectedCardPacket}元` : `${cardPackets.length}张`) : '无可用'}
      </li>
      <li className={styles.mobile}>{mobile}</li>
      <li className={styles.remain}>¥&nbsp;{remain}</li>
    </ul>
  );
};

export default PaymentTool;
