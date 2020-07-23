import { axios } from '@/utils/request'

export function getStoreList (parameter) {
  return axios({
    url: '/app/store/',
    method: 'get',
    params: parameter
  })
}

export function saveStore (parameter) {
  return axios({
    url: '/app/store/',
    method: 'post',
    data: parameter
  })
}

export function deleteStore (parameter) {
  return axios({
    url: '/app/store/',
    method: 'delete',
    data: parameter
  })
}
