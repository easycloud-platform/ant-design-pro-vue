import { axios } from '@/utils/request'

export function getTaskList (parameter) {
  return axios({
    url: '/sys/task/',
    method: 'get',
    params: parameter
  })
}
