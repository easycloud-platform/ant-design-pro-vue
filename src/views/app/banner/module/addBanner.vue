<template>
  <a-modal
    title="轮播图管理"
    :width="1200"
    style="top: 20px;"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="轮播图">
          <a-input v-model="form.pictureUrl" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item label="跳转链接">
          <a-input v-model="form.linkUrl" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import notification from 'ant-design-vue/es/notification'
import { saveBanner } from '@/api/app/banner'
export default {
  name: 'AddBanner',
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
        name: '',
        pictureUrl: '',
        linkUrl: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    edit (record) {
      this.visible = true
      this.mdl = record
      this.form = JSON.parse(JSON.stringify(record))
    },
    add () {
      this.visible = true
      this.form = {
        name: '',
        pictureUrl: '',
        linkUrl: ''
      }
    },
    handleArticleTypeChange (value) {
      this.form.category = value
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       saveBanner(this.form)
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
        name: '',
        pictureUrl: '',
        linkUrl: ''
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
