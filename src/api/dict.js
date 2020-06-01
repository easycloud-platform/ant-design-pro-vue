import { axios } from '@/utils/request'

export function getDictList (parameter) {
  return axios({
    url: '/sys/dict/',
    method: 'get',
    params: parameter
  })
}

export function saveDict (parameter) {
  return axios({
    url: '/sys/dict/',
    method: 'post',
    data: parameter
  })
}

export function deleteDict (parameter) {
  return axios({
    url: '/sys/dict/',
    method: 'delete',
    data: parameter
  })
}
