<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="猫咪昵称">
              <a-input placeholder="请输入" v-model="queryParam.name"/>
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
      :scroll="{ x: 1500, y: 300 }"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.modal.edit(record)">编辑资料</a>
        <a-divider type="vertical" />
        <a @click="$refs.vannicRecord.vannic(record)">疫苗记录</a>
        <a-divider type="vertical" />
        <a @click="$refs.modal.edit(record)">驱虫记录</a>
      </span>
    </s-table>

    <add-cat ref="modal" @ok="handleOk"></add-cat>
    <vannic-record ref="vannicRecord"></vannic-record>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import addCat from './module/addCat'
import vannicRecord from './module/vannic/vannicRecord'
import { getCatList, deleteCat } from '@/api/app/cat'
export default {
  name: 'Cat',
  components: {
    STable,
    vannicRecord,
    addCat,
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
        name: ''
      },
      // 表头
      columns: [
        {
          title: '猫咪',
          dataIndex: 'name',
          fixed: 'left',
          width: '100px'
        },
        {
          title: '商店',
          width: '100px',
          dataIndex: 'store.name'
        },
        {
          title: '品种',
          width: '100px',
          dataIndex: 'catBreed.name'
        },
        {
          title: '介绍',
          width: '100px',
          dataIndex: 'info'
        },
        {
          title: '体重',
          width: '100px',
          dataIndex: 'weight'
        },
        {
          title: '年龄',
          width: '100px',
          dataIndex: 'age'
        },
        {
          title: '性别',
          width: '100px',
          dataIndex: 'sex'
        },
        {
          title: '市场价',
          width: '100px',
          dataIndex: 'price'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate',
          width: '200px',
          sorter: true
        }, {
          title: '操作',
          width: '240px',
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getCatList(Object.assign(parameter, this.queryParam))
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
          deleteCat(that.selectedRowKeys).then(res => {
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
