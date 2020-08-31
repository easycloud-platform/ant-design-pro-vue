<template>
  <a-modal
    title="消息设置"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="消息类型">
            <a-input v-model="form.messageType" />
        </a-form-item>
        <a-form-item label="消息内容">
            <a-input v-model="form.message" type="textarea"/>
        </a-form-item>
        </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import notification from 'ant-design-vue/es/notification'
import { saveMessage } from '@/api/message'
export default {
  name: 'AddMessage',
  data () {
    return {
      tabPosition: 'left',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      imageUrl: '',
      loading: false,
      confirmLoading: false,
      roleId: [],
      form: {
        message: '',
        messageType: ''
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
        message: '',
        messageType: ''
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       saveMessage(this.form)
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
        message: '',
        messageType: ''
      }
      this.visible = false
    }
  }
}
</script>
<style>
</style>
