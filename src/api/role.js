import { axios } from '@/utils/request'

export function getRoleList (parameter) {
  return axios({
    url: '/sys/role/',
    method: 'get',
    params: parameter
  })
}

export function saveRole (parameter) {
  return axios({
    url: '/sys/role/',
    method: 'post',
    data: parameter
  })
}

export function deleteRole (parameter) {
  return axios({
    url: '/sys/role/',
    method: 'delete',
    data: parameter
  })
}
