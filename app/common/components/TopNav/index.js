import React, {PropTypes} from 'react';
import { Link } from 'react-router';

var styles = require('./styles.css');

const TopNav = ({ channel }) => {
  const items = [
    { id: 'all', label: '推荐 Explore', link: '/' },
    { id: 'videos', label: '视频 Video', link: 'videos' },
    { id: 'movies', label: '电影 Movie', link: 'movies' },
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
      <a href='/selflist' className={styles.item}>订阅 Following</a>
    </div>
  );
};

export default TopNav;
