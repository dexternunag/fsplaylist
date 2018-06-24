import React, { Component } from 'react'
import styled from 'styled-components'
import { browserHistory } from 'react-router'
//service
import { createRoom } from '../../services/my-service'

const Background = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const FormHolder = styled.div`
  .back-btn {
    position: relative;
    top: -40px;
    right: -30px;
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

const Input = styled.input`
  padding: 5px 15px;
  color: #fff;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #fff;

  &:focus {
    outline: none;
    border-color: gold;
  }
`;

export default class CreateForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ''
    };
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  handleSubmit() {
    this.setState({
      roomName: this.state.input,
      isCreator: true
    });

    let roomName = this.state.input;

    createRoom(roomName);
    localStorage.setItem('admin', true);
    localStorage.setItem('adminRoom', roomName);
    localStorage.setItem('room', roomName);
    browserHistory.push(`/player/${roomName}?host=true`);
  }

  render() {
    return (
        <Background>
            <FormHolder>
                <Input placeholder="Room name" onChange={this.handleChange.bind(this)}/>
                <button type="submit" onClick={this.handleSubmit.bind(this)}>Create</button>
            </FormHolder>
        </Background>
    )
  }
}
