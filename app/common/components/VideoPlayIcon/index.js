import React, {PropTypes} from 'react';

var styles = require('./styles.css');

const VideoPlayIcon = ({ small, duration }) => {
  return (
    <div className={styles.overlay}>
      <span className={[styles.normal, small ? styles.small : ''].join(' ')}>
        {(duration && !small) ? <i className={styles.duration}>{duration}</i> : null}
      </span>
    </div>
  );
};

export default VideoPlayIcon;
