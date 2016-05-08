import React, {PropTypes} from 'react';

var styles = require('./styles.css');

const VideoPlayIcon = ({ small }) => {
  return (
    <i className={[styles.normal, small ? styles.small : ''].join(' ')}></i>
  );
};

export default VideoPlayIcon;
