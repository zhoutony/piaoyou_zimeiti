import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import home from './home';
import news from './news';
import videos from './videos';
import movies from './movies';
import publisher from './publisher';

const rootReducer = combineReducers({
  home,
  news,
  videos,
  movies,
  routing,
  publisher,
});

export default rootReducer;
