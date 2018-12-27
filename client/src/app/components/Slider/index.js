import React from 'react'
import Controls from './Controls'

import ChairSliderContent from './Slides/Slide/Content/Chair'
import GlassesSliderContent from './Slides/Slide/Content/Glasses'
import SpaSliderContent from './Slides/Slide/Content/Spa'

import Slides from './Slides'

class Slider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentIndex: 0,
      translateValue: 0,
      isControlActive: false,
      slides: [
        {
          ComponentWithContent: SpaSliderContent,
          imagePath: 'images/slider/01.jpg'
        },{
          ComponentWithContent: ChairSliderContent,
          imagePath: 'images/slider/02.jpg'
        },{
          ComponentWithContent: GlassesSliderContent,
          imagePath: 'images/slider/03.jpg'
        }
      ],
      clientWidth: 0,
      containerWidth: 0
    }

    this.onMouseOutHandler = this.onMouseOutHandler.bind(this)
    this.onMouseOverHandler = this.onMouseOverHandler.bind(this)

    this.nextSlideHandler = this.nextSlideHandler.bind(this)
    this.prevSlideHandler = this.prevSlideHandler.bind(this)
  }

  componentWillMount() {
    this.updateClientWidth()
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateClientWidth.bind(this))

    this.setState({
      twistIntervalId: setInterval(this.twistSlider.bind(this), 5000)
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateClientWidth.bind(this))
    clearInterval(this.state.twistIntervalId)
  }

  updateClientWidth() {
    const width = document.querySelector('body').clientWidth

    this.setState({
      translateValue: -(this.state.currentIndex * width),
      clientWidth: width
    })
  }

  onMouseOverHandler() {
    this.setState((prevProps) => ({ isControlActive: true }))
  }

  onMouseOutHandler() {
    this.setState((prevProps) => ({ isControlActive: false }))
  }

  prevSlideHandler() {
    const { currentIndex,  clientWidth, slides } = this.state

    this.setState((prevState) => {
      const nextIndex = (currentIndex === 0 ? slides.length : currentIndex) - 1
      const translateValue = (currentIndex === 0 ? - ((slides.length - 1) * clientWidth) : prevState.translateValue + clientWidth)

      return {
        currentIndex: nextIndex,
        translateValue: translateValue,
        twistIntervalId: this.setIntervalForTwist()
      }}
    )
  }

  nextSlideHandler() {
    const { currentIndex, slides, clientWidth } = this.state

    this.setState((prevState) => {
      const nextIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1
      const translateValue = (currentIndex === slides.length - 1) ? 0 : prevState.translateValue - clientWidth

      return({
        currentIndex: nextIndex,
        translateValue: translateValue,
        twistIntervalId: this.setIntervalForTwist()
      })
    })
  }

  setIntervalForTwist() {
    clearInterval(this.state.twistIntervalId)
    return setInterval(this.twistSlider.bind(this), 5000)
  }

  twistSlider() {
    this.nextSlideHandler()
  }

  render() {
    return(
      <section className="hero-slider" onMouseOver={this.onMouseOverHandler} onMouseLeave={this.onMouseOutHandler}>
      <Slides 
        translateValue={this.state.translateValue}
        slides={this.state.slides}
        slidesWidth={this.state.clientWidth} />
      <Controls
        prevSlide={this.prevSlideHandler}
        nextSlide={this.nextSlideHandler}
        active={this.state.isControlActive} />
      </section>
    )
  }
}

export default Slider
