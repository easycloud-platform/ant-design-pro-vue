<template>
  <a-modal
    title="猫咪信息"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
      <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" >
        <a-form-item label="猫咪图片">
          <a-upload
            name="file"
            :multiple="true"
            action="http://106.15.102.223:9180/v1/api/sys/file/upload"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" /> Click to Upload </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="猫咪昵称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item label="猫咪介绍">
          <a-input v-model="form.info" />
        </a-form-item>
         <a-form-item label="体重">
          <a-input v-model="form.weight" />
        </a-form-item>
         <a-form-item label="年龄">
          <a-input v-model="form.age" />
        </a-form-item>
         <a-form-item label="性别">
          <a-input v-model="form.sex" />
        </a-form-item>
         <a-form-item label="价格">
          <a-input v-model="form.price" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="form.remarks" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import notification from 'ant-design-vue/es/notification'
import { saveCat } from '@/api/app/cat'
export default {
  name: 'AddCat',
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
        name: '',
        weight: '',
        age: '',
        sex: '',
        price: '',
        photo: [],
        info: '',
        video: [],
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
        name: '',
        weight: '',
        age: '',
        sex: '',
        price: '',
        photo: [],
        info: '',
        video: [],
        remarks: ''
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       saveCat(this.form)
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
        describe: '',
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
          this.form.photo.push(info.file.response.data)
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
