import React, {PropTypes} from 'react';
import cookies from 'browser-cookies';

import styles from './styles.css';

const BottomNav = ({ current, wxChannel }) => {
  const cityId = JSON.parse(cookies.get('city') || '{"locationId": 110100}').locationId;
  const items = [
    { id: 'home', label: '头条', url: '/' },
    { id: 'movie', label: '电影', url: `/${wxChannel}/${cityId}/filmlist/hot` },
    { id: 'explore', label: '发现', url: `/${wxChannel}/selflist` },
    { id: 'my', label: '我的', url: `/${wxChannel}/my/index` },
  ].map(function(item) {
    let classNames = [styles.item, styles[item.id]];

    if (item.id === current) {
      classNames.push(styles.current);
    }

    return (
      <li
        className={classNames.join(' ')}
        onClick={() => {location.href = item.url;} }>
        {item.label}
      </li>
    );
  });

  return (
    <ul className={styles.container}>
      {items}
    </ul>
  );
};

export default BottomNav;
