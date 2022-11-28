import './index.css'

const FiltersGroup = props => {
  const {eachFilter, onselectCategory, isActive} = props
  const {name, categoryId} = eachFilter

  const OnSelectingCategory = () => {
    onselectCategory(categoryId)
  }

  const selectCat = isActive && 'select-category'

  return (
    <div className="filters-group-container">
      <li className="list-item">
        <p className={`para-name ${selectCat}`} onClick={OnSelectingCategory}>
          {name}
        </p>
      </li>
    </div>
  )
}
export default FiltersGroup
