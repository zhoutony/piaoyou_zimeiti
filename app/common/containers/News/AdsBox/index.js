import React from 'react';
import cookies from 'browser-cookies';

import styles from './styles.css';
import VideoPlayIcon from '../../../components/VideoPlayIcon';
import Carousel from '../../../components/Carousel';

const Ticket = ({ movie }) => {
  const { director, actors, releaseTime, filmLength, intro, movieID, MinPrice } = movie;
  const infos = [
    movie.movieNameCN,
    `导演：${director}`,
    `演员：${actors}`,
    `日期：${releaseTime}`,
    `时长：${filmLength}分`,
    `影评：${intro}`,
  ];
  const cityId = JSON.parse(cookies.get('city') || '{"locationId": 110100}').locationId;

  return (
    <a
      className={styles.movie}
      href={`/dypy/${cityId}/ticket/${movieID}`}>
      <div className={styles.cover}>
        <img src={movie.movieImage} />
      </div>
      <ul>
        {infos.map((info) => <li>{info}</li>)}
      </ul>
      <span className={styles.buy}>
        { MinPrice ? <span className={styles.minPrice}>¥{(MinPrice/100).toFixed(2)}</span> : null }
        购票
      </span>
    </a>
  );
};

const Image = ({ info }) => {
  return (
    <a
      className={styles.image}
      href={info.url}>
      <img src={info.imageUrl}/>
      {info.advertisementType === 'video' ? <VideoPlayIcon /> : null}
      <p className={styles.title}>{info.title}</p>
    </a>
  );
};

const AdsBox = ({ adsList }) => {
  return (
    <Carousel
      autoPlay={false}
      hideDots={true}
      className={styles.container}>
      {
        adsList.map((ads) => {
          const isTicket = ads.advertisementType === 'movieTicket';
          return isTicket ? <Ticket movie={ads.movie}/> : <Image info={ads} />;
        })
      }
    </Carousel>
  );
};

export default AdsBox;
