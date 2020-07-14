import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000, // request timeout
  auth: { username: 'admin', password: '20200077' }
  // headers: { Authorization: 'Bearer ' + getToken() }
})



export default service
