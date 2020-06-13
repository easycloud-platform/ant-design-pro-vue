import { axios } from '@/utils/request'

export function getArticleList (parameter) {
  return axios({
    url: '/app/article/',
    method: 'get',
    params: parameter
  })
}

export function saveArticle (parameter) {
  return axios({
    url: '/app/article/',
    method: 'post',
    data: parameter
  })
}

export function deleteArticle (parameter) {
  return axios({
    url: '/app/article/',
    method: 'delete',
    data: parameter
  })
}
