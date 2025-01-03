import axios from 'axios'

const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 在请求发送前做一些处理
        return config
    },
    error => {
        // 处理请求错误
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        // 处理响应数据
        return response.data
    },
    error => {
        // 处理响应错误
        return Promise.reject(error)
    }
)

export default request