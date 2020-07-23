import { axios } from '@/utils/request'

export function getVaccinList (parameter) {
  return axios({
    url: '/app/vaccin/',
    method: 'get',
    params: parameter
  })
}

export function saveVaccin (parameter) {
  return axios({
    url: '/app/vaccin/',
    method: 'post',
    data: parameter
  })
}

export function deleteVaccin (parameter) {
  return axios({
    url: '/app/vaccin/',
    method: 'delete',
    data: parameter
  })
}
