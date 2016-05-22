import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import merge from 'lodash/merge';

import { loadHomeNewsList, loadHomeAdsList } from '../../actions';
import { share } from '../../utils/wxBridge';

import TopNav from '../../components/TopNav';
import CarouselAds from '../../components/CarouselAds';

import NewsList from '../../components/NewsList';
import BottomNav from '../../components/BottomNav';
import Refreshable from '../../components/Refreshable';

import styles from './styles.css';

class Home extends Component {
  get wxChannel() {
    return this.props.params.wxChannel || 'dypy';
  }

  componentWillMount() {
    const { loadHomeNewsList, loadHomeAdsList, newsList, newsPage, adsList } = this.props;

    if (newsList.length === 0) {
      loadHomeNewsList(newsPage + 1);
    }

    if (adsList.length === 0) {
      loadHomeAdsList(this.wxChannel);
    }
  }

  render() {
    const { loadHomeNewsList, adsList, newsList, newsPage, newsLoading } = this.props;
    const wxChannel = this.wxChannel;

    return (
      <div className={styles.container}>
        <TopNav channel={'all'} />
        <Refreshable
          loading={newsLoading}
          className={styles.content}
          onLoad={() => loadHomeNewsList(newsPage + 1)}>
          {adsList.length ? <CarouselAds showInfo={true} adsList={adsList} /> : null}
          {newsList.length ? <NewsList newsList={newsList} wxChannel={wxChannel}/> : null}
        </Refreshable>
        <BottomNav current='home' wxChannel={wxChannel}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { shareInfo } = state.home;

  if (shareInfo) {
    share(merge({}, shareInfo, {
      wxChannel: ownProps.params.wxChannel || 'dypy',
      sourceId: 0,
      shareType: 1,
    }));
  }

  return state.home;
}

export default connect(mapStateToProps, {
  loadHomeNewsList,
  loadHomeAdsList,
})(Home);
