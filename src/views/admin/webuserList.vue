<template>
  <div>
    <el-input
      type="text"
      placeholder="请输入用户ID"
      maxlength="10"
      show-word-limit
      v-model="userId"
      class="searchInput"
    >
    </el-input>
    <el-input
      type="text"
      placeholder="请输入用户名称"
      maxlength="10"
      show-word-limit
      v-model="userName"
      class="searchInput"
    >
    </el-input>
    <el-input
      type="text"
      placeholder="请输入组织架构"
      maxlength="10"
      show-word-limit
      v-model="power"
      class="searchInput"
    >
    </el-input>
    <el-button type="success" class="searchBtn" :loading="false" @click="searchList">查 询</el-button>
    <el-button type="warning" @click="clearInput">清 空</el-button>
    <el-button type="danger" @click="showAddDialog">创 建</el-button>
    <template>
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="userId"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="powerName"
          label="组织架构">
        </el-table-column>
        <el-table-column
          prop="loginTime"
          label="最近登录时间"
          sortable
          :filter-method="filterHandler"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showUpdateDialog(scope.$index, scope.row)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteWebUser(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="changeList"/>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <!--<el-link v-show="checkUserIdStatus" v-text="checkUserIdContent" type="danger" :underline="false"
               style="margin-bottom: 5px;"></el-link>-->
      <el-row>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="请输入账号"
            maxlength="30"
            show-word-limit
            v-model="userId_dialog"
            class="dialogInput"
            @focus="checkStatus = true"
            @blur="checkWebUserId"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="请输入名称"
            maxlength="50"
            show-word-limit
            v-model="userName_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="请输入密码"
            maxlength="30"
            show-word-limit
            v-model="password_dialog"
            class="dialogInput"
            show-password
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-select v-model="power_dialog" filterable placeholder="请选择组织结构">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.fullName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-select v-model="type_dialog" filterable placeholder="请选择账户类型">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="addWebUser" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateWebUser" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/views/admin/Pagination'
  import Cookies from 'js-cookie'

  export default {
    name: 'userList',
    data() {
      return {
        userId: '',
        userName: '',
        power: '',
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10,   //默认一次显示10条数据
        dialogVisible: false,
        dialogTitle: '',
        userId_dialog: '',
        userName_dialog: '',
        password_dialog: '',
        options: [],
        types: [{
          id: 0,
          name: '普通用户'
        }, {
          id: 1,
          name: '管理员'
        }, {
          id: 2,
          name: '超级管理员'
        }],
        power_dialog: '',
        type_dialog: '',
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true,
        oldUserId: ''
      }
    },
    mounted() {
      this.searchList()
      this.getStructureList()
    },
    methods: {
      getStructureList() {
        this.$axios.get('structure/selectStructureList?structure=' + this.$store.getters.info.role)
          .then(response => {
            console.log(response)
            this.options = response.data.nodeList
          }).catch(err => {
          console.log(err)
        })
      },
      deleteWebUser(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ 账号:' + row.userId + '  名称:' + row.userName, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('auth/deleteWebUser?userId=' + row.userId)
            .then(() => {
              this.alertMessage('删除成功')
              this.searchList()
            }).catch(err => {
            this.alertMessage('删除失败' + err)
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      updateWebUser() {
        const data = {
          "userId": this.userId_dialog,
          "userName": this.userName_dialog,
          "password": this.password_dialog,
          "power": this.power_dialog,
          "type": this.type_dialog,
          "oldUserId": this.oldUserId
        }
        this.$axios.post('auth/updateWebUser', data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      addWebUser() {
        if (this.password_dialog == '') {
          this.alertMessage('密码不能为空')
          return
        }
        const data = {
          "userId": this.userId_dialog,
          "userName": this.userName_dialog,
          "password": this.password_dialog,
          "power": this.power_dialog,
          "type": this.type_dialog
        }
        this.$axios.post('auth/addWebUser', data)
          .then(() => {
            this.alertMessage('添加成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('添加失败' + err)
        })
        this.dialogVisible = false
      },
      alertMessage(message) {
        const h = this.$createElement
        this.$message({
          message: h('p', null, [
            h('span', {style: 'color: teal'}, message)
          ])
        })
      },
      checkWebUserId() {
        this.$axios.get('auth/checkWebUserId?userId=' + this.userId_dialog)
          .then(response => {
            console.log(response)
            if (response.data.data && this.userId_dialog !== this.oldUserId) {
              //存在相同userId
              this.checkStatus = true
              this.alertMessage('账号已存在')
            } else if (this.userId_dialog === '') {
              //输入用户为空
              this.checkStatus = true
              this.alertMessage('账号不能为空')
            } else {
              this.checkStatus = false
            }
          }).catch(err => {
          console.log(err)
        })
      },
      showUpdateDialog(index, row) {
        console.log(row)
        this.dialogTitle = '修改账号'
        this.userId_dialog = row.userId
        this.userName_dialog = row.userName
        this.password_dialog = ''
        this.power_dialog = row.power
        this.type_dialog = row.type
        this.oldUserId = row.userId
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      showAddDialog() {
        this.dialogTitle = '添加账号'
        this.userId_dialog = ''
        this.userName_dialog = ''
        this.password_dialog = ''
        this.power_dialog = ''
        this.type_dialog = ''
        this.addBtnStatus = true
        this.updateBtnStatus = false
        this.dialogVisible = true
        this.checkStatus = true
      },
      handleClose(done) {
        /*this.$confirm('确认关闭？')
          .then(() => {
            done()
          })
          .catch(() => {
          })*/
        done()
      },
      axiosUrl() {
        const start = (this.page - 1) * this.limit
        const limit = this.limit
        this.$axios.get('auth/webuserList?start=' + start + '&limit=' + limit + '&userId=' + this.userId + '&userName=' + this.userName + '&power=' + this.power + '&structure=' + this.$store.getters.info.role)
          .then(response => {
            this.list = response.data.data.list
            this.total = response.data.data.total
          }).catch(err => {
          console.log(err)
          Cookies.remove('token')
          location.reload()
        })
      },
      searchList() {
        this.page = 1
        this.axiosUrl()
      },
      changeList(data) {
        if (data) {
          this.limit = data.limit
        }
        this.axiosUrl()
      },
      clearInput() {
        this.userId = ''
        this.userName = ''
        this.power = ''
        this.searchList()
      },
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      formatter(row, column) {
        return row.userName
      },
      filterTag(value, row) {
        return row.loginStatus === value
      }
    },
    components: {Pagination}
  }
</script>

<style lang="scss" scoped>
  .dialogInput {
    width: 95%;
    margin-bottom: 20px;
  }

  .searchInput {
    width: 10%;
    margin: 10px 0px 10px 0px
  }

  .searchBtn {
    margin-left: 10px;
  }
</style>
