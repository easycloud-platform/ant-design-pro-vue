<template>
  <a-modal
    title="个人信息"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
      <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="姓名">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item label="简介">
          <a-input v-model="form.describe" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="form.remarks" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveRole } from '@/api/role'
export default {
  name: 'AddRole',
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
        describe: '',
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
        describe: '',
        remarks: ''
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       saveRole(this.form)
        .then((res) => {
          console.log(res)
        })
        .catch(err => this.requestFailed(err))
        .finally(() => {
           that.confirmLoading = false
           that.visible = false
           that.$emit('ok', '')
        })
    },
    handleCancel () {
      this.form = {
        name: '',
        describe: '',
        remarks: ''
      }
      this.visible = false
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
