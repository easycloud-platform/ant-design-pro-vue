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

      <a-list size="large"  :loading="loading" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
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
  </div>
</template>

<script>
import { getProcInsRunningList, getProcInsHistoryList, activeProcIns,
handUpProcIns, deleteProcIns } from '@/api/procIns'
export default {
  name: 'ProcIns',
  components: {
  },
  data () {
    return {
      loading: true,
      queryParam: {
      },
      data: [],
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
              } else {
                  this.$message.error(res.message)
              }
              this.loading = false
        })
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
