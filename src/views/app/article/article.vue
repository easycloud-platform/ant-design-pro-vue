<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="文章标题">
              <a-input placeholder="请输入" v-model="queryParam.title"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="类别">
              <a-select
                placeholder="选择文章类别"
                option-filter-prop="children"
                style="width: 200px"
                allowClear="true"
                @change="handleArticleTypeChange"
              >
                <a-select-option v-for="i in articleTypeList" :key="i.value">
                  {{ i.name }}
                </a-select-option>
              </a-select>
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
      <span slot="cover" slot-scope="cover">
        <a-avatar :src="cover" shape="square"/>
      </span>
      <span slot="appTitle" slot-scope="text, record">
        <a-popover :title="record.title">
          <template slot="content">
            <div v-html="record.content"></div>
          </template>
          <a-button type="link">
            {{ record.title }}
          </a-button>
        </a-popover>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.modal.edit(record)">编辑</a>
      </span>
    </s-table>

    <add-article ref="modal" @ok="handleOk"></add-article>

  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import addArticle from './module/addArticle'
import { getArticleList, deleteArticle } from '@/api/app/article'
import { getDictListByCode } from '@/api/dict'
export default {
  name: 'Article',
  components: {
    STable,
    addArticle,
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
        title: '',
        category: ''
      },
      // 表头
      columns: [
        {
          title: '封面',
          dataIndex: 'cover',
          scopedSlots: { customRender: 'cover' }
        },
        {
          title: '标题',
          dataIndex: 'appTitle',
          scopedSlots: { customRender: 'appTitle' }
        },
        {
          title: '类别',
          dataIndex: 'categoryName'
        },
        {
          title: '收藏数量',
          dataIndex: 'collectCount'
        },
        {
          title: '点赞数量',
          dataIndex: 'likeCount'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate'
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      articleTypeList: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getArticleList(Object.assign(parameter, this.queryParam))
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
    this.getArticleTypeList()
  },
  methods: {
    getArticleTypeList () {
       getDictListByCode('app-article-type').then((res) => {
        this.articleTypeList = res.data
      })
    },
    handleArticleTypeChange (value) {
      this.queryParam.category = value
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
          deleteArticle(that.selectedRowKeys).then(res => {
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
