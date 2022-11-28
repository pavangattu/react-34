import './index.css'

const Rating = props => {
  const {eachRating, selectRating, isSelectRatingActive} = props
  const {imageUrl, ratingId} = eachRating

  const onSelectRating = () => {
    selectRating(ratingId)
  }

  const color = isSelectRatingActive && 'onSelect'
  return (
    <li className="rating-li-item">
      <button type="button" className={`btn ${color}`} onClick={onSelectRating}>
        <img src={imageUrl} alt={`rating ${ratingId}`} className="img-rating" />
        &up
      </button>
    </li>
  )
}

export default Rating
