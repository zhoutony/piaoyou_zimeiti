import React, {PropTypes} from 'react';

var styles = require('./styles.css');

const VideoPlayIcon = ({ small }) => {
  return (
    <div className={styles.overlay}>
      <i className={[styles.normal, small ? styles.small : ''].join(' ')}></i>
    </div>
  );
};

export default VideoPlayIcon;
