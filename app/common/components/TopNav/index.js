import React, {PropTypes} from 'react';
import { Link } from 'react-router';

var styles = require('./styles.css');

const TopNav = ({ channel }) => {
  const items = [
    { id: 'all', label: '推荐', link: '/' },
    { id: 'videos', label: '视频', link: 'videos' },
    { id: 'movies', label: '在线电影', link: 'movies' },
  ].map(function(item) {
    let classNames = [styles.item];

    if (item.id === channel) {
      classNames.push(styles.current);
    }

    return (
      <Link to={item.link} className={classNames.join(' ')}>
        {item.label}
      </Link>
    );
  });

  return (
    <div className={styles.container}>
      {items}
      <a href='/selflist' className={styles.item}>订阅</a>
    </div>
  );
};

export default TopNav;
