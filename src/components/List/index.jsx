import React, { Component } from 'react'
import styled from 'styled-components'
import { browserHistory } from 'react-router'

import { getRoomList, joinRoom } from '../../services/my-service'

const Background = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100auto;
`;

const RoomsHolder = styled.div`
    margin: auto;
    padding: 100px 0;
    width: 300px;
    height: 100%;

    ul {
        list-style: none;
        padding: 0;

        li {
            padding: 10px 5px;
            border-bottom: 1px solid #9993;
            display: flex;

            .name-holder {
                align-self: center;
                width: 100%;
                color: #fff;
            }
        }
    }

    .back-btn {
        position: relative;
        top: -40px;
        padding: 0;
        font-size: 12px;
        color: #fff;
        border: none;

        &:hover {
            color: #fff;
            text-decoration: underline;
        }
    }

    button {
        margin: 5px;
        padding: 5px 15px;
        color: #fff;
        background-color: transparent;
        border: 1px solid #ccc;
        cursor: pointer;
    
        &:hover,
        &:focus {
            outline: gold;
            color: gold;
            border-color: gold;
        }
    }
`;

export default class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms: []
        };
    }

    componentWillMount() {
        getRoomList().then(data => {
            const temp = [];
            data.forEach((room, i) => temp.push({name: room}));
            this.setState({rooms: temp});
        });
    }

    // componentDidMount() {
    //     console.log(this.state)
    // }

    handleJoinRoom(event) {
        const roomName = event.target.value;
        joinRoom(roomName);
        localStorage.setItem('member', true);
        browserHistory.push(`/player/${roomName}`);
    }

    render() {
        const rooms = this.state.rooms;
        console.log(rooms)
        return (
            <RoomsHolder>
                <ul>
                    {   
                        rooms.length !== 0 ? rooms.map((val, index) =>
                            <li key={index}>
                                <div className="name-holder">
                                    {val.name}
                                </div>
                                <div className="btn-holder">
                                    <button value={val.name} onClick={this.handleJoinRoom.bind(this)}>Join</button>
                                </div>
                            </li>
                        ) : 'No Rooms'
                    }
                </ul>
            </RoomsHolder>
        )
    }
}
