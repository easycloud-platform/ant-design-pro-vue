import { axios } from '@/utils/request'

export function getBannerList (parameter) {
  return axios({
    url: '/app/banner/',
    method: 'get',
    params: parameter
  })
}

export function saveBanner (parameter) {
  return axios({
    url: '/app/banner/',
    method: 'post',
    data: parameter
  })
}

export function deleteBanner (parameter) {
  return axios({
    url: '/app/banner/',
    method: 'delete',
    data: parameter
  })
}
