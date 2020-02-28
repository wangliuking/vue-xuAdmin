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
      placeholder="请输入组ID"
      maxlength="30"
      show-word-limit
      v-model="groupId"
      class="searchInput"
    >
    </el-input>
    <el-input
      type="text"
      placeholder="请输入组名称"
      maxlength="50"
      show-word-limit
      v-model="groupName"
      class="searchInput"
    >
    </el-input>
    <el-button type="success" class="searchBtn" :loading="false" @click="searchList">查 询</el-button>
    <el-button type="warning" @click="clearInput">清 空</el-button>
    <el-button type="danger" @click="showAddDialog">创 建</el-button>
    <el-button type="danger" @click="showDialog_batch">批量操作</el-button>
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
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="groupId"
          label="组ID">
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="组名">
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
              @click="deleteUser2Group(scope.$index, scope.row)">删除
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
      <el-row>
        <el-col :span="12">
          <span>用户ID：</span>
          <el-select v-model="userId_dialog" @change="checkUser2Group" filterable placeholder="请选择用户">
            <el-option
              v-for="item in userIdList"
              :key="item.userId"
              :label="item.userId"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>组ID：</span>
          <el-select v-model="groupId_dialog" @change="checkUser2Group" filterable placeholder="请选择组">
            <el-option
              v-for="item in groupIdList"
              :key="item.groupId"
              :label="item.groupId"
              :value="item.groupId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="addUser2Group" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateUser2Group" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle_batch"
      :visible.sync="dialogVisible_batch"
      width="30%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span>用户ID范围（支持,或-进行分割）：</span>
          <el-input
            type="text"
            placeholder="请输入用户ID"
            maxlength="256"
            show-word-limit
            v-model="userId_dialog_batch"
            class="dialogInput"
            @focus="checkStatus_batch = true"
            @blur="checkUserId_batch"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span>组ID范围（支持,或-进行分割）：</span>
          <el-input
            type="text"
            placeholder="请输入组ID"
            maxlength="256"
            show-word-limit
            v-model="groupId_dialog_batch"
            class="dialogInput"
            @focus="checkStatus_batch = true"
            @blur="checkGroupId_batch"
          >
          </el-input>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible_batch = false">取 消</el-button>
    <el-button type="primary" @click="addUser2Group_batch" :disabled="checkStatus_batch">批量创建</el-button>
    <el-button type="primary" @click="deleteUser2Group_batch" :disabled="checkStatus_batch">批量删除</el-button>
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
        groupId: '',
        groupName: '',
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10,   //默认一次显示10条数据
        dialogVisible: false,
        dialogTitle: '',
        userId_dialog: '',
        groupId_dialog: '',
        userIdList: [],
        groupIdList: [],
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true,
        oldUserId: '',
        oldGroupId: '',

        dialogVisible_batch: false,
        dialogTitle_batch: '',
        userId_dialog_batch: '',
        groupId_dialog_batch: '',
        checkStatus_batch: true
      }
    },
    mounted() {
      this.searchList()
      this.getUserIdList()
      this.getGroupIdList()
    },
    methods: {
      getUserIdList() {
        this.$axios.get('auth/userList?start=&limit=&userId=&userName=&power=&structure=' + this.$store.getters.info.role)
          .then(response => {
            this.userIdList = response.data.data.list
          }).catch(err => {
          console.log(err)
        })
      },
      getGroupIdList() {
        this.$axios.get('group/groupList?start=&limit=&groupId=&groupName=&type=&structure=' + this.$store.getters.info.role)
          .then(response => {
            this.groupIdList = response.data.data.list
          }).catch(err => {
          console.log(err)
        })
      },
      deleteUser2Group_batch() {
        const data = {
          "userId": this.userId_dialog_batch,
          "groupId": this.groupId_dialog_batch,
          "oldUserId": this.$store.getters.info.role
        }
        this.$axios.post('user2group/deleteUser2GroupBatch', data)
          .then(() => {
            this.alertMessage('删除成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('删除失败' + err)
        })
        this.dialogVisible_batch = false
      },
      deleteUser2Group(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ 用户Id:' + row.userId + '  组Id:' + row.groupId, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('user2group/deleteUser2Group?userId=' + row.userId + '&groupId=' + row.groupId)
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
      updateUser2Group() {
        const data = {
          "userId": this.userId_dialog,
          "groupId": this.groupId_dialog,
          "oldUserId": this.oldUserId,
          "oldGroupId": this.oldGroupId
        }
        this.$axios.post(`user2group/updateUser2Group`, data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      addUser2Group_batch() {
        const data = {
          "userId": this.userId_dialog_batch,
          "groupId": this.groupId_dialog_batch,
          "oldUserId": this.$store.getters.info.role
        }
        this.$axios.post('user2group/addUser2GroupPatch', data)
          .then(() => {
            this.alertMessage('添加成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('添加失败' + err)
        })
        this.dialogVisible_batch = false
      },
      addUser2Group() {
        const data = {
          "userId": this.userId_dialog,
          "groupId": this.groupId_dialog
        }
        this.$axios.post(`user2group/addUser2Group`, data)
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
      checkUserId_batch() {
        const tempIds = this.userId_dialog_batch
        const regPos = /^\d+(\.\d+)?$/
        if (tempIds === null || tempIds === '') {
          this.alertMessage('用户ID不能为空')
        } else if (tempIds.indexOf(",") == -1 && tempIds.indexOf("-") == -1 && regPos.test(tempIds)) {
          this.checkStatus_batch = false
        } else if (tempIds.indexOf(",") != -1 && tempIds.indexOf("-") != -1) {
          this.alertMessage('不能同时包含,或-符号')
        } else if (tempIds.indexOf(",,") != -1) {
          this.alertMessage('不能同时包含连续多个,符号')
        } else if (tempIds.indexOf("--") != -1) {
          this.alertMessage('不能同时包含多个-符号')
        } else if (tempIds.indexOf(",") == 0 || tempIds.lastIndexOf(",") == (tempIds.length - 1)) {
          this.alertMessage(',符号不能位于开头或结尾')
        } else if (!regPos.test(tempIds.replace(/,/g, "").replace(/-/g, ""))) {
          this.alertMessage('有非数字，请检查')
        } else if (tempIds.indexOf(",") != -1) {
          this.checkStatus_batch = false
        } else if (tempIds.indexOf("-") != -1) {
          const tempArr = tempIds.split("-")
          if (tempArr.length != 2) {
            this.alertMessage('-只能有一个')
          } else if (tempArr[0] === '' || tempArr[1] === '') {
            this.alertMessage('-前后必须有数字')
          } else if (parseInt(tempArr[0]) >= parseInt(tempArr[1])) {
            this.alertMessage('-左侧数必须小于右侧')
          } else if ((parseInt(tempArr[1]) - parseInt(tempArr[0])) > 1000) {
            this.alertMessage('批量用户数大于1000，请缩小范围')
          } else {
            this.checkStatus_batch = false
          }
        }
      },
      checkGroupId_batch() {
        const tempIds = this.groupId_dialog_batch
        const regPos = /^\d+(\.\d+)?$/
        if (tempIds === null || tempIds === '') {
          this.alertMessage('组ID不能为空')
        } else if (tempIds.indexOf(",") == -1 && tempIds.indexOf("-") == -1 && regPos.test(tempIds)) {
          this.checkStatus_batch = false
        } else if (tempIds.indexOf(",") != -1 && tempIds.indexOf("-") != -1) {
          this.alertMessage('不能同时包含,或-符号')
        } else if (tempIds.indexOf(",,") != -1) {
          this.alertMessage('不能同时包含连续多个,符号')
        } else if (tempIds.indexOf("--") != -1) {
          this.alertMessage('不能同时包含多个-符号')
        } else if (tempIds.indexOf(",") == 0 || tempIds.lastIndexOf(",") == (tempIds.length - 1)) {
          this.alertMessage(',符号不能位于开头或结尾')
        } else if (!regPos.test(tempIds.replace(/,/g, "").replace(/-/g, ""))) {
          this.alertMessage('有非数字，请检查')
        } else if (tempIds.indexOf(",") != -1) {
          this.checkStatus_batch = false
        } else if (tempIds.indexOf("-") != -1) {
          const tempArr = tempIds.split("-")
          if (tempArr.length != 2) {
            this.alertMessage('-只能有一个')
          } else if (tempArr[0] === '' || tempArr[1] === '') {
            this.alertMessage('-前后必须有数字')
          } else if (parseInt(tempArr[0]) >= parseInt(tempArr[1])) {
            this.alertMessage('-左侧数必须小于右侧')
          } else if ((parseInt(tempArr[1]) - parseInt(tempArr[0])) > 1000) {
            this.alertMessage('批量组数量大于1000，请缩小范围')
          } else {
            this.checkStatus_batch = false
          }
        }
      },
      checkUser2Group() {
        console.log("准备检索")
        if (this.userId_dialog === this.oldUserId && this.groupId_dialog === this.oldGroupId) {
          return
        }
        if (this.userId_dialog === '' || this.groupId_dialog === '') {
          this.checkStatus = true
          this.alertMessage('请选择用户id或组id')
          return
        }
        this.$axios.get('user2group/checkUser2Group?userId=' + this.userId_dialog + '&groupId=' + this.groupId_dialog)
          .then(response => {
            console.log(response)
            if (response.data.data) {
              //存在相同userId
              this.checkStatus = true
              this.alertMessage('该用户和组关联已存在')
            } else {
              this.checkStatus = false
            }
          }).catch(err => {
          console.log(err)
        })
      },
      showUpdateDialog(index, row) {
        console.log(row)
        this.dialogTitle = '修改关联'
        this.userId_dialog = row.userId
        this.groupId_dialog = row.groupId
        this.oldUserId = row.userId
        this.oldGroupId = row.groupId
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      showAddDialog() {
        this.dialogTitle = '添加关联'
        this.userId_dialog = ''
        this.groupId_dialog = ''
        this.addBtnStatus = true
        this.updateBtnStatus = false
        this.dialogVisible = true
        this.checkStatus = true
      },
      showDialog_batch() {
        this.dialogTitle_batch = '批量操作'
        this.userId_dialog_batch = ''
        this.groupId_dialog_batch = ''
        this.dialogVisible_batch = true
        this.checkStatus_batch = true
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
        this.$axios.get('user2group/user2groupList?start=' + start + '&limit=' + limit + '&userId=' + this.userId + '&userName=' + this.userName + '&groupId=' + this.groupId + '&groupName=' + this.groupName + "&structure=" + this.$store.getters.info.role)
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
        this.groupId = ''
        this.groupName = ''
        this.searchList()
      },
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
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
