import React from 'react';

import Modal from '../Modal';

import styles from './styles.css';

const CardPacketListModal = ({ cardPacketList, onSelect, onClose }) => {
  return (
    <Modal title='票友卡' onClose={onClose}>
      <ul className={styles.list}>
        {cardPacketList.map((cardPacket) => {
          return (
            <li
              className={styles.item}
              onClick={() => onSelect(cardPacket.piaoyouCardID, cardPacket.remainder)}>
              <h3>
                金额：<span>￥{cardPacket.remainder}</span>
              </h3>
              <p>票友卡：{cardPacket.denomination}元</p>
              <p>有效期：{cardPacket.startTime}至{cardPacket.endTime}</p>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
};

export default CardPacketListModal;
