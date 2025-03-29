import axios from "axios"
import { SuccessNotify, WarningNotify, ErrorNotify } from "./ToastConfig"

const instance = axios.create({
    baseURL: "http://127.0.0.1:5140/api",
    withCredentials: true
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
// Any status code that lie within the range of 2xx cause this function to trigger
// Do something with response data

  if (response.status === 200 && response.data.message) {
    const message = response.data.message
    SuccessNotify(message)
  }

  return response
}, function (error) {
// Any status codes that falls outside the range of 2xx cause this function to trigger
// Do something with response error
console.log(error.response)
  if (error && error.response && error.response.data) {
    const errorMessage = error.response.data.message
    const statusCode = error.response.status

    switch (statusCode) {
      case 401:
      case 404:
        WarningNotify(errorMessage)
        break
      case 403:
        WarningNotify(errorMessage)
        break
      case 500:
        ErrorNotify(errorMessage)
        break
      default:
        ErrorNotify(errorMessage)
    } 
  }

  return Promise.reject(error)
})

export default instance