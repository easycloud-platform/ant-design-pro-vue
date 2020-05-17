import { axios } from '@/utils/request'

export function getProcDefList (parameter) {
    return axios({
        url: '/flowable/procDef/',
        method: 'get',
        params: parameter
    })
}
export function startProcDef (userId, procDefKey) {
    return axios({
        url: '/flowable/procDef/' + userId + '/start/' + procDefKey,
        method: 'get'
    })
}
export function updateProcDef (state, procDefId) {
    return axios({
        url: '/flowable/procDef/' + procDefId + '/' + state,
        method: 'put'
    })
}
export function deleteProcDef (procDefId) {
    return axios({
        url: '/flowable/procDef/' + procDefId,
        method: 'delete'
    })
}
