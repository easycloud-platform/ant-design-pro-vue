<template>
  <a-modal
    title="系统接口设置"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
      <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="接口名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item label="接口类型">
          <a-input v-model="form.type" />
        </a-form-item>
        <a-form-item label="接口路径">
          <a-input v-model="form.url" />
        </a-form-item>
        <a-form-item label="接口状态">
          <a-switch v-model="form.status" @change="onChange">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveInterface } from '@/api/interface'
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'AddInterface',
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
        type: '',
        url: '',
        status: true
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
        type: '',
        url: '',
        status: true
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       saveInterface(this.form)
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
    onChange (checked) {
      this.form.status = checked
    },
    handleCancel () {
      this.form = {
        name: '',
        type: '',
        url: '',
        status: true
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
