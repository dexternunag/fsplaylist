import React, { Component } from 'react'
import { Link } from 'react-router';
import styled from 'styled-components'
import CreateForm from '../Forms'
import List from '../List'
import { browserHistory } from 'react-router'
import { getRoomList } from '../../services/my-service'

const Background = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const ButtonHolder = styled.div`
    max-width: 50%;

    a {
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
            text-decoration: none;
        }
    }
`;

export default class SelectionForm extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {
        const adminStatus = localStorage.getItem('admin');
        const roomName = localStorage.getItem('adminRoom');
        if (adminStatus) {
            browserHistory.push(`/player/${roomName}?host=true`);
        }
    };

    render() {
        return (
            <Background>
                <ButtonHolder>
                    <Link to="create">Create a Room</Link>
                    <Link to="join">Join a Room</Link>
                </ButtonHolder>
            </Background>
        )
    }
}
