import React, {PropTypes} from 'react';
import cookies from 'browser-cookies';

import styles from './styles.css';

const BottomNav = ({ current, wxChannel }) => {
  const cityId = JSON.parse(cookies.get('city') || '{"locationId": 110100}').locationId;
  const items = [
    { id: 'home', label: '推荐', url: `/${wxChannel}` },
    { id: 'ticket', label: '购票', url: `/${wxChannel}/${cityId}/filmlist/hot` },
    { id: 'movies', label: '电影', url: `/${wxChannel}/movies` },
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
