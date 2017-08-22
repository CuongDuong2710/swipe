import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder
} from 'react-native'

class Deck extends Component {
  constructor (props) {
    super(props)

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

  render () {
    return (
      <View>
        {this.renderCard()}
      </View>
    )
  }
}

export default Deck
