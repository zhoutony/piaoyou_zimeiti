import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import { loadNews, showCompleteNews } from '../../actions';

import NewsList from '../../components/NewsList';
import Helper from '../../components/Helper';
import AdsBox from './AdsBox';

import styles from './styles.css';

const Info = ({ newsInfo, wxChannel }) => {
  const { publishLogo, publishName, publishtime, publishID } = newsInfo;
  const publishTimeStr = moment(publishtime, 'YYYY-MM-DD HH:mm:ss')
    .format('MM月DD日 HH:mm');

  return (
    <div className={styles.info}>
      <Link to={`/${wxChannel}/medialist/${publishID}`}>
      <div className={styles.publisher}>
        <img src={publishLogo} />
        <span>{publishName}<br/>{publishTimeStr}</span>
      </div>
      </Link>
      <div className={styles.platform}>
        <Link to='/'>共享平台＋</Link>
      </div>
      <div className={styles.toolbox}>
        <i className={styles.share}></i>
      </div>
    </div>
  );
};

class News extends Component {

  componentDidMount() {
    this.props.loadNews(this.props.params.newsId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.newsId) {
      this.props.loadNews(nextProps.params.newsId);
    }

    return true;
  }

  get wxChannel() {
    return this.props.params.wxChannel || 'dypy';
  }

  render() {
    const { newsInfo } = this.props;

    let children;

    if (newsInfo) {
      children = [
        this.renderTopAdsList(),
        this.renderContent(),
        this.renderBottomAdsList(),
        this.renderRecommendNewsList(),
      ];
    }

    return (
      <div>
        {children}
        <Helper />
      </div>
    );
  }

  renderContent() {
    const { newsInfo, isComplete, showCompleteNews } = this.props;
    const { title, content, count, publishID, publishName } = newsInfo;
    const wxChannel = this.wxChannel;

    return (
      <div className={styles.contentContainer}>
        <Info newsInfo={newsInfo} wxChannel={wxChannel}/>
        <h2 className={styles.title}>{title}</h2>
        <div
          className={styles.content}
          style={isComplete ? { height: 'auto', maxHeight: 'none' } : {}}
          dangerouslySetInnerHTML={{ __html: content }} />
        {isComplete ? null : <div className={styles.showMore} onClick={() => showCompleteNews()}></div>}
        <p className={styles.readCount}>
          阅读：{count}
        </p>
        <p className={styles.right}>
          原页面经票友开放平台转码整理 文章来源 <a href={`/${wxChannel}/medialist/${publishID}`}>{publishName}</a>
        </p>
      </div>
    );
  }

  renderTopAdsList() {
    const { topAdsList } = this.props;

    return (
      <div className={styles.topAdsList}>
        <AdsBox adsList={topAdsList} wxChannel={this.wxChannel} />
      </div>
    );
  }

  renderBottomAdsList() {
    const { bottomAdsList } = this.props;

    return (
      <div className={styles.bottomAdsList}>
        <AdsBox adsList={bottomAdsList} wxChannel={this.wxChannel} />
      </div>
    );
  }

  renderRecommendNewsList() {
    const { recommendNewsList } = this.props;

    return (
      <div className={styles.recommendNewsList}>
        <h2>精彩推荐</h2>
        <NewsList newsList={recommendNewsList} wxChannel={this.wxChannel} />
      </div>
    );
  }

  showMore() {
    this.setState({
      showMore: true,
    });
  }
}

function mapStateToProps(state, ownProps) {
  const data = state.news;
  return data.newsId === parseInt(ownProps.params.newsId, 10) ? data : {};
}

export default connect(mapStateToProps, {
  loadNews,
  showCompleteNews,
})(News);
