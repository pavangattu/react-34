import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import Rating from '../Rating'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    category: '',
    titleSearch: '',
    rating: '',
    isFailure: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, category, titleSearch, rating} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        isFailure: false,
      })
    } else {
      this.setState({isFailure: true})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onselectCategory = id => {
    this.setState({category: id}, this.getProducts)
  }

  selectRating = id => {
    this.setState({rating: id}, this.getProducts)
  }

  onInputChange = event => {
    if (event.key === 'Enter') {
      this.setState({titleSearch: event.target.value}, this.getProducts)
    }
  }

  onClearingFilter = async () => {
    this.setState(
      {
        isLoading: true,
        activeOptionId: sortbyOptions[0].optionId,
        category: '',
        titleSearch: '',
        rating: '',
        isFailure: false,
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  failureRender = () => (
    <div className="all-products-container failure-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>
        We are having some trouble processing your request.Please try again.
      </p>
    </div>
  )

  renderNoProductImg = () => (
    <div className="all-products-container failure-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1>No Products Found</h1>
      <p>We could not find any products.Try other filters.</p>
    </div>
  )

  renderProductsOrNot = () => {
    const {productsList} = this.state

    if (productsList.length > 0) {
      return this.renderProductsList()
    }
    return this.renderNoProductImg()
  }

  isFailureOrNot = () => {
    const {isFailure} = this.state

    switch (isFailure) {
      case true:
        return this.failureRender()
      case false:
        return this.renderProductsOrNot()
      default:
        return null
    }
  }

  render() {
    const {isLoading, category, rating} = this.state

    return (
      <div className="all-products-section">
        <div>
          <div className="search-container">
            <input
              type="search"
              className="searchInput"
              placeholder="Search"
              onKeyDown={this.onInputChange}
            />
          </div>
          <h1>Category</h1>
          <ul className="ul-filter-list">
            {categoryOptions.map(each => (
              <FiltersGroup
                eachFilter={each}
                key={each.categoryId}
                ratingsList={ratingsList}
                onselectCategory={this.onselectCategory}
                isActive={each.categoryId === category}
              />
            ))}
          </ul>

          <h1 className="rating-head">Rating</h1>

          <ul className="ul-filter-list">
            {ratingsList.map(each => (
              <Rating
                eachRating={each}
                key={each.ratingId}
                selectRating={this.selectRating}
                isSelectRatingActive={each.ratingId === rating}
              />
            ))}
          </ul>

          <button
            type="button"
            className="clear-button"
            onClick={this.onClearingFilter}
          >
            Clear Filters
          </button>
        </div>
        {isLoading ? this.renderLoader() : this.isFailureOrNot()}
      </div>
    )
  }
}

export default AllProductsSection
