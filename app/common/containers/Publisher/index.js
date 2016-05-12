import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadPublisherNewsList, toggleSubscribePublisher } from '../../actions';

import styles from './styles.css';

import NewsList from '../../components/NewsList';
import Refreshable from '../../components/Refreshable';
import Helper from '../../components/Helper';

const Header = ({ publisher, isSubscribed, toggleSubscribePublisher }) => {
  const { sourceID, sourceName, backImageURL, logoURL, summary, subscribeCount, AllReadCount } = publisher;
  return (
    <div className={styles.header} style={{ backgroundImage: `url(${backImageURL})` }}>
      <i className={styles.logo} style={{ backgroundImage: `url(${logoURL})` }}></i>
      <h2 className={styles.name}>{sourceName}</h2>
      <a
        href='javascript:;'
        className={isSubscribed ? styles.unSubscribe : styles.subscribe}
        onClick={() => toggleSubscribePublisher(!isSubscribed, sourceID)}></a>
      <span className={styles.info}>粉丝 {subscribeCount} | 累计阅读 {AllReadCount}</span>
      <p className={styles.intro}>{summary}</p>
    </div>
  );
};

class Publisher extends Component {
  get wxChannel() {
    return this.props.params.wxChannel || 'dypy';
  }

  render() {
    const {
      loadPublisherNewsList,
      toggleSubscribePublisher,
      publisher,
      isSubscribed,
      newsList,
      newsPage,
      newsLoading,
      params,
    } = this.props;

    let children;

    if (publisher) {
      children = [
        (<Header publisher={publisher} isSubscribed={isSubscribed} toggleSubscribePublisher={toggleSubscribePublisher}/>),
        (<Refreshable
          loading={newsLoading}
          className={styles.content}
          onLoad={() => loadPublisherNewsList(newsPage + 1, params.publisherId)}>
          <NewsList
            newsList={newsList}
            wxChannel={this.wxChannel} />
        </Refreshable>),
      ];
    } else {
      loadPublisherNewsList(1, params.publisherId);
    }

    return (
      <div>
        {children}
        <Helper />
      </div>
    );
  }
};

function mapStateToProps(state, ownProps) {
  const data = state.publisher;
  return data.publisherId === ownProps.params.publisherId ? data : {};
}

export default connect(mapStateToProps, {
  loadPublisherNewsList,
  toggleSubscribePublisher,
})(Publisher);
