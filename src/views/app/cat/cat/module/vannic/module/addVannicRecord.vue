<template>
  <a-modal
    title="疫苗管理"
    :width="1200"
    style="top: 20px;"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="疫苗名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item label="疫苗描述">
          <a-input v-model="form.info" />
        </a-form-item>
         <a-form-item label="使用药物">
          <a-input v-model="form.medicine" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import notification from 'ant-design-vue/es/notification'
import { saveVaccin } from '@/api/app/vaccin'
export default {
  name: 'AddVannicRecord',
  data () {
    return {
      visible: false,
      tabPosition: 'left',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      loading: false,
      confirmLoading: false,
      form: {
        name: '',
        catId: '',
        info: '',
        useTime: new Date(),
        medicine: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    edit (record) {
      this.visible = true
      this.form = JSON.parse(JSON.stringify(record))
    },
    add (record) {
      this.visible = true
      this.form = {
        name: '',
        catId: record,
        info: '',
        useTime: new Date(),
        medicine: ''
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       saveVaccin(this.form)
        .then((res) => {
         if (res.code === -1) {
                notification.error({
                    message: '错误信息',
                    description: res.message
                })
            } else {
                that.visible = false
                that.$emit('handleOk', '')
            }
        })
        .finally(() => {
           that.confirmLoading = false
        })
    },
    handleCancel () {
      this.form = {
        name: '',
        catId: '',
        info: '',
        useTime: new Date(),
        medicine: ''
      }
      this.visible = false
    }
  }
}
</script>
