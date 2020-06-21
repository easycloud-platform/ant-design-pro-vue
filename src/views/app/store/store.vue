<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="店铺名称">
              <a-input placeholder="请输入" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="负责人名字">
              <a-input placeholder="请输入" v-model="queryParam.masterName"/>
            </a-form-item>
          </a-col>
           <a-col :md="8" :sm="24">
            <a-form-item label="联系电话">
              <a-input placeholder="请输入" v-model="queryParam.masterPhone"/>
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
          <a-menu-item  @click="handleDelete"><a-icon type="delete" />删除</a-menu-item>
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
      :scroll="{ x: 1500, y: 300 }"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.modal.edit(record)">编辑</a>
      </span>
    </s-table>

    <add-store ref="modal" @ok="handleOk"></add-store>

  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import addStore from './module/addStore'
import { getStoreList, deleteStore } from '@/api/app/store'
export default {
  name: 'Store',
  components: {
    STable,
    addStore,
    Ellipsis
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
        name: '',
        masterName: '',
        masterPhone: ''
      },
      // 表头
      columns: [
        {
          title: '店铺名称',
          fixed: 'left',
          width: 150,
          dataIndex: 'name'
        },
        {
          title: '店铺介绍',
          width: '200px',
          dataIndex: 'info'
        },
         {
          title: '关注数量',
          width: '130px',
          dataIndex: 'followNum'
        },
        {
          title: '地址',
          width: '200px',
          dataIndex: 'addr'
        },
        {
          title: '负责人名称',
          width: '150px',
          dataIndex: 'masterName'
        },
        {
          title: '负责人电话',
          width: '150px',
          dataIndex: 'masterPhone'
        },
        {
          title: '负责人微信',
          width: '150px',
          dataIndex: 'masterWechat'
        },
        {
          title: '更新时间',
          width: '150px',
          dataIndex: 'updateDate'
        }, {
          title: '操作',
          fixed: 'right',
          width: 150,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getStoreList(Object.assign(parameter, this.queryParam))
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
          deleteStore(that.selectedRowKeys).then(res => {
            if (res.code === 200) {
              that.$message.success('操作成功')
              that.handleOk()
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
