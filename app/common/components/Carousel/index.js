import React, {Component, PropTypes} from 'react';
import ReactSwipe from 'react-swipe';

var styles = require('./styles.css');

class Carousel extends Component {
  state = {
    current: 0,
  };

  render() {
    const { children, hideDots, onChange, className='' } = this.props;
    const { current } = this.state;

    const swipeOptions = {
      // auto: 10e3,
      continuous: true,
      callback: (current) => {
        current %= children.length;
        this.setState({ current });
        onChange && onChange(current);
      },
    };

    let dots = children.map((child, index) => {
      const classNameList = [
        styles.dot,
        index === current ? styles.current : '',
      ];
      return (<li className={classNameList.join(' ')}></li>);
    });
    if (hideDots || dots.length === 1) {
      dots = null;
    }

    return (
      <div className={[styles.container, className].join(' ')}>
        <ReactSwipe
          swipeOptions={swipeOptions}>
          {children}
        </ReactSwipe>
        <ul className={styles.dots}>
          {dots}
        </ul>
      </div>
    );
  }
}
;

export default Carousel;
