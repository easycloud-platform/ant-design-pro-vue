import { axios } from '@/utils/request'

export function getTaskList (parameter) {
  return axios({
    url: '/sys/task/',
    method: 'get',
    params: parameter
  })
}

export function addTask (data) {
  return axios({
    url: '/sys/task/add',
    method: 'post',
    data: data
  })
}

export function pauseTask (data) {
  return axios({
    url: '/sys/task/pause',
    method: 'post',
    data: data
  })
}

export function resumeTask (data) {
  return axios({
    url: '/sys/task/resume',
    method: 'post',
    data: data
  })
}

export function rescheduleTask (data) {
  return axios({
    url: '/sys/task/reschedule',
    method: 'post',
    data: data
  })
}

export function deleteTask (data) {
  return axios({
    url: '/sys/task/',
    method: 'delete',
    data: data
  })
}
