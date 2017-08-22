import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder
} from 'react-native'

class Deck extends Component {
  constructor (props) {
    super(props)

    // It means that we want this instance of the responder to be responsible for the user pressing on the screen.
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        console.log(gesture)
      },
      onPanResponderRelease: () => {}
    })

    this.state = { panResponder }
  }

  // Take a list of data and for every element in that array it calls render card.
  renderCard () {
    console.log(this.props)
    return this.props.data.map(item => {
      return this.props.renderCard(item)
    })
  }

  // 'panHandlers' is an object has a bunch of different callbacks that help intercept (ngăn lại) presses from a user by using the dot dot dot syntax right here. 
  render () {
    return (
      <View {...this.state.panResponder.panHandlers}>
        {this.renderCard()}
      </View>
    )
  }
}

export default Deck
