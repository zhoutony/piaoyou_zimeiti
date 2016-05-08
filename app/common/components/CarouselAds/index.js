import React, {Component, PropTypes} from 'react';
import ReactSwipe from 'react-swipe';

import Carousel from '../Carousel';
import VideoDuration from '../VideoDuration';
import VideoPlayIcon from '../VideoPlayIcon';

import styles from './styles.css';

class CarouselAds extends Component {
  state = {
    current: 0,
  };

  render() {
    const { adsList, showInfo, showTitle } = this.props;
    const { current } = this.state;
    const ads = adsList[current] || {};

    return (
      <div className={styles.container}>
        <Carousel
          className={styles.slider}
          hideDots={showTitle}
          onChange={(current) => {
            this.setState({ current });
          }}>
          {adsList.map((ads) => this.renderCarouselItem(ads))}
        </Carousel>
        {showTitle && (<p className={styles.onlyTitle}>{ads.title || ads.movieNameCN}</p>)}
        {showInfo && this.renderAdsInfo(ads)}
      </div>
    );
  }

  renderCarouselItem(ads) {
    let additionInfos = [];

    if (ads.advertisementType === 'video') {
      additionInfos.push(<VideoDuration duration={ads.duration}/>);
      additionInfos.push(<VideoPlayIcon />);
    }

    return (
      <div
        className={styles.ads}
        onClick={() => {
          location.href = ads.url;
        }} >
        <img
          className={styles.image}
          src={ads.imageUrl}/>
        {additionInfos}
      </div>
    );
  }

  renderAdsInfo(ads) {
    return (
      <div className={styles.desc}>
        <h2 className={styles.title}>{ads.title || ads.movieNameCN}</h2>
        <div className={styles.contentContainer}>
          <p className={styles.content}>{ads.intro}</p>
        </div>
      </div>
    );
  }
}

export default CarouselAds;
