import { axios } from '@/utils/request'

export function getParameterList (parameter) {
  return axios({
    url: '/sys/parameter/',
    method: 'get',
    params: parameter
  })
}

export function saveParameter (parameter) {
  return axios({
    url: '/sys/parameter/',
    method: 'post',
    data: parameter
  })
}

export function deleteParameter (parameter) {
  return axios({
    url: '/sys/parameter/',
    method: 'delete',
    data: parameter
  })
}
