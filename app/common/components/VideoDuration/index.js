import React, {PropTypes} from 'react';

var styles = require('./styles.css');

const VideoDuration = ({ duration }) => {
  return (
    <span className={styles.container}>
      {duration}
    </span>
  );
};

export default VideoDuration;
