import React, { Component } from 'react'
import styled from 'styled-components'
import Player from '../../components/Player'

const Background = styled.div`
    height: 100vh;
    background-color: #000;
`;

export default class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreator: false,
      roomName: ''
    }

  }

  componentDidMount() {
    const { query } = this.props.location;
    const { r } = query;

    this.setState({roomName: this.props.params.roomName});
    
    if(r === 1) this.setState({isCreator: true});
  }

  render() {
    return (
      <div>
        <Player data={this.state}/>
      </div>
    )
  }
}
