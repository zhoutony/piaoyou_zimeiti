import React from 'react';
import cookies from 'browser-cookies';

import styles from './styles.css';
import VideoPlayIcon from '../../../components/VideoPlayIcon';
import Carousel from '../../../components/Carousel';

const Ticket = ({ movie }) => {
  const { director, actors, releaseTime, filmLength, intro, movieID } = movie;
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
      <span className={styles.buy}>购票</span>
    </a>
  );
};

const Image = ({ info }) => {
  return (
    <a
      className={styles.image}
      href={info.url}>
      <img src={info.imageUrl}/>
      <p className={styles.title}>{info.title}</p>
      {info.advertisementType === 'video' ? <VideoPlayIcon /> : null}
    </a>
  );
};

const AdsBox = ({ adsList }) => {
  return (
    <Carousel
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
