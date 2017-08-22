import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

class Deck extends Component {
  constructor (props) {
    super(props)

    // declare position to update animation
    const position = new Animated.ValueXY()

    // It means that we want this instance of the responder to be responsible for the user pressing on the screen.
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // update 'position' by 'dx', 'dy'
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: () => {
        this.resetPosition()
      }
    })

    // stick panResponder and position into state
    this.state = { panResponder, position }
  }

  resetPosition () {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start()
  }

  // 'SCREEN_WIDTH * 1.5': that's going to say it takes a lot more distances to get all the way to 120 degress of rotation
  getCardStyle () {
    const { position } = this.state
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    })

    return {
      // spread operator to take all the different properties out of this getLayout()
      ...position.getLayout(),
      transform: [{ rotate }]
    }
  }

  // Take a list of data and for every element in that array it calls render card.
  renderCards () {
    // console.log(this.props)
    return this.props.data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        )
      }
      return this.props.renderCard(item)
    })
  }

  // 'panHandlers' is an object has a bunch of different callbacks that help intercept (ngăn lại) presses from a user by using the dot dot dot syntax right here. 
  render () {
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

export default Deck
