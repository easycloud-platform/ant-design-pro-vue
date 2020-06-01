import { axios } from '@/utils/request'

export function getNodeByProcInsId (procInsId) {
    return axios({
        url: '/flowable/diagram/node/' + procInsId,
        method: 'get'
    })
}

export function diagramResource (procDefId, proInsId, resType) {
    return axios({
        url: '/flowable/diagram/read?procDefId=' + procDefId + '&proInsId=' + proInsId + '&resType=' + resType,
        method: 'get'
    })
}
