import React from 'react';

import styles from './styles.css';

const Modal = ({ title, children, onClose }) => {
  return (
    <div className={styles.modal}>
      <div onClick={onClose} className={styles.close}></div>
      <div className={styles.container}>
        {title ? <div className={styles.title}>{title}</div> : null}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
