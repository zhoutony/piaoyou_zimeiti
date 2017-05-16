import React from 'react';
import $ from 'jquery';
import Modal from '../Modal';

import styles from './styles.css';

const CodePacketListModal = ({ codePacketList, onSelect, onClose, onCheck }) => {
  return (
    <Modal title='兑换码' onClose={onClose}>
      <ul className={styles.list}>
        {codePacketList.map((redPacket) => {
          const { Id, state, type, movieName, cinema, endTime, limitPrice } = redPacket;
          var index = $.inArray(Id.toString(),window.redarray);
          return (
            <li
              className={[styles.item, state === 0 ? styles.available : ''].join(' ')}
              onClick={() => onCheck(Id)}>
              <strong className={index === -1 ? styles.strong : styles.strong2 }>已选中</strong>
              <div className={styles.info}>
                <div className={styles.amount}>
                  <p>兑换券</p>
                  <p>类型：{type}</p>
                  <i className={styles.idNone}>{Id}</i>
                </div>
                <div className={styles.condition}>
                  <p>{movieName}电影票在线选座兑换券</p>
                  <p>{cinema}</p>
                  <p>{limitPrice}</p>
                </div>
              </div>
              <div className={styles.limit}>
                <p>只能在本平台使用</p>
                <span>{endTime}到期</span>
              </div>
            </li>
          );
        })}
        <div className={styles.checkCode} onClick={onClose}>确定</div>
      </ul>
      
    </Modal>
  );
};

export default CodePacketListModal;
