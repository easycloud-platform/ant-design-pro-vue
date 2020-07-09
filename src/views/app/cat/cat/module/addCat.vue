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
            :default-file-list="photo"
          >
            <a-button> <a-icon type="upload" /> Click to Upload </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item>
          <a-checkable-tag v-for="item in photo" :key="item">
            {{ item }}
          </a-checkable-tag>
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
        <a-form-item label="所属商店">
          <a-select
            placeholder="选择所属商店"
            style="width: 200px"
            v-model="form.store.id"
            @change="handleStoreChange">
            <a-select-option v-for="i in storeList" :key="i.id">
              {{ i.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="品种">
          <a-select
            placeholder="选择品种"
            style="width: 200px"
            v-model="form.catBreed.id"
            @change="handleCatBreedChange">
            <a-select-option v-for="i in catBreedList" :key="i.id">
              {{ i.name }}
            </a-select-option>
          </a-select>
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
          <a-input v-model="form.remarks" type="textarea" />
        </a-form-item>
      </a-form>
    </a-spin>
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
      this.photo = JSON.parse(this.form.photo)
      this.video = JSON.parse(this.form.video)
    },
    add () {
      this.visible = true
      this.photo = []
      this.video = []
      this.form = {
        name: '',
        weight: '',
        age: '',
        sex: '',
        price: '',
        photo: '[]',
        info: '',
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
