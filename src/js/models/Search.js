import axios from "axios";
import { key, proxy } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    console.log(this.query);
    try {
      const res = await axios(`${proxy}https://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);
      alert('Error communicating with API');
    }
  }
}
