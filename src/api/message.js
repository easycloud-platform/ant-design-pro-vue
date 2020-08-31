import { axios } from '@/utils/request'

export function getMessage (parameter) {
  return axios({
    url: '/app/message/' + parameter,
    method: 'get'
  })
}

export function getMessageList (parameter) {
  return axios({
    url: '/app/message/',
    method: 'get',
    params: parameter
  })
}

export function saveMessage (parameter) {
  return axios({
    url: '/app/message/',
    method: 'post',
    data: parameter
  })
}

export function deleteMessage (parameter) {
  return axios({
    url: '/app/message/',
    method: 'delete',
    data: parameter
  })
}
