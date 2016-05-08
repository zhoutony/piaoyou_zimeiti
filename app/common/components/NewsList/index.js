import React, {PropTypes} from 'react';

import News from '../News';

import styles from './styles.css';

const NewsList = ({ newsList, wxChannel }) => {
  return (
    <div className={styles.container}>
      {newsList.map((news) => <News news={news} wxChannel={wxChannel}/>)}
    </div>
  );
};

export default NewsList;
