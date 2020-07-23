import { axios } from '@/utils/request'

export function getProcInsRunningList (parameter) {
    return axios({
        url: '/flowable/procIns/running',
        method: 'get',
        params: parameter
    })
}
export function getProcInsHistoryList (parameter) {
    return axios({
        url: '/flowable/procIns/history',
        method: 'get',
        params: parameter
    })
}
export function activeProcIns (procInsId) {
    return axios({
        url: '/flowable/procIns/active/' + procInsId,
        method: 'put'
    })
}
export function handUpProcIns (procInsId) {
    return axios({
        url: '/flowable/procIns/handUp/' + procInsId,
        method: 'put'
    })
}
export function deleteProcIns (procDefId) {
    return axios({
        url: '/flowable/procIns/' + procDefId,
        method: 'delete'
    })
}
