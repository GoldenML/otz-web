import axios from 'axios'
import { ElMessage } from 'element-plus'

const $axios = axios.create({
    timeout: 1200000
})

export const get = (url, params) =>
    new Promise((resolve, reject) => {
        $axios({
            method: 'GET',
            url,
            params
        })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })

export const post = (url, params, headers = {}) =>
    new Promise((resolve, reject) => {
        $axios({
            method: 'POST',
            url,
            data: params,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                headers

            }
        })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
$axios.interceptors.request.use((config) => {
    return config
})
$axios.interceptors.response.use(
    (res) => {
        if(res.data.code !== 0) {
            ElMessage.error(res.data.msg)
        }
        return res.data

    },
    (error) => {
        console.log(error)
    }
)

export default $axios
