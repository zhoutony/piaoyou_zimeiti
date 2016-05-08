import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import Videos from './containers/Videos';
import Movies from './containers/Movies';
import News from './containers/News';
import Publisher from './containers/Publisher';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home}/>
    <Route path='videos' component={Videos} />
    <Route path=':wxChannel/videos' component={Videos} />
    <Route path='movies' component={Movies} />
    <Route path=':wxChannel/movies' component={Movies} />
    <Route path='movienews/:publisherId/:newsId' component={News} />
    <Route path=':wxChannel/movienews/:publisherId/:newsId' component={News}/>
    <Route path='medialist/:publisherId' component={Publisher} />
    <Route path=':wxChannel/medialist/:publisherId' component={Publisher} />
    <Route path=':wxChannel' component={Home} />
  </Route>
);
