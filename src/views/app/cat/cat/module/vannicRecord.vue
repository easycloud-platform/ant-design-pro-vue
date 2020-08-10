<template>
  <a-modal
    title="疫苗记录"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
  </a-modal>
</template>

<script>
import notification from 'ant-design-vue/es/notification'
import { saveCat } from '@/api/app/cat'
import { getStoreList } from '@/api/app/store'
import { getCatBreedList } from '@/api/app/catBreed'
export default {
  name: 'AddCat',
  data () {
    return {
      tags: [],
      inputVisible: false,
      inputValue: '',
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
      photo: [],
      video: [],
      form: {
        name: '',
        weight: '',
        age: '',
        sex: '',
        tags: '[]',
        price: '',
        photo: '',
        info: '',
        video: '',
        remarks: '',
        store: {
          id: ''
        },
        catBreed: {
          id: ''
        }
      },
      storeList: [],
      catBreedList: []
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    handleClose (removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag)
      this.tags = tags
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },
    handleInputChange (e) {
      this.inputValue = e.target.value
    },
    handleInputConfirm () {
      const inputValue = this.inputValue
      let tags = this.tags
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
      }
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: ''
      })
    },
    initData () {
      getStoreList().then((res) => {
        this.storeList = res.data.data
      })
      getCatBreedList().then((res) => {
        this.catBreedList = res.data.data
      })
    },
    handleStoreChange (value) {
      this.form.store.id = value
    },
    handleCatBreedChange (value) {
      this.form.catBreed.id = value
    },
    edit (record) {
      this.visible = true
      this.mdl = record
      this.form = JSON.parse(JSON.stringify(record))
      this.tags = JSON.parse(this.form.tags)
      this.photo = JSON.parse(this.form.photo)
      this.video = JSON.parse(this.form.video)
    },
    add () {
      this.visible = true
      this.photo = []
      this.video = []
      this.tags = []
      this.form = {
        name: '',
        weight: '',
        age: '',
        sex: '',
        price: '',
        photo: '[]',
        info: '',
        tags: '[]',
        video: '[]',
        remarks: '',
        store: {
          id: ''
        },
        catBreed: {
          id: ''
        }
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       this.form.photo = JSON.stringify(this.photo)
       this.form.video = JSON.stringify(this.video)
       this.form.tags = JSON.stringify(this.tags)
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
        weight: '',
        age: '',
        sex: '',
        price: '',
        photo: '[]',
        info: '',
        tags: '[]',
        video: '[]',
        remarks: '',
        store: {
          id: ''
        },
        catBreed: {
          id: ''
        }
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
          this.photo.push(info.file.response.data)
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
