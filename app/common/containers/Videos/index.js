import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { loadVideosAdsList, loadVideosNewsList } from '../../actions';

import TopNav from '../../components/TopNav';
import CarouselAds from '../../components/CarouselAds';

import NewsList from '../../components/NewsList';
import BottomNav from '../../components/BottomNav';
import Refreshable from '../../components/Refreshable';

import styles from './styles.css';

class Videos extends Component {
  get wxChannel() {
    return this.props.params.wxChannel || 'dypy';
  }

  componentWillMount() {
    const { loadVideosNewsList, loadVideosAdsList, newsList, newsPage, adsList } = this.props;

    if (newsList.length === 0) {
      loadVideosNewsList(newsPage + 1);
    }

    if (adsList.length === 0) {
      loadVideosAdsList(this.wxChannel);
    }
  }

  render() {
    const { loadVideosNewsList, adsList, newsList, newsPage, newsLoading } = this.props;
    const wxChannel = this.wxChannel;

    return (
      <div className={styles.container}>
        <TopNav channel={'videos'} />
        <Refreshable
          loading={newsLoading}
          className={styles.content}
          onLoad={() => loadVideosNewsList(newsPage + 1)}>
          {adsList.length ? <CarouselAds showTitle={true} adsList={adsList} /> : null}
          {newsList.length ? <NewsList newsList={newsList} wxChannel={wxChannel}/> : null}
        </Refreshable>
        <BottomNav current='home' wxChannel={wxChannel}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state.videos;
}

export default connect(mapStateToProps, {
  loadVideosAdsList,
  loadVideosNewsList,
})(Videos);
