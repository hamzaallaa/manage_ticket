import axios from 'axios';
import { parse, stringify } from 'qs'


let API_URL;

  API_URL = "http://localhost:8080/back/api";
  // API_URL = "http://localhost:8080/back/api";
  // API_URL = "http://localhost:8080/back/api";



const token = window.localStorage.getItem("id_token");

const HTTP = axios.create({
  baseURL: API_URL,
  headers: {
    "X-Auth-Token": token,
  },
  paramsSerializer: {
    encode: parse,
    serialize: stringify,
  },
});

export default HTTP