<template>
  <a-modal
    title="店铺设置"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
      <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="店铺LOGO">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="http://106.15.102.223:9180/v1/api/sys/file/upload"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="form.logo" :src="form.logo" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="店铺名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item label="店铺简介">
          <a-input v-model="form.info" />
        </a-form-item>
         <a-form-item label="地址">
          <a-input v-model="form.addr" />
        </a-form-item>
         <a-form-item label="负责人名称">
          <a-input v-model="form.masterName" />
        </a-form-item>
         <a-form-item label="负责人电话">
          <a-input v-model="form.masterPhone" />
        </a-form-item>
         <a-form-item label="负责人微信">
          <a-input v-model="form.masterWechat" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="form.remarks" type="textarea" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import notification from 'ant-design-vue/es/notification'
import { saveStore } from '@/api/app/store'
export default {
  name: 'AddStore',
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
      visible: false,
      imageUrl: '',
      loading: false,
      confirmLoading: false,
      form: {
        logo: '',
        name: '',
        info: '',
        addr: '',
        masterName: '',
        masterPhone: '',
        masterWechat: '',
        remarks: ''
      }
    }
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
        logo: '',
        name: '',
        info: '',
        addr: '',
        masterName: '',
        masterPhone: '',
        masterWechat: '',
        remarks: ''
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       saveStore(this.form)
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
        logo: '',
        name: '',
        info: '',
        addr: '',
        masterName: '',
        masterPhone: '',
        masterWechat: '',
        remarks: ''
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
          this.form.logo = info.file.response.data
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
