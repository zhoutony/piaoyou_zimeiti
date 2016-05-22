import React from 'react';

import Modal from '../Modal';

import styles from './styles.css';

const RedPacketListModal = ({ redPacketList, onSelect, onClose }) => {
  return (
    <Modal title='红包' onClose={onClose}>
      <ul className={styles.list}>
        {redPacketList.map((redPacket) => {
          const { redEnvelopeID, status, money, lowest, remarks, endTime } = redPacket;

          return (
            <li
              className={[styles.item, status === '1' ? styles.available : ''].join(' ')}
              onClick={() => onSelect(redEnvelopeID, money)}>
              <div className={styles.info}>
                <div className={styles.amount}>
                  <p>红包</p>
                  <p>￥{money}</p>
                </div>
                <div className={styles.condition}>
                  <p>仅可购买电影票</p>
                  <p>满{lowest}元可用</p>
                </div>
              </div>
              <div className={styles.limit}>
                <p>{remarks}</p>
                <span>{endTime}到期</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
};

export default RedPacketListModal;
