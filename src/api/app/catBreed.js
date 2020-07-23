import { axios } from '@/utils/request'

export function getCatBreedList (parameter) {
  return axios({
    url: '/app/cat/breed/',
    method: 'get',
    params: parameter
  })
}

export function saveCatBreed (parameter) {
  return axios({
    url: '/app/cat/breed/',
    method: 'post',
    data: parameter
  })
}

export function deleteCatBreed (parameter) {
  return axios({
    url: '/app/cat/breed/',
    method: 'delete',
    data: parameter
  })
}
