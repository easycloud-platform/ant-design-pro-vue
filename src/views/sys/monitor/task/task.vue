<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="类名">
              <a-input placeholder="请输入" v-model="queryParam.jobClassName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
             <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
             <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item @click="handleDelete"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
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
      <span slot="triggerState" slot-scope="triggerState">
        <a-tag color="#108ee9">
          {{ triggerState }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.editModal.edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="pause(record)">暂停</a>
        <a-divider type="vertical" />
        <a @click="resume(record)">恢复</a>
        <a-divider type="vertical" />
         <a @click="handleDelete(record)">删除</a>
      </span>
    </s-table>

    <add-task ref="addModal" @ok="handleOk"></add-task>

    <edit-task ref="editModal" @ok="handleOk"></edit-task>

  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getTaskList, pauseTask, resumeTask, deleteTask } from '@/api/task'
import addTask from './module/addTask'
import editTask from './module/editTask'
export default {
  name: 'Task',
  components: {
    STable,
    Ellipsis,
    addTask,
    editTask
  },
  data () {
    return {
      visible: false,
      form: null,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        jobClassName: ''
      },
      // 表头
      columns: [
        {
          title: '任务名称',
          dataIndex: 'jobName'
        },
        {
          title: '任务描述',
          dataIndex: 'jobDescription'
        },
        {
          title: '状态',
          dataIndex: 'triggerState',
          scopedSlots: { customRender: 'triggerState' }
        },
        {
          title: '下一执行时间',
          dataIndex: 'nextFireTime'
        },
        {
          title: 'cron表达式',
          dataIndex: 'cronExpression',
          sorter: true
        }, {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getTaskList(Object.assign(parameter, this.queryParam))
          .then(res => {
          return res.data
        })
      },
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
      this.$refs.addModal.add()
    },
    handleEdit (record) {
      this.$refs.editModal.edit(record)
    },
    pause (row) {
      const that = this
      pauseTask(row).then(res => {
        if (res.code === 200) {
          that.$message.success('操作成功')
          that.handleOk()
        } else {
          that.$message.error(res.message)
        }
      })
    },
    resume (row) {
      const that = this
      resumeTask(row).then(res => {
        if (res.code === 200) {
          that.$message.success('操作成功')
          that.handleOk()
        } else {
          that.$message.error(res.message)
        }
      })
    },
    handleDelete (row) {
      const that = this
      that.$confirm({
        title: '是否确认删除',
        content: '谨慎操作',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          deleteTask(row).then(res => {
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleOk () {
      this.$refs.table.refresh()
    }
  },
  watch: {
  }
}
</script>
