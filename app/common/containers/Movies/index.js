import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { loadMoviesAdsList, loadMoviesNewsList, refreshMoviesNewsList } from '../../actions';

import TopNav from '../../components/TopNav';
import CarouselAds from '../../components/CarouselAds';

import NewsList from '../../components/NewsList';
import BottomNav from '../../components/BottomNav';
import Refreshable from '../../components/Refreshable';
import VideoFilter from '../../components/VideoFilter';

import styles from './styles.css';

class Movies extends Component {
  get wxChannel() {
    return this.props.params.wxChannel || 'dypy';
  }

  componentWillMount() {
    const { loadMoviesNewsList, loadMoviesAdsList, newsList, newsPage, adsList, filters } = this.props;

    if (newsList.length === 0) {
      loadMoviesNewsList(newsPage + 1, filters);
    }

    if (adsList.length === 0) {
      loadMoviesAdsList(this.wxChannel);
    }
  }

  render() {
    const { loadMoviesNewsList, refreshMoviesNewsList, newsList, adsList, newsPage, filters, newsLoading } = this.props;
    const wxChannel = this.wxChannel;

    return (
      <div className={styles.container}>
        <TopNav channel='movies' />
        <Refreshable
          loading={newsLoading}
          className={styles.content}
          onLoad={() => loadMoviesNewsList(newsPage + 1, filters)}>
          {adsList.length ? <CarouselAds showTitle={true} adsList={adsList} /> : null}
          <VideoFilter filters={filters} onChange={(filters) => refreshMoviesNewsList(1, filters)}/>
          {newsList.length ? <NewsList newsList={newsList} wxChannel={wxChannel}/> : null}
        </Refreshable>
        <BottomNav current='home' wxChannel={wxChannel}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state.movies;
}

export default connect(mapStateToProps, {
  loadMoviesAdsList,
  loadMoviesNewsList,
  refreshMoviesNewsList,
})(Movies);
