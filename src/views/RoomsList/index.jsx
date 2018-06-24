import React, { Component } from 'react'
import styled from 'styled-components'
import { browserHistory } from 'react-router'
import List from '../../components/List'

export default class RoomsList extends Component {
    render() {
        return (
            <div className="container">
                <List></List>
            </div>
        )
    }
}
