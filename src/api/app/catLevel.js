import { axios } from '@/utils/request'

export function getCatLevelList (parameter) {
  return axios({
    url: '/app/cat/level/',
    method: 'get',
    params: parameter
  })
}

export function saveCatLevel (parameter) {
  return axios({
    url: '/app/cat/level/',
    method: 'post',
    data: parameter
  })
}

export function deleteCatLevel (parameter) {
  return axios({
    url: '/app/cat/level/',
    method: 'delete',
    data: parameter
  })
}
