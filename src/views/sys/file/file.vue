<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="存储路径">
              <a-input placeholder="请输入存储路径" v-model="queryParam.localPath"/>
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
      <a-button type="primary" icon="plus" @click="handleAdd">上传测试</a-button>
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
      :scroll="{ x: 900 }"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
     <span slot="kind" slot-scope="text, record">
          <a-tag color="#f50">
            {{record.kind}}
          </a-tag>
      </span>
      <span slot="viewPath" slot-scope="text, record">
         <a @click="open(record)">{{record.viewPath}}</a>
      </span>
    </s-table>

    <add-file ref="modal" @ok="handleOk"></add-file>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getFileList, deleteFile } from '@/api/file'
import addFile from './module/addFile'
export default {
  name: 'File',
  components: {
    STable,
    Ellipsis,
    addFile
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
        localPath: ''
      },
      // 表头
      columns: [
        {
          title: '存储路径',
          dataIndex: 'localPath'
        },
        {
          title: '类型',
          dataIndex: 'kind',
          scopedSlots: { customRender: 'kind' }
        },
        {
          title: '大小（字节）',
          dataIndex: 'size'
        },
        {
          title: '预览路径',
          dataIndex: 'viewPath',
          scopedSlots: { customRender: 'viewPath' }
        },
        {
          title: '上传时间',
          dataIndex: 'createDate'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getFileList(Object.assign(parameter, this.queryParam))
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
    open (row) {
      window.open(row.viewPath)
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
          deleteFile(that.selectedRowKeys).then(res => {
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
