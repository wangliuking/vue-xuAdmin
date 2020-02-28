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
    <el-button type="danger" @click="showDialog_batch">批量操作</el-button>
    <template>
      <el-table
        :data="list"
        height="460"
        style="width: 100%"
        align="center">
        <el-table-column
          width="50"
          fixed
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          width="100"
          fixed
          prop="userId"
          label="用户ID">
        </el-table-column>
        <el-table-column
          width="100"
          prop="userName"
          label="用户名">
        </el-table-column>
        <el-table-column
          width="200"
          prop="authenticateCode"
          label="鉴权码">
        </el-table-column>
        <el-table-column
          width="100"
          prop="priority"
          label="优先级">
        </el-table-column>
        <el-table-column
          width="100"
          prop="type"
          label="用户类型">
        </el-table-column>
        <el-table-column
          width="200"
          prop="powerName"
          label="组织架构">
        </el-table-column>
        <el-table-column
          width="100"
          prop="loginStatus"
          label="登录状态">
          <template slot-scope="scope">
            <span v-if="scope.row.loginStatus === 0" style="color:red;">
              未登录
            </span>
            <span v-if="scope.row.loginStatus !== 0" style="color:green;">
              已登录
            </span>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop="loginTime"
          label="最近登录时间"
          sortable
          :filter-method="filterHandler"
        >
        </el-table-column>
        <el-table-column
          width="200"
          prop="logoutTime"
          label="最近退出时间"
          sortable
          :filter-method="filterHandler"
        >
        </el-table-column>
        <el-table-column
          width="100"
          prop="scanEn"
          label="扫描使能">
          <template slot-scope="scope">
            <span v-if="scope.row.scanEn === 0" style="color:red;">
              不允许
            </span>
            <span v-if="scope.row.scanEn !== 0" style="color:green;">
              允许
            </span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="attachGroup"
          label="当前附着组">
        </el-table-column>
        <el-table-column
          width="200"
          prop="gpsInterval"
          label="GPS上传时间间隔">
        </el-table-column>
        <el-table-column
          width="200"
          prop="externalVideoViewEn"
          label="外接视频查看权限">
          <template slot-scope="scope">
            <span v-if="scope.row.externalVideoViewEn === 0" style="color:red;">
              不允许
            </span>
            <span v-if="scope.row.externalVideoViewEn !== 0" style="color:green;">
              允许
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showUpdateDialog(scope.$index, scope.row)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteUser(scope.$index, scope.row)">删除
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
          <span>用户ID：</span>
          <el-input
            type="text"
            placeholder="请输入用户ID"
            maxlength="30"
            show-word-limit
            v-model="userId_dialog"
            class="dialogInput"
            @focus="checkStatus = true"
            @blur="checkUserId"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>用户名称：</span>
          <el-input
            type="text"
            placeholder="请输入用户名称"
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
          <span>用户密码：</span>
          <el-input
            type="text"
            placeholder="请输入用户密码"
            maxlength="30"
            show-word-limit
            v-model="password_dialog"
            class="dialogInput"
            show-password
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>鉴权码：</span>
          <el-input
            type="text"
            placeholder="请输入鉴权码"
            maxlength="30"
            show-word-limit
            v-model="authenticateCode_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span>优先级：</span>
          <el-input
            type="number"
            placeholder="优先级"
            v-model="priority_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <span>用户类型：</span>
          <el-input
            type="number"
            placeholder="用户类型"
            v-model="type_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <span>GPS上传间隔：</span>
          <el-input
            type="number"
            placeholder="GPS上传间隔"
            v-model="gpsInterval_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>扫描使能：</span>
          <el-select v-model="scanEn_dialog" filterable placeholder="请选择扫描使能">
            <el-option
              v-for="item in isAllow"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>通讯录：</span>
          <el-select v-model="userBook_dialog" filterable placeholder="请选择通讯录">
            <el-option
              v-for="item in userBooks"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="12">
          <span>外接视频查看权限：</span>
          <el-select v-model="externalVideoViewEn_dialog" filterable placeholder="请选择外接视频查看权限">
            <el-option
              v-for="item in isAllow"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>组织结构：</span>
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
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="addUser" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateUser" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle_batch"
      :visible.sync="dialogVisible_batch"
      width="30%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span>用户ID范围（可用,或-进行分割）：</span>
          <el-input
            type="text"
            placeholder="101,102,103 或 101-103两种格式均可"
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
        <el-col :span="12">
          <span>用户名称：</span>
          <el-input
            type="text"
            placeholder="请输入用户名称"
            maxlength="50"
            show-word-limit
            v-model="userName_dialog_batch"
            class="dialogInput"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>用户密码：</span>
          <el-input
            type="text"
            placeholder="请输入用户密码"
            maxlength="30"
            show-word-limit
            v-model="password_dialog_batch"
            class="dialogInput"
            show-password
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>鉴权码：</span>
          <el-input
            type="text"
            placeholder="请输入鉴权码"
            maxlength="30"
            show-word-limit
            v-model="authenticateCode_dialog_batch"
            class="dialogInput"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>优先级：</span>
          <el-input
            type="number"
            placeholder="优先级"
            v-model="priority_dialog_batch"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>用户类型：</span>
          <el-input
            type="number"
            placeholder="用户类型"
            v-model="type_dialog_batch"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>GPS上传间隔：</span>
          <el-input
            type="number"
            placeholder="GPS上传间隔"
            v-model="gpsInterval_dialog_batch"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>扫描使能：</span>
          <el-select v-model="scanEn_dialog_batch" filterable placeholder="请选择扫描使能">
            <el-option
              v-for="item in isAllow"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>通讯录：</span>
          <el-select v-model="userBook_dialog_batch" filterable placeholder="请选择通讯录">
            <el-option
              v-for="item in userBooks"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="12">
          <span>外接视频查看权限：</span>
          <el-select v-model="externalVideoViewEn_dialog_batch" filterable placeholder="请选择外接视频查看权限">
            <el-option
              v-for="item in isAllow"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>组织结构：</span>
          <el-select v-model="power_dialog_batch" filterable placeholder="请选择组织结构">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.fullName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible_batch = false">取 消</el-button>
    <el-button type="primary" @click="addUser_batch" :disabled="checkStatus_batch">批量创建</el-button>
    <el-button type="primary" @click="updateUser_batch" :disabled="checkStatus_batch">批量修改</el-button>
    <el-button type="primary" @click="deleteUser_batch" :disabled="checkStatus_batch">批量删除</el-button>
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
        authenticateCode_dialog: '',
        priority_dialog: '',
        type_dialog: '',
        scanEn_dialog: '',
        userBook_dialog: '',
        gpsInterval_dialog: '',
        externalVideoViewEn_dialog: '',
        isAllow: [{
          id: 0,
          name: '不允许'
        }, {
          id: 1,
          name: '允许'
        }],
        userBooks:[],
        groupIdList: [],
        options: [],
        power_dialog: '',
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true,
        oldUserId: '',

        dialogVisible_batch: false,
        dialogTitle_batch: '',
        userId_dialog_batch: '',
        userName_dialog_batch: '',
        password_dialog_batch: '',
        authenticateCode_dialog_batch: '',
        priority_dialog_batch: '',
        type_dialog_batch: '',
        scanEn_dialog_batch: '',
        userBook_dialog_batch: '',
        gpsInterval_dialog_batch: '',
        externalVideoViewEn_dialog_batch: '',
        power_dialog_batch: '',
        checkStatus_batch: false
      }
    },
    mounted() {
      this.searchList()
      this.getUserBookList()
      this.getStructureList()
    },
    methods: {
      getUserBookList() {
        this.$axios.get('userbook/userBookList?start=&limit=&name=')
          .then(response => {
            console.log(response)
            this.userBooks = response.data.data.list
          }).catch(err => {
          console.log(err)
        })
      },
      getStructureList() {
        this.$axios.get('structure/selectStructureList?structure=' + this.$store.getters.info.role)
          .then(response => {
            console.log(response)
            this.options = response.data.nodeList
          }).catch(err => {
          console.log(err)
        })
      },
      deleteUser_batch() {
        const data = {
          "userId": this.userId_dialog_batch,
          "oldUserId": this.$store.getters.info.role
        }
        this.$axios.post('auth/deleteUserBatch', data)
          .then(() => {
            this.alertMessage('删除成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('删除失败' + err)
        })
        this.dialogVisible_batch = false
      },
      updateUser_batch() {
        const data = {
          "userId": this.userId_dialog_batch,
          "userName": this.userName_dialog_batch === '' ? null : this.userName_dialog_batch,
          "password": this.password_dialog_batch === '' ? null : this.password_dialog_batch,
          "authenticateCode": this.authenticateCode_dialog_batch === '' ? null : this.authenticateCode_dialog_batch,
          "priority": this.priority_dialog_batch === '' ? -1 : this.priority_dialog_batch,
          "type": this.type_dialog_batch === '' ? -1 : this.type_dialog_batch,
          "scanEn": this.scanEn_dialog_batch === '' ? -1 : this.scanEn_dialog_batch,
          "userBook": this.userBook_dialog_batch === '' ? -1 : this.userBook_dialog_batch,
          "gpsInterval": this.gpsInterval_dialog_batch === '' ? -1 : this.gpsInterval_dialog_batch,
          "externalVideoViewEn": this.externalVideoViewEn_dialog_batch === '' ? -1 : this.externalVideoViewEn_dialog_batch,
          "power": this.power_dialog_batch === '' ? -1 : this.power_dialog_batch,
          "oldUserId":this.$store.getters.info.role
        }
        this.$axios.post(`auth/updateUserBatch`, data)
          .then(() => {
            this.alertMessage('修改成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('修改失败' + err)
        })
        this.dialogVisible_batch = false
      },
      addUser_batch() {
        const data = {
          "userId": this.userId_dialog_batch,
          "userName": this.userName_dialog_batch === '' ? null : this.userName_dialog_batch,
          "password": this.password_dialog_batch === '' ? null : this.password_dialog_batch,
          "authenticateCode": this.authenticateCode_dialog_batch === '' ? null : this.authenticateCode_dialog_batch,
          "priority": this.priority_dialog_batch === '' ? -1 : this.priority_dialog_batch,
          "type": this.type_dialog_batch === '' ? -1 : this.type_dialog_batch,
          "scanEn": this.scanEn_dialog_batch === '' ? -1 : this.scanEn_dialog_batch,
          "userBook": this.userBook_dialog_batch === '' ? -1 : this.userBook_dialog_batch,
          "gpsInterval": this.gpsInterval_dialog_batch === '' ? -1 : this.gpsInterval_dialog_batch,
          "externalVideoViewEn": this.externalVideoViewEn_dialog_batch === '' ? -1 : this.externalVideoViewEn_dialog_batch,
          "power": this.power_dialog_batch === '' ? -1 : this.power_dialog_batch
        }
        this.$axios.post(`auth/addUserPatch`, data)
          .then(() => {
            this.alertMessage('添加成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('添加失败' + err)
        })
        this.dialogVisible_batch = false
      },
      deleteUser(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ ID:' + row.userId + '  名称:' + row.userName, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('auth/deleteUser?userId=' + row.userId)
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
      updateUser() {
        const data = {
          "userId": this.userId_dialog,
          "userName": this.userName_dialog,
          "password": this.password_dialog,
          "authenticateCode": this.authenticateCode_dialog,
          "priority": this.priority_dialog,
          "type": this.type_dialog,
          "scanEn": this.scanEn_dialog,
          "userBook": this.userBook_dialog,
          "gpsInterval": this.gpsInterval_dialog,
          "externalVideoViewEn": this.externalVideoViewEn_dialog,
          "power": this.power_dialog,
          "oldUserId": this.oldUserId
        }
        this.$axios.post(`auth/updateUser`, data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      addUser() {
        const data = {
          "userId": this.userId_dialog,
          "userName": this.userName_dialog,
          "password": this.password_dialog,
          "authenticateCode": this.authenticateCode_dialog,
          "priority": this.priority_dialog,
          "type": this.type_dialog,
          "scanEn": this.scanEn_dialog,
          "userBook": this.userBook_dialog,
          "gpsInterval": this.gpsInterval_dialog,
          "externalVideoViewEn": this.externalVideoViewEn_dialog,
          "power": this.power_dialog
        }
        this.$axios.post(`auth/addUser`, data)
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
        } else if (tempIds.indexOf(",") == -1 && tempIds.indexOf("-") == -1) {
          this.alertMessage('未识别到,或-符号')
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
      checkUserId() {
        this.$axios.get('auth/checkUserId?userId=' + this.userId_dialog)
          .then(response => {
            console.log(response)
            if (response.data.data && this.userId_dialog !== this.oldUserId) {
              //存在相同userId
              this.checkStatus = true
              this.alertMessage('用户ID已存在')
            } else if (this.userId_dialog === '') {
              //输入用户为空
              this.checkStatus = true
              this.alertMessage('用户ID不能为空')
            } else {
              this.checkStatus = false
            }
          }).catch(err => {
          console.log(err)
        })
      },
      showUpdateDialog(index, row) {
        console.log(row)
        this.dialogTitle = '修改用户'
        this.userId_dialog = row.userId
        this.userName_dialog = row.userName
        this.password_dialog = row.password
        this.authenticateCode_dialog = row.authenticateCode
        this.priority_dialog = row.priority
        this.type_dialog = row.type
        this.scanEn_dialog = row.scanEn
        this.userBook_dialog = row.userBook
        this.gpsInterval_dialog = row.gpsInterval
        this.externalVideoViewEn_dialog = row.externalVideoViewEn
        this.power_dialog = row.power
        this.oldUserId = row.userId
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      showAddDialog() {
        this.dialogTitle = '添加用户'
        this.userId_dialog = ''
        this.userName_dialog = ''
        this.password_dialog = ''
        this.authenticateCode_dialog = ''
        this.priority_dialog = ''
        this.type_dialog = ''
        this.scanEn_dialog = ''
        this.userBook_dialog = ''
        this.gpsInterval_dialog = ''
        this.externalVideoViewEn_dialog = ''
        this.power_dialog = this.$store.getters.info.role
        this.addBtnStatus = true
        this.updateBtnStatus = false
        this.dialogVisible = true
        this.checkStatus = true
      },
      showDialog_batch() {
        this.dialogTitle_batch = '批量操作'
        this.userId_dialog_batch = ''
        this.userName_dialog_batch = ''
        this.password_dialog_batch = ''
        this.authenticateCode_dialog_batch = ''
        this.priority_dialog_batch = ''
        this.type_dialog_batch = ''
        this.scanEn_dialog_batch = ''
        this.userBook_dialog_batch = ''
        this.gpsInterval_dialog_batch = ''
        this.externalVideoViewEn_dialog_batch = ''
        this.power_dialog_batch = this.$store.getters.info.role
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
        this.$axios.get('auth/userList?start=' + start + '&limit=' + limit + '&userId=' + this.userId + '&userName=' + this.userName + '&power=' + this.power + '&structure=' + this.$store.getters.info.role)
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
