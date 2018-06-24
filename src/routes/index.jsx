import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from '../App'
import Home from '../views/Home'
import Room from '../views/Room'
import Create from '../views/Create'
import RoomsList from '../views/RoomsList'

export default (
    <Router component={App} history={browserHistory}>
        <Route path="/" component={App}>
        <IndexRoute component={Home} />
            <Route path="/player/:roomName" component={Room}/>
            <Route path="/create" component={Create}/>
            <Route path="/join" component={RoomsList}/>
        </Route>
    </Router>
);