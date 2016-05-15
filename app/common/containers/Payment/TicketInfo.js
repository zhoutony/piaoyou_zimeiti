import React from 'react';

import styles from './styles.css';

const TicketInfo = ({ movie, cinema, showtime }) => {
  return (
    <div className={styles.ticketInfo}>
      <div className={styles.info}>
        <h2>{movie.movieNameCN}</h2>
        <p>{cinema.cinemaName}</p>
        <p>{movie.movieVersions} | {showtime.hallName} | {showtime.showTime}</p>
      </div>
      <a className={styles.changeSeat} href="javascript:;" onClick={() => history.back()}>
        重新选座
      </a>
    </div>
  );
};

export default TicketInfo;
