import React from 'react';

import Modal from '../Modal';

import styles from './styles.css';

const RedPacketListModal = ({ redPacketList, onSelect, onClose }) => {
  return (
    <Modal title='红包' onClose={onClose}>
      <ul className={styles.list}>
        {redPacketList.map((redPacket) => {
          const { Id, price, cinema, endTime, movieName } = redPacket;
          const finalPrice = price/100;
          return (
            <li
              className={[styles.item, styles.available ].join(' ')}
              onClick={() => onSelect(Id, finalPrice)}>
              <div className={styles.info}>
                <div className={styles.amount}>
                  <p>红包</p>
                  <p>￥{finalPrice}</p>
                </div>
                <div className={styles.condition}>
                  <p>{movieName}观影红包</p>
                  <p>{cinema}、限3D</p>
                  <p>限50元以内场次</p>
                </div>
              </div>
              <div className={styles.limit}>
                <p>只能在本平台使用</p>
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
