<template>
  <a-modal
    title="权限设置"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="权限名称">
          <a-input v-model="form.permissionName" />
        </a-form-item>
        <a-form-item label="权限动作">
          <a-input v-model="form.perCode" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model="form.roleId" style="width: 100%" placeholder="选择角色" @change="handleRoleChange">
            <a-select-option v-for="role in roleList" :key="role.id">
              {{ role.name }}
            </a-select-option>
          </a-select>
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
import { savePermission } from '@/api/permission'
import { getRoleList } from '@/api/role'
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
      confirmLoading: false,
      form: {
        permissionName: '',
        perCode: '',
        roleId: '',
        remarks: ''
      }
    }
  },
 mounted () {
    this.getRoleList()
  },
  methods: {
    handleRoleChange (value) {
      this.form.roleId = value
    },
    getRoleList () {
      const that = this
      getRoleList()
        .then((res) => {
          if (res.code === -1) {
            notification.error({
              message: '错误信息',
              description: res.message
            })
          } else {
            that.roleList = res.data.data
          }
        })
        .finally(() => {
           that.confirmLoading = false
        })
    },
    edit (record) {
      this.visible = true
      this.mdl = record
      this.form = JSON.parse(JSON.stringify(record))
    },
    add () {
      this.visible = true
      this.form = {
        permissionName: '',
        perCode: '',
        roleId: '',
        remarks: ''
      }
    },
    handleSubmit () {
       var that = this
       that.confirmLoading = true
       savePermission(this.form)
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
        perCode: '',
        roleId: '',
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
