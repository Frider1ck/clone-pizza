import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {fetchPizzas} from '../redux/actions/pizzas'
import {addPizzaToCart} from '../redux/actions/cart'


import { Categories, SortPopup, PizzaBlock, LoadingBlock } from '../components';
import {setCategory, setSortBy} from '../redux/actions/filters'

const categorieNames = ['Мясные','Вегетарианская','Гриль','Острые','Закрытые']
const sortItems = [
  {name : 'популярности', type: 'popular'},
  {name : 'цене', type: 'price'},
  {name : 'алфавиту', type: 'alphabet'}
]

function Home() {
  const dispatch = useDispatch();
  const items = useSelector(({pizzas}) =>  pizzas.items )
  const cartItems = useSelector(({ cart }) => cart.items);
  const isLoaded = useSelector(({pizzas}) =>  pizzas.isLoaded )
  const { category, sortBy } = useSelector(({filters}) =>  filters )

  const onSelectCategory = React.useCallback((index) => {
    dispatch(setCategory(index))
  },[])

  const onSelectSortType = React.useCallback((type) => {
    dispatch(setSortBy(type));
  }, []);

  React.useEffect(() => {
    dispatch(fetchPizzas(sortBy, category));
  }, [category, sortBy]);


  const handleAddPizzaToCart = (obj) => {
    dispatch({
      type: 'ADD_PIZZA_CART',
      payload: obj,
    });
  };

    return (
        <div className="container">
          <div className="content__top">
            <Categories 
            activeCategory={category}
            onClickCategory={onSelectCategory}
            items={categorieNames}/>
            <SortPopup
            onClickSortType={onSelectSortType}
            activeSortType={sortBy}
            items={sortItems}
            />
          </div>
          <h2 className="content__title">Все пиццы</h2>
          <div className="content__items">
          {isLoaded
          ? items.map((obj) => (
              <PizzaBlock
                onClickAddPizza={handleAddPizzaToCart}
                key={obj.id}
                addedCount={cartItems[obj.id] && cartItems[obj.id].items.length}
                {...obj}
              />
            ))
          : Array(12)
              .fill(0)
              .map((_, index) => <LoadingBlock key={index} />)}
          </div>
        </div>
    )
}

export default Home
