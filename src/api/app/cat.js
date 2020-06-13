import { axios } from '@/utils/request'

export function getCatList (parameter) {
  return axios({
    url: '/app/cat/',
    method: 'get',
    params: parameter
  })
}

export function saveCat (parameter) {
  return axios({
    url: '/app/cat/',
    method: 'post',
    data: parameter
  })
}

export function deleteCat (parameter) {
  return axios({
    url: '/app/cat/',
    method: 'delete',
    data: parameter
  })
}
