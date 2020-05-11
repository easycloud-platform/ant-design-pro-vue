<template>
  <a-modal
    title="个人信息"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-tabs default-active-key="1" :tab-position="tabPosition">
      <a-tab-pane key="1" tab="基本资料">
         <a-spin :spinning="confirmLoading">
          <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="头像">
              <a-upload
                name="file"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                action="http://127.0.0.1:9180/v1/api/file/upload"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <img v-if="form.avatar" :src="form.avatar" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item label="姓名">
              <a-input v-model="form.name" />
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-model="form.email" />
            </a-form-item>
            <a-form-item label="电话">
              <a-input v-model="form.phone" />
            </a-form-item>
            <a-form-item label="地址">
              <a-input v-model="form.address" />
            </a-form-item>
            <a-form-item label="备注">
              <a-input v-model="form.remarks" />
            </a-form-item>
          </a-form>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="2" tab="账号信息">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="登录名">
            <a-input v-model="form.loginName" />
          </a-form-item>
          <a-form-item label="密码">
            <a-input v-model="password" />
          </a-form-item>
           <a-form-item label="确认密码">
            <a-input v-model="newPassword" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="3" tab="第三方登录">
        Content of Tab 3
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { saveUser } from '@/api/user'
export default {
  name: 'AddUser',
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
      password: '',
      newPassword: '',
      confirmLoading: false,
      form: {
        name: '',
        avatar: '',
        email: '',
        phone: '',
        password: '',
        loginName: '',
        address: '',
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
        avatar: '',
        email: '',
        phone: '',
        password: '',
        loginName: '',
        address: '',
        remarks: ''
      }
    },
    handleSubmit () {
       var that = this
       if (that.password !== that.newPassword) {
          that.$message.error('密码不同')
          that.confirmLoading = false
          return
       } else {
          that.form.password = that.password
       }
       that.confirmLoading = true
       saveUser(this.form)
        .then((res) => {
          that.confirmLoading = false
          if (res.code === 200) {
            that.visible = false
            that.$emit('ok', '')
          } else {
            that.$message.error(res.message)
          }
        })
        .catch(err => this.requestFailed(err))
    },
    handleCancel () {
      this.form = {
        name: '',
        avatar: '',
        email: '',
        phone: '',
        password: '',
        loginName: '',
        address: '',
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
        console.log(info)
        if (info.file.response.code === 200) {
          this.form.avatar = info.file.response.message
        } else {
          this.$message.error('文件上传服务出小差了')
        }
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
