import React from 'react';
import { Link } from 'react-router';

import styles from './styles.css';

const Helper = () => {
  return (
    <div className={styles.container}>
      <Link to='/' />
    </div>
  );
};

export default Helper;
