<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="消息内容">
              <a-input v-model="queryParam.message" placeholder=""/>
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
          <a-menu-item key="1" @click="handleDelete"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <add-message ref="modal" @ok="handleOk"/>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :scroll="{ x: 1500, y: 300 }"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="cover" slot-scope="cover">
        <a-avatar :src="cover" />
      </span>
      <span slot="status" slot-scope="status">
        <a-badge :status="status ? 'success':'error'" :text="status ? '':''" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import { getMessageList, deleteMessage } from '@/api/message'
  import addMessage from './module/addMessage'
  export default {
    name: 'Message',
    components: {
      STable,
      Ellipsis,
      addMessage
    },
    data () {
      return {
        queryParam: {
          message: ''
        },
        sort: {

        },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          console.log('loadData.parameter', parameter)
          return getMessageList(Object.assign(parameter, this.queryParam))
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
            title: '消息类型',
            fixed: 'left',
            width: 100,
            dataIndex: 'messageType'
          },
          {
            title: '消息内容',
            width: 150,
            dataIndex: 'message'
          },
          {
            title: '更新时间',
            width: 200,
            dataIndex: 'updateDate'
          },
          {
            fixed: 'right',
            width: 150,
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
            deleteMessage(that.selectedRowKeys).then(res => {
              if (res.code === 200) {
                that.$message.success('操作成功')
                that.handleOk()
              }
            })
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
