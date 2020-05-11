import { axios } from '@/utils/request'

export function getFileList (parameter) {
  return axios({
    url: '/sys/file/',
    method: 'get',
    params: parameter
  })
}

export function deleteFile (parameter) {
  return axios({
    url: '/sys/file/',
    method: 'delete',
    data: parameter
  })
}
