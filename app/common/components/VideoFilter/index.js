import React, {Component, PropTypes} from 'react';
import chunk from 'lodash/chunk';

import styles from './styles.css';

const firstFilters = [
  { value: 0, label: '免费' },
  { value: 1, label: '会员' },
];

const secondFilters = chunk([
  { value: '喜剧', label: '喜剧' },
  { value: '动作', label: '动作' },
  { value: '爱情', label: '爱情' },
  { value: '恐怖', label: '恐怖' },
  { value: '科幻', label: '科幻' },
  { value: '动画', label: '动画' },
  { value: '剧情', label: '剧情' },
  { value: '伦理', label: '伦理' },
], 4);

const FirstFilter = ({ current, onChange }) => {

  return (
    <ul className={styles.firstFilters}>
      {firstFilters.map((filter) => {
        const isCurrent = current === filter.value;
        const className = isCurrent ? styles.current : '';
        return (
          <li onClick={() => {!isCurrent && onChange(filter.value);}}>
            <span className={className}>{filter.label}</span>
          </li>);
      })}
    </ul>
  );
};

const SecondFilter = ({ current, onChange }) => {
  return (
    <div className={styles.secondFilters}>
      {secondFilters.map((filters) => {
        return (
          <ul>
          {filters.map((filter) => {
            const isCurrent = current === filter.value;
            const className = isCurrent ? styles.current : '';
            return (
              <li
                className={className}
                onClick={() => {!isCurrent && onChange(filter.value);}}>
                {filter.label}
              </li>
            );
          })}
          </ul>
        );
      })}
    </div>
  );
};

const VideoFilter = ({ filters, onChange, className='' }) => {
  return (
    <div className={[styles.container, className].join(' ')}>
      <FirstFilter current={filters[0]} onChange={(value) => {
        onChange([value, filters[1]]);
      }} />
      <SecondFilter current={filters[1]} onChange={(value) => {
        onChange([filters[0], value]);
      }} />
    </div>
  );
};

export default VideoFilter;
