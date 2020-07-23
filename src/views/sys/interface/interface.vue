<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="接口名称">
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
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
       <span slot="status" slot-scope="status">
        <a-badge :status="status ? 'success':'error'" :text="status ? '':''" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.modal.edit(record)">编辑</a>
      </span>
    </s-table>

    <add-interface ref="modal" @ok="handleOk"></add-interface>

  </a-card>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import addInterface from './module/addInterface'
  import { getInterfaceList, deleteInterface } from '@/api/interface'
  export default {
    name: 'Interface',
    components: {
      STable,
      addInterface,
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
            title: '接口名称',
            dataIndex: 'name'
          },
          {
            title: '接口类型',
            dataIndex: 'type'
          },
          {
            title: '接口路径',
            dataIndex: 'url'
          },
          {
            title: '接口状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '更新时间',
            dataIndex: 'updateDate',
            sorter: true
          }, {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          console.log('loadData.parameter', parameter)
          return getInterfaceList(Object.assign(parameter, this.queryParam))
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
            deleteInterface(that.selectedRowKeys).then(res => {
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
      /*
        'selectedRows': function (selectedRows) {
          this.needTotalList = this.needTotalList.map(item => {
            return {
              ...item,
              total: selectedRows.reduce( (sum, val) => {
                return sum + val[item.dataIndex]
              }, 0)
            }
          })
        }
        */
    }
  }
</script>
