import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native'

// Set out some minimum threshold some amount to say if you drag the card just a little bit and let go.
const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  }

  constructor (props) {
    super(props)

    // declare position to update animation
    const position = new Animated.ValueXY()

    // It means that we want this instance of the responder to be responsible for the user pressing on the screen.
    // 'gesture' object to read off the distance that the user dragged the card to left or right
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // update 'position' by 'dx', 'dy'
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (event, gesture) => {
        // when user drags screen greater than 1/4 screen width left or right
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left')
        } else {
          this.resetPosition()
        }
      }
    })

    // stick panResponder, position and index into state
    this.state = { panResponder, position, index: 0 }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 })
    }
  }

  componentWillUpdate () {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.spring()
  }

  // force swipe left or right in 250 miliseconds
  forceSwipe (direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction))
  }

  // swipe complete next card
  onSwipeComplete (direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props
    const item = data[this.state.index] // retrive the record we were currently swiping

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item)
    
    // We're not modifying the existing value 
    // Reset position before attaching it to next card
    this.state.position.setValue({ x: 0, y: 0 }) 
    
    // this.setState.index++
    // We are resetting it through the use of state
    this.setState({ index: this.state.index + 1 })
  }

  // Reset card's position to zero
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
    // if no more cards
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards()
    }

    // console.log(this.props)
    return this.props.data.map((item, i) => {
      if (i < this.state.index) { return null } // if 'i' less than current index return null, not render card

      // render Animated.View for the card at 'index'
      if (i === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle, {elevation: 1 }]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        )
      }
      // render all another cards below
      return (
        <Animated.View key={item.id} style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}>
          {this.props.renderCard(item)}
        </Animated.View>
      )
    }).reverse()
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

// They're stacked up on top of each other 
const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
}

export default Deck
