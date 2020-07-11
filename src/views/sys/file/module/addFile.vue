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
      <a-upload
            name="file"
            :show-upload-list="false"
            action="http://106.15.102.223:9180/v1/api/file/upload"
            :before-upload="beforeUpload"
            @change="handleChange"
            >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
              band files
        </p>
      </a-upload>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'AddFile',
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
      confirmLoading: false
    }
  },
  methods: {
    edit (record) {
      this.visible = true
    },
    add () {
      this.visible = true
    },
    handleSubmit () {
       var that = this
       that.visible = false
       that.$emit('ok', '')
    },
    handleCancel () {
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
           this.$message.success('上传成功')
        } else {
          this.$message.error('文件上传服务出小差了')
        }
      }
    },
    beforeUpload (file) {
      return true
    }
  }
}
</script>
<style scoped>
.picture-card {
    display: table;
    float: left;
    width: 100% !important;
    height: 104px;
    margin-right: 8px;
    margin-bottom: 8px;
    text-align: center;
    vertical-align: top;
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
    -webkit-transition: border-color 0.3s ease;
    transition: border-color 0.3s ease;
}
</style>
