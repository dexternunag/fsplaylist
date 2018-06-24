import React, { Component } from 'react'
//components && views
import styled from 'styled-components'

const Background = styled.div`
    height: auto;
    background-color: #000;
`;

class App extends Component {
  constructor(props) {
    super(props);
    // test(data => {
    //   this.setState({msg: data.msg});
    // });
  }

  render() {
    return (
      <Background>
        
          {this.props.children}
        
      </Background>
    );
  }
}

export default App;
