import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import moment from 'moment';

moment.locale('zh-cn');

import VideoDuration from '../../components/VideoDuration';
import VideoPlayIcon from '../../components/VideoPlayIcon';

import styles from './styles.css';

const NewsCover = ({ news, image }) => {
  let videoInfo;

  if (news.newType === 'video') {
    videoInfo = [];
    videoInfo.push(<VideoDuration duration={news.videoDuration} />);
    videoInfo.push(<VideoPlayIcon small={news.showType === 'small'}/>);
  }

  return (
    <div className={styles.cover}>
      <img src={image}/>
      {videoInfo}
    </div>
  );
};

const News = ({ news, wxChannel }) => {
  const {
    newID, NewTopType, showType, publishID, publishName, title, summary, url, publishtime, count, images
  } = news;

  let contentClassNameList = [styles.content];
  if (showType === 'small') {
    contentClassNameList.push(styles.smallContent);
  }

  return (
    <Link
      to={`/${wxChannel}/movienews/${publishID}/${newID}`}
      onClick={(event) => {
        if (url) {
          event.preventDefault();
          location.href = url;
        }
      }}>
      <div className={styles.container}>
        <div className={contentClassNameList.join(' ')}>
          <div className={styles.covers}>
            {images.map((image) => <NewsCover news={news} image={image} />)}
          </div>
          <div className={styles.desc}>
            <h2 className={styles.title}>
              {title}
            </h2>
            <p className={styles.summary}>
              {summary}
            </p>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.info}>
            <span className={styles.publishName}>{publishName}</span>
            <span>{moment(publishtime, 'YYYY-MM-DD HH:mm:ss').fromNow()}</span>
            <span>阅读 {count}</span>
            {NewTopType ? <span className={styles.tag}>{NewTopType}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default News;
