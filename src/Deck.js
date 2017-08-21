import React, { Component } from 'react'
import { View, Animated } from 'react-native'

class Deck extends Component {
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
