import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const LoaderComponent = () => (
  <div className='reusable-lazyload-on-body' >
    <div className='reusable-lazyload-on-body-item'>Loading...</div>
  </div>
)

class LazyLoadOnBody extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loadMore: true,
      footer: this.props.footerHeight
    }
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll, false)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentTotal !== this.props.currentTotal) {
      this.setState({
        loadMore: true
      })
    }
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  }

  onScroll () {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const { scrollHeight, offsetHeight } = document.body
    const { clientHeight } = document.documentElement
    const scrollHeightHtml = document.documentElement.scrollHeight
    const offsetHeightHtml = document.documentElement.offsetHeight
    const bodyHeight = Math.max(scrollHeight, offsetHeight)
    const docHeight = Math.max(bodyHeight, clientHeight, scrollHeightHtml, offsetHeightHtml)
    const windowBottom = windowHeight + window.pageYOffset
    const { total, currentTotal } = this.props
    if (windowBottom >= docHeight - 150 - this.state.footer && total > currentTotal) {
      if (this.state.loadMore) {
        this.props.loadMoreRows()
      }
      this.setState({
        loadMore: false
      })
    }
  }

  render () {
    const { className, children, loader } = this.props
    return (
      <div className={className} >
        {children}
        {!this.state.loadMore ? loader : null}
      </div>
    )
  }
}

LazyLoadOnBody.propTypes = {
  total: PropTypes.number,
  currentTotal: PropTypes.number,
  loadMoreRows: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  footerHeight: PropTypes.number,
  loader: PropTypes.node,
  className: PropTypes.string,
}

LazyLoadOnBody.defaultProps = {
  children: null,
  footerHeight: 0,
  loader: <LoaderComponent />,
  className: '',
  total: 0,
  currentTotal: 0
}

export default LazyLoadOnBody