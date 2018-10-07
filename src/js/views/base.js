export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  clearListBtn: document.querySelector('#clear-list'),
  addItemListBtn: document.querySelector('#add-item'),
  shoppingForm: document.querySelector('.shopping__form'),
  countAddForm: document.querySelector('#count'),
  unitAddForm: document.querySelector('#unit__selector'),
  ingAddForm: document.querySelector('#ing_description'),
  shoppingListAddBtn: document.querySelector('.shopping__list__add-btn'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
  loader: "loader"
};

export const renderLoader = parent => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader)
    loader.parentElement.removeChild(loader);
};
