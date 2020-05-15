import { axios } from '@/utils/request'

export function getProcDefList (parameter) {
    return axios({
        url: '/flowable/procDef/',
        method: 'get',
        params: parameter
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
