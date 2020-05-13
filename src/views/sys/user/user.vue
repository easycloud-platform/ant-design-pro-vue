<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>
           <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input v-model="queryParam.phone" placeholder=""/>
            </a-form-item>
          </a-col>
           <a-col :md="8" :sm="24">
            <a-form-item label="邮箱">
              <a-input v-model="queryParam.email" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"  @click="handleDelete"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <add-user ref="modal" @ok="handleOk"/>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" />
      </span>
      <span slot="status" slot-scope="status">
          <a-badge :status="status ? 'success':'error'" :text="status ? '':''" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">{{record.status ? '停用':'启用'}}</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import { getUserList, deleteUser, updateUserStatus } from '@/api/user'
  import addUser from './module/addUser'
  const statusMap = {
    0: {
      status: true,
      text: '关闭'
    },
    1: {
      status: false,
      text: '运行中'
    }
  }
  export default {
    name: 'User',
    components: {
      STable,
      Ellipsis,
      addUser
    },
    data () {
      return {
        queryParam: {
          name: '',
          phone: '',
          email: ''
        },
        sort: {

        },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          console.log('loadData.parameter', parameter)
          return getUserList(Object.assign(parameter, this.queryParam))
            .then(res => {
            return res.data
          })
        },
        mdl: {},
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '头像',
            dataIndex: 'avatar',
            scopedSlots: { customRender: 'avatar' }
          },
          {
            title: '用户名',
            dataIndex: 'name',
            customRender: (text, row, index) => {
                return <a href="javascript:;">{text}</a>
            }
          },
          {
            title: '所属角色',
            dataIndex: 'role.name'
          },
          {
            title: '手机号',
            dataIndex: 'phone'
          },
          {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '邮箱',
            dataIndex: 'email'
          },
          {
            title: '更新时间',
            dataIndex: 'updateDate'
          },
          {
            fixed: 'right',
            width: 100,
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        selectedRowKeys: [],
        selectedRows: [],

        // custom table alert & rowSelection
        options: {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        },
        optionAlertShow: false
      }
    },
    created () {
      this.tableOption()
    },
    methods: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      },
      tableOption () {
        if (!this.optionAlertShow) {
          this.options = {
            alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
            rowSelection: {
              selectedRowKeys: this.selectedRowKeys,
              onChange: this.onSelectChange
            }
          }
          this.optionAlertShow = true
        } else {
          this.options = {
            alert: false,
            rowSelection: null
          }
          this.optionAlertShow = false
        }
      },
      handleAdd () {
        this.$refs.modal.add()
      },
      handleEdit (record) {
        this.$refs.modal.edit(record)
      },
      handleDelete () {
        const that = this
        that.$confirm({
          title: '是否确认删除',
          content: '谨慎操作',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            deleteUser(that.selectedRowKeys).then(res => {
              if (res.code === 200) {
                that.$message.success('操作成功')
                that.handleOk()
              } else {
                that.$message.error(res.message)
              }
            })
          }
        })
      },
      handleSub (record) {
        updateUserStatus(record.id, !record.status).then(res => {
           if (res.code === 200) {
              this.$message.success('操作成功')
              this.handleOk()
            } else {
              this.$message.error(res.message)
            }
        })
      },
      handleOk () {
        this.$refs.table.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
