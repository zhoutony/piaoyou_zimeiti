import $ from 'jquery';
import throttle from 'lodash/throttle';
import noop from 'lodash/noop';
import React, {Component, PropTypes} from 'react';

import styles from './styles.css';

class Refreshable extends Component {
  static defaultProps = {
    threshold: 50,
  }

  componentWillMount() {
    this.$window = $(window);
    this.$body = $(document.body);
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  attachScrollListener() {
    this.$window.on('scroll.refreshable', throttle(this.onScroll.bind(this), 200));
  }

  detachScrollListener() {
    this.$window.off('scroll.refreshable');
  }

  onScroll() {
    const { onLoad=noop, loading } = this.props;

    if (loading) {
      return;
    }

    const scrollTop = this.$body.scrollTop();
    const windowHeight = this.$window.height();
    const viewportEndOffset = scrollTop + windowHeight;

    if (this.$loading.offset().top - viewportEndOffset < this.props.threshold) {
      onLoad();
    }
  }

  render() {
    const { children, className } = this.props;

    return (
      <div className={[styles.container, className || ''].join(' ')}>
        {children}
        <div
          className={styles.loading}
          ref={(e) => this.$loading = $(e)}>
          正在加载...
        </div>
      </div>
    );
  }
}

export default Refreshable;
