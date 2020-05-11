<template>
  <a-modal
    title="定时任务"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
      <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="jobClassName">
          <a-input v-model="form.jobClassName" />
        </a-form-item>
        <a-form-item label="jobGroupName">
          <a-input v-model="form.jobGroupName" />
        </a-form-item>
         <a-form-item label="jobDescription">
          <a-input v-model="form.jobDescription" />
        </a-form-item>
        <a-form-item label="cronExpression">
          <a-input v-model="form.cronExpression" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addTask } from '@/api/task'
export default {
  name: 'AddTask',
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
        cronExpression: '',
        jobGroupName: '',
        jobClassName: '',
        jobDescription: ''
      }
    }
  },
  methods: {
    add () {
      this.visible = true
      this.form = {
        cronExpression: '',
        jobGroupName: '',
        jobClassName: '',
        jobDescription: ''
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       addTask(this.form)
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
        cronExpression: '',
        jobGroupName: '',
        jobClassName: '',
        jobDescription: ''
      }
      this.visible = false
    }
  }
}
</script>
<style>
</style>
