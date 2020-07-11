<template>
  <div>
    <a-card
      style="margin-top: 24px"
      :bordered="false">

      <div slot="extra">
        <a-radio-group v-model="status">
          <a-radio-button value="processing" @click="getRunProcIns()">正在运行</a-radio-button>
          <a-radio-button value="waiting" @click="getHistoryProcIns()">已结束</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <a-list size="large" :loading="loading" :pagination="{showSizeChanger: false, showQuickJumper: true, pageSize: pageSize, total: total}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.processInstanceId">
            <a slot="title">{{ item.name }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a v-if="item.suspensionState==1" @click="pause(item)">挂起</a>
            <a v-if="item.suspensionState==2" @click="alive(item)">激活</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a @click="showDiagramImage(item)">流程图</a></a-menu-item>
                <a-menu-item><a @click="deleteProcIns(item)">删除</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>executionId</span>
              <p>{{ item.executionId }}</p>
            </div>
            <div class="list-content-item">
              <span>开始时间</span>
              <p>{{ item.startTime }}</p>
            </div>
            <div class="list-content-item">
              <span>流程状态</span>
              <p>
                <a-tag color="#108ee9" v-if="item.suspensionState==1">激活</a-tag>
                <a-tag color="#f50" v-if="item.suspensionState==2">挂起</a-tag>
              </p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal v-model="modelImagedialogVisible">
      <div class="bmpn-containers" ref="content">
        <div class="canvas" id="canvas" ref="canvas"></div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getProcInsRunningList, getProcInsHistoryList, activeProcIns,
handUpProcIns, deleteProcIns } from '@/api/procIns'
import { getNodeByProcInsId, diagramResource } from '@/api/diagram'
import BpmnModeler from 'bpmn-js/lib/Modeler'
export default {
  name: 'ProcIns',
  components: {
  },
  data () {
    return {
      modelImagedialogVisible: false,
      bpmnModeler: null,
      loading: true,
      queryParam: {
      },
      data: [],
      pageSize: 5,
      total: 1,
      procIns: {},
      status: 'processing'
    }
  },
  created () {
    this.getRunProcIns()
  },
  methods: {
    getRunProcIns () {
        this.loading = true
        getProcInsRunningList(this.queryParam)
          .then(res => {
              if (res.code === 200) {
                  this.data = res.data
                  this.total = res.data.length
              } else {
                  this.$message.error(res.message)
              }
              this.loading = false
        })
    },
    getHistoryProcIns () {
        this.loading = true
        getProcInsHistoryList(this.queryParam)
          .then(res => {
              if (res.code === 200) {
                  this.data = res.data
                  this.total = res.data.length
              } else {
                  this.$message.error(res.message)
              }
              this.loading = false
        })
    },
    showDiagramImage (e) {
       this.modelImagedialogVisible = true

        this.$nextTick(() => {
          const that = this
          let nodeCodes1 = []
          let nodeCodes2 = []
          let activeNode = ''
          getNodeByProcInsId(e.processInstanceId).then(res => {
            nodeCodes1 = res.data.avtivityIds
            nodeCodes2 = res.data.flowIds
            activeNode = res.data.nowActivityId
            var canvas = document.getElementById('canvas')
            canvas.innerHTML = ''
            diagramResource(e.processDefinitionId, e.processInstanceId, 'xml').then(res => {
            if (res.code === 200) {
              this.container = this.$refs.content
              this.bpmnModeler = new BpmnModeler({
                container: canvas
              })
                const bpmnXmlStr = res.data
                this.bpmnModeler.importXML(bpmnXmlStr, function (err) {
                  if (err) {
                    // console.error(err)
                  }
                  const canvas = that.bpmnModeler.get('canvas')
                  canvas.zoom('fit-viewport')
                  const colorClass1 = 'nodeSuccess'
                  that.setNodeColor(nodeCodes1, colorClass1, canvas)
                  if (activeNode !== undefined) {
                    canvas.addMarker(activeNode, 'node')
                  }
                  const colorClass2 = 'lineSuccess'
                  that.setLineColor(nodeCodes2, colorClass2, canvas)
                })
              }
            })
          })
        })
    },
      // 给已经走过的流程添加颜色
    setNodeColor (nodeCodes, colorClass, canvas) {
      for (let i = 0; i < nodeCodes.length; i++) {
        canvas.addMarker(nodeCodes[i], colorClass)
      }
    },
      // 给已经走过的流程添加颜色
    setLineColor (nodeCodes, colorClass, canvas) {
      for (let i = 0; i < nodeCodes.length; i++) {
        canvas.addMarker(nodeCodes[i], colorClass)
      }
    },
    alive (e) {
        this.loading = true
        activeProcIns(e.id).then(res => {
            if (res.code === 200) {
                this.$message.success('操作成功')
            } else {
                this.$message.error(res.message)
            }
            this.getRunProcIns()
        })
    },
    pause (e) {
        this.loading = true
        handUpProcIns(e.id).then(res => {
            if (res.code === 200) {
                this.$message.success('操作成功')
            } else {
                this.$message.error(res.message)
            }
            this.getRunProcIns()
        })
    },
    deleteProcIns (e) {
        const that = this
        that.$confirm({
          title: '是否确认删除',
          content: '谨慎操作',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            deleteProcIns(e.id).then(res => {
              that.loading = true
              if (res.code === 200) {
                that.$message.success('操作成功')
              } else {
                that.$message.error(res.message)
              }
              that.getRunProcIns()
              that.getHistoryProcIns()
            })
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
    .ant-avatar-lg {
        width: 48px;
        height: 48px;
        line-height: 48px;
    }

    .list-content-item {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 40px;
        span {
            line-height: 20px;
        }
        p {
            margin-top: 4px;
            margin-bottom: 0;
            line-height: 22px;
        }
    }
</style>
<style>
  /*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  .dialog-reset{
    width: 50%;
    height: 80%;
  }
  .dialog-reset .bmpn-containers{
    position: absolute;
    background-color: #ffffff;
    width: 95%;
    height: 85%;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=");
    .canvas{
      width: 100%;
      height: 100%;
    }
    .bjs-powered-by {
      display: none;
    }
    .node {
        -webkit-animation: test 18S linear infinite;
        -webkit-animation-fill-mode: forwards;
        stroke-dasharray: 4px ,4px;
    }
    .nodeSuccess:not(.djs-connection) .djs-visual > :nth-child(1) {
      stroke: red !important;
      stroke-width: 2px;
      /* elements as success */
    }

    .nodeError:not(.djs-connection) .djs-visual > :nth-child(1) {
      stroke: #1890ff !important;
      stroke-width: 2px;
      /* elements as error */
    }

    .lineSuccess:not(.djs-shape) .djs-visual :last-child {
      stroke: red!important;
    }

    .lineError:not(.djs-shape) .djs-visual :last-child {
      stroke: #1890ff!important;
    }
 }
 .djs-palette {
    display: none;
    position: absolute;
    left: 20px;
    top: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 48px;
}
.djs-context-pad.open {
    /* display: block; */
    display: none;
}
 @-webkit-keyframes test {
        to {
            stroke-dashoffset: 100%;
        }
    }

</style>
