import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem (count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    }
    this.items.push(item);
    this.persistDataList();
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex(el => el.id === id);
    this.items.splice(index, 1);
    this.persistDataList();
  }

  deleteAllItems() {
    this.items = [];
    this.persistDataList();
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
    this.persistDataList();
  }

  persistDataList() {
    localStorage.setItem('shopping_list', JSON.stringify(this.items));
  }

  readStorageList() {
    const storageList = JSON.parse(localStorage.getItem('shopping_list'));
    if (storageList) this.items = storageList;
  }
}