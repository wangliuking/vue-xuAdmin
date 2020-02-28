<template>
  <div>
    <el-row>
      <el-input
        type="text"
        placeholder="请输入通讯录名称"
        maxlength="50"
        show-word-limit
        v-model="name"
        class="searchInput"
      >
      </el-input>
      <el-button type="success" class="searchBtn" :loading="false" @click="searchList">查 询</el-button>
      <el-button type="warning" @click="clearInput">清 空</el-button>
      <el-button type="danger" @click="showAddDialog">创 建</el-button>
    </el-row>

    <el-row>
      <el-col :span="8" v-for="(item,index) in list" :key="index" style="margin-bottom: 20px;">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{item.name}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="showUpdateDialog(item)">编辑</el-button>
            <el-button style="float: right; padding: 3px 0" type="text" @click="deleteUserBook(item)">删除</el-button>
          </div>
          <div class="text item">
            <el-table
              height="300"
              :data="item.userBookDetail"
              style="width: 100%">
              <el-table-column
                prop="userId"
                label="用户Id"
                width="180">
              </el-table-column>
              <el-table-column
                prop="userName"
                label="名称"
                width="180">
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="changeList"/>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="请输入通讯录id"
            maxlength="30"
            show-word-limit
            v-model="id_dialog"
            class="dialogInput"
            @focus="checkStatus = true"
            @blur="checkWord"
            v-show="bookIdDialog"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="请输入通讯录名称"
            maxlength="30"
            show-word-limit
            v-model="name_dialog"
            class="dialogInput"
          ></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入用户id"
          :titles="titles"
          v-model="value"
          :data="data">
        </el-transfer>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="add" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="update" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/views/admin/Pagination'
  import Cookies from 'js-cookie'

  export default {
    name: 'userBookList',
    watch: {},
    data() {
      return {
        name: '',
        titles: ['未添加用户', '已添加用户'],
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10,   //默认一次显示10条数据
        dialogVisible: false,
        dialogTitle: '',
        id_dialog: '',
        name_dialog: '',
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true,
        bookIdDialog: true,
        data: [],
        value: [],
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        }
      }
    },
    mounted() {
      this.searchList()
      this.getUserIdList()
    },
    methods: {
      getUserIdList() {
        this.$axios.get('auth/userList?start=&limit=&userId=&userName=&power=&structure=1')
          .then(response => {
            const data = [];
            response.data.data.list.forEach((item, index) => {
              data.push({
                label: item.userId,
                key: index
              })
            })
            this.data = data
          }).catch(err => {
          console.log(err)
        })
      },
      deleteUserBook(item) {
        this.$confirm('是否确认删除该通讯录？ id:' + item.id + ' 名称:' + item.name, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('userbook/deleteUserBook?id=' + item.id)
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
      update() {
        if (this.name_dialog === '') {
          this.alertMessage('通讯录名称不能为空')
          return
        }
        if (this.value.length === 0) {
          this.alertMessage('未选择任何用户')
          return
        }

        const userList = []
        this.data.forEach(item => {
          const label = item.label
          const key = item.key
          this.value.forEach(val => {
            if (val === key) {
              userList.push(label)
            }
          })
        })
        const data = {
          "id": this.id_dialog,
          "name": this.name_dialog,
          "userList": userList
        }
        this.$axios.post('userbook/updateUserBook', data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      add() {
        if (this.name_dialog === '') {
          this.alertMessage('通讯录名称不能为空')
          return
        }
        if (this.value.length === 0) {
          this.alertMessage('未选择任何用户')
          return
        }

        const userList = []
        this.data.forEach(item => {
          const label = item.label
          const key = item.key
          this.value.forEach(val => {
            if (val === key) {
              userList.push(label)
            }
          })
        })
        const data = {
          "id": this.id_dialog,
          "name": this.name_dialog,
          "userList": userList
        }
        this.$axios.post('userbook/addUserBook', data)
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
      checkWord() {
        if (this.id_dialog === '') {
          this.checkStatus = true
          this.alertMessage('通讯录ID不能为空')
          return
        }
        this.$axios.get('userbook/checkId?id=' + this.id_dialog)
          .then(response => {
            console.log(response)
            if (response.data.data) {
              this.checkStatus = true
              this.alertMessage('通讯录ID已存在')
            } else {
              this.checkStatus = false
            }
          }).catch(err => {
          console.log(err)
        })
      },
      showUpdateDialog(item) {
        this.dialogTitle = '修改通讯录'
        this.bookIdDialog = false
        this.id_dialog = item.id
        this.name_dialog = item.name
        const userBookDetail = item.userBookDetail
        const tempValue = []
        this.data.forEach(item => {
          const label = item.label
          const key = item.key
          userBookDetail.forEach(param => {
            if (param.userId === label) {
              tempValue.push(key)
            }
          })
        })
        this.value = tempValue
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      showAddDialog() {
        this.dialogTitle = '添加通讯录'
        this.bookIdDialog = true
        this.name_dialog = ''
        this.value = []
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
        this.$axios.get('userbook/userBookList?start=' + start + '&limit=' + limit + '&name=' + this.name)
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
        this.name = ''
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
    width: 20%;
    margin: 10px 0px 10px 0px
  }

  .searchBtn {
    margin-left: 10px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
    height: 400px;
  }

  .pagination-container {
    background: none !important;
  }
</style>
