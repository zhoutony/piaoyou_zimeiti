import React, {PropTypes} from 'react';

var styles = require('./styles.css');

const App = ({ children }) => {
  return (
    <div className={styles.app}>
      {children}
    </div>
  );
};

export default App;
