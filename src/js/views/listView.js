import { elements } from './base';

export const renderItem = item => {
  const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
      <div class="shopping__count">
          <input type="number" value="${item.count}" min="0" step="${item.count}" class="shopping__count-value">
          <p>${item.unit}</p>
      </div>
      <p class="shopping__description">${item.ingredient}</p>
      <button class="shopping__delete btn-tiny">
          <svg>
              <use href="img/icons.svg#icon-circle-with-cross"></use>
          </svg>
      </button>
    </li>
  `;
  elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  item.parentElement.removeChild(item);
}

export const deleteAllItems = () => {
  elements.shopping.innerHTML = '';
}

export const toggleForm = () => {
  if(elements.shoppingForm.style.display === 'flex') {
    elements.shoppingForm.style.display = 'none';
  } else {
    elements.shoppingForm.style.display = 'flex';
  }
}

export const getValuesForm = () => {
  let values = {}
  const count = elements.countAddForm.value;
  const unit = elements.unitAddForm.value;
  const ingredient = elements.ingAddForm.value;
  return values = {count, unit, ingredient};
}