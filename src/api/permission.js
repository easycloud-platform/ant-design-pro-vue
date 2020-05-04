import { axios } from '@/utils/request'

export function getPermissionList (parameter) {
  return axios({
    url: '/sys/permission/',
    method: 'get',
    params: parameter
  })
}

export function savePermission (parameter) {
  return axios({
    url: '/sys/permission/',
    method: 'post',
    data: parameter
  })
}

export function deletePermission (parameter) {
  return axios({
    url: '/sys/permission/',
    method: 'delete',
    data: parameter
  })
}
