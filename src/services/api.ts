import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://localhost:7297/api/v1/', // ajuste se seu backend for outro
})