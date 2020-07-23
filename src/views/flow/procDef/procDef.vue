<template>
  <div>
    <a-card
      style="margin-top: 24px"
      :bordered="false">

      <div slot="extra">
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="$refs.taskForm.add()">部署流程</a-button>
      </div>

      <a-list size="large" :loading="loading" :pagination="{showSizeChanger: false, showQuickJumper: true, pageSize: pageSize, total: total}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.category">
            <a slot="title">{{ item.name }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a v-if="item.suspensionState==1" @click="pause(item)">挂起</a>
            <a v-if="item.suspensionState==2" @click="alive(item)">激活</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a @click="startProcDef(item)">发起流程</a></a-menu-item>
                <a-menu-item><a @click="deleteProcDef(item)">删除</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>版本号</span>
              <p>V{{ item.version }}</p>
            </div>
            <div class="list-content-item">
              <span>部署时间</span>
              <p>{{ item.deploymentTime }}</p>
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
import { getProcDefList, updateProcDef, deleteProcDef, startProcDef } from '@/api/procDef'
export default {
  name: 'ProcDef',
  components: {
  },
  data () {
    return {
      loading: true,
      queryParam: {
      },
      pageSize: 5,
      total: 1,
      data: [],
      procDef: {},
      status: 'all',
      user: {}
    }
  },
  created () {
    this.user = this.$store.getters.userInfo.info
    this.initData()
  },
  methods: {
    initData () {
        getProcDefList(this.queryParam)
          .then(res => {
              if (res.code === 200) {
                  this.data = res.data
                  this.total = res.data.length
              }
              this.loading = false
        })
    },
    alive (e) {
        this.loading = true
        this.procDef = e
        this.state = 'active'
        this.update()
    },
    pause (e) {
        this.loading = true
        this.procDef = e
        this.state = 'suspend'
        this.update()
    },
    update () {
        updateProcDef(this.state, this.procDef.id).then(res => {
            if (res.code === 200) {
                this.$message.success('操作成功')
            }
            this.initData()
        })
    },
    startProcDef (e) {
        this.loading = true
        startProcDef(this.user.id, e.key).then(res => {
            if (res.code === 200) {
                this.$message.success('操作成功')
            }
            this.initData()
        })
    },
    deleteProcDef (e) {
        const that = this
        that.$confirm({
          title: '是否确认删除',
          content: '谨慎操作',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            deleteProcDef(e.deploymentId).then(res => {
              that.loading = true
              if (res.code === 200) {
                that.$message.success('操作成功')
              }
              that.initData()
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
