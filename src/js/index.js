import Search from "./models/Search";
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * - Search obj
 * - Current recipe obj
 * - Shopping list obj
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  //get query from view
  const query = searchView.getInput();

  if (query) {
    //Create new search obj and add it to state
    state.search = new Search(query);
    // Prepare ui for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // Search for recipes
      await state.search.getResults();
      //render results on ui
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      console.log(error);
      alert('Error fetching recipes');
      clearLoader();
    }
  }
};

//search listener
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

//set listeners for paginations btns
elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto);
    // Prepare ui for results
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if(id) {
    //Prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //highlight selected item
    if(state.search) searchView.highlightSelected(id);
    //create new recipe obj
    state.recipe = new Recipe(id);
    try {
      //get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //calc servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      //render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
    }
  }
}
//set listeners on window
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * LIST CONTROLLER
 */
const controlList = () => {
  //create new list if there's none yet
  if(!state.list) state.list = new List();
  //add each ing to the shopping list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    //render item on shopping list
    listView.renderItem(item);
  })
};

//set listeners on shopping list buttons
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  //handle delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    //delete from state and UI
    state.list.deleteItem(id);
    listView.deleteItem(id);
    //handle count update
  } else if (e.target.matches('.shopping__count--value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//set listener on clear all button for shopping list
elements.clearListBtn.addEventListener('click', () => { 
  //remove from model
  state.list.deleteAllItems();
  //remove from ui
  listView.deleteAllItems();
});
//toggle form to add item manually to shopping list
elements.addItemListBtn.addEventListener('click', listView.toggleForm);

//set listeners on shopping list add button
elements.shoppingListAddBtn.addEventListener('click', () => {
  //create new list if there's none yet
  if (!state.list) state.list = new List();
  //get values from form inputs
  const values = listView.getValuesForm();
  //call addItem method
  const item = state.list.addItem(values.count, values.unit, values.ingredient);
  //call render item method
  listView.renderItem(item);
});

//check localStorage for shopping list
window.addEventListener('load', () => {
  //instantiate since app is being loaded now
  state.list = new List();
  //get stored values
  state.list.readStorageList();
  //render retrieved shopping list
  state.list.items.forEach(item => listView.renderItem(item));
});

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //recipe is NOT liked yet
  if(!state.likes.isLiked(currentID)) {
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.toggleLikeBtn(true);
    likesView.renderLike(newLike);

  } else {
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load (if any)
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorageLikes();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

//set listeners all recipe buttons
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    //decrease btn clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    //increase btn clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
    //shopping list button clicked
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
    //Like button clicked
  } else if(e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});