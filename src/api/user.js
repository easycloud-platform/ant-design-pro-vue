import { axios } from '@/utils/request'

export function getUserList (parameter) {
  return axios({
    url: '/sys/user/',
    method: 'get',
    params: parameter
  })
}

export function saveUser (parameter) {
  return axios({
    url: '/sys/user/',
    method: 'post',
    data: parameter
  })
}

export function deleteUser (parameter) {
  return axios({
    url: '/sys/user/',
    method: 'delete',
    data: parameter
  })
}

export function updateUserStatus (id, status) {
  return axios({
    url: '/sys/user/' + id + '/' + status,
    method: 'put'
  })
}
