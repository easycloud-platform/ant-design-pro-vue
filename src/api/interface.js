import { axios } from '@/utils/request'

export function getInterfaceList (parameter) {
  return axios({
    url: '/sys/interface/',
    method: 'get',
    params: parameter
  })
}

export function saveInterface (parameter) {
  return axios({
    url: '/sys/interface/',
    method: 'post',
    data: parameter
  })
}

export function deleteInterface (parameter) {
  return axios({
    url: '/sys/interface/',
    method: 'delete',
    data: parameter
  })
}
