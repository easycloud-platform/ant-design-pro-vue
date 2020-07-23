<template>
  <a-modal
    title="文章管理"
    :width="1200"
    style="top: 20px;"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="封面">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="http://106.15.102.223:9180/v1/api/sys/file/upload"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="form.cover" :src="form.cover" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="标题">
          <a-input v-model="form.title" />
        </a-form-item>
        <a-form-item label="类别">
          <a-select
            placeholder="选择文章类别"
            option-filter-prop="children"
            style="width: 200px"
            v-model="form.category"
            @change="handleArticleTypeChange"
          >
            <a-select-option v-for="i in articleTypeList" :key="i.value">
              {{ i.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="作者">
          <a-input v-model="form.author" />
        </a-form-item>
        <!-- <a-form-item label="简介">
          <a-input v-model="form.info" type="textarea" />
        </a-form-item> -->
        <a-form-item label="内容">
          <quill-editor ref="myTextEditor" v-model="form.content"></quill-editor>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import notification from 'ant-design-vue/es/notification'
import { saveArticle } from '@/api/app/article'
import { getDictListByCode } from '@/api/dict'
export default {
  name: 'AddArticle',
  data () {
    return {
      tabPosition: 'left',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      articleTypeList: [],
      visible: false,
      imageUrl: '',
      loading: false,
      confirmLoading: false,
      form: {
        category: '',
        title: '',
        info: '',
        cover: '',
        content: '',
        author: ''
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      getDictListByCode('app-article-type').then((res) => {
        this.articleTypeList = res.data
      })
    },
    edit (record) {
      this.visible = true
      this.mdl = record
      this.form = JSON.parse(JSON.stringify(record))
    },
    add () {
      this.visible = true
      this.form = {
        category: '[]',
        title: '',
        info: '',
        cover: '',
        content: '',
        author: ''
      }
    },
    handleArticleTypeChange (value) {
      this.form.category = value
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       saveArticle(this.form)
        .then((res) => {
         if (res.code === -1) {
                notification.error({
                    message: '错误信息',
                    description: res.message
                })
            } else {
                that.visible = false
                that.$emit('ok', '')
            }
        })
        .finally(() => {
           that.confirmLoading = false
        })
    },
    handleCancel () {
      this.form = {
        category: '[]',
        title: '',
        info: '',
        cover: '',
        content: '',
        author: ''
      }
      this.visible = false
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          this.form.cover = info.file.response.data
        } else {
          this.$message.error('文件上传服务出小差了')
        }
        this.loading = false
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    }
  }
}
</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  img{
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
