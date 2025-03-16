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
  if (response.status === 200 && response.message) {
    const message = response.message
    SuccessNotify(message)
  }

  return response
}, function (error) {
// Any status codes that falls outside the range of 2xx cause this function to trigger
// Do something with response error
  if (error && error.response && error.response.data) {
    const errorMessage = error.response.data.ErrorMessage
    const statusCode = error.response.data.StatusCode

    switch (statusCode) {
      case 401:
      case 404:
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