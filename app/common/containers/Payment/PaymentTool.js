import React from 'react';

import styles from './styles.css';

const PaymentTool = ({
  seats,
  showtime,
  mobile,
  redPackets,
  onOpenRedPacketModal,
  selectedRedPacket,
  cardPackets,
  onOpenCardPacketModal,
  selectedCardPacket,
  codePackets,
  onOpenCodePacketModal,
  selectedCodePacket,
  cardPacketLock,
}) => {
  const total = seats.length * parseInt(showtime.price, 10) / 100;
  selectedCardPacket = selectedCardPacket <= total ? selectedCardPacket : total;
  // const checkedCode = selectedCodePacket != 0? parseInt(showtime.price, 10) / 100 : 0 ;
  var checkedCode = '';
  var selectedRedNum = '';
  var selectedCardNum = '';
  if( window.redarray != null){
  const arrayLength = window.redarray.length || 0;
  checkedCode = arrayLength == 0 ? 0 : ((arrayLength < seats.length) ? arrayLength*parseInt(showtime.price, 10) / 100 : total) ;
  selectedRedNum = window.redarray.length != 0 ? null : selectedRedPacket;
  selectedCardNum = window.redarray.length != 0 ? null : selectedCardPacket;
  }
  else{
  selectedRedNum = selectedRedPacket;
  selectedCardNum = selectedCardPacket;
  }
  
  const remainInt = parseFloat(total - selectedRedNum - selectedCardNum - checkedCode, 10) + '';
  const remain = remainInt.indexOf(".") != -1 ? remainInt.substring(0,remainInt.indexOf(".") + 3) : remainInt ;

  return (
    <ul className={styles.paymentTool}>
      <li className={styles.selected}>
        <ul>
          {seats.map(seat => <li>{seat}</li>)}
        </ul>
        <span>¥&nbsp;{total}</span>
      </li>
      <li
        onClick={onOpenRedPacketModal}
        className={[styles.redPacket, redPackets ? styles.hasPacket : '', cardPacketLock ? styles.cardPacketLocks : ''].join(' ')}>
        {redPackets != '' ? (selectedRedNum ? `${selectedRedNum}元` : `${redPackets.length}张 点击使用`) : '无可用'}
      </li>
      <li
        onClick={onOpenCardPacketModal}
        className={[styles.cardPacket, cardPackets ? styles.hasPacket : '', cardPacketLock ? styles.cardPacketLocks : ''].join(' ')}>
        {cardPackets != '' ? (selectedCardNum ? `${selectedCardNum}元` : `${cardPackets.length}张 点击使用`) : '无可用'}
      </li>
      <li
        onClick={onOpenCodePacketModal}
        className={[styles.codePacket, codePackets ? styles.hasPacket : '', cardPacketLock ? styles.cardPacketLocks : ''].join(' ')}>
        {codePackets != '' ? (selectedCodePacket ? `${selectedCodePacket}` : `${codePackets.length}张 点击使用`) : '无可用'}
      </li>
      <li className={styles.mobile}>{mobile}</li>
      <li className={styles.remain}>¥&nbsp;{remain}</li>
    </ul>
  );
};

export default PaymentTool;
