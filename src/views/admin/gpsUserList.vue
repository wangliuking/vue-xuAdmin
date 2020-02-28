<template>
  <div>
    <el-input
      type="number"
      placeholder="请输入GPS用户Id(数字)"
      v-model="gpsUserId"
      class="searchInput"
      oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
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
          prop="gpsUserId"
          label="GPS用户Id">
        </el-table-column>
        <el-table-column
          prop="gpsUserPassword"
          label="GPS用户密码">
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
              @click="deleteGpsUser(scope.$index, scope.row)">删除
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
          <el-input
            type="number"
            placeholder="请输入GPS用户Id(数字)"
            v-model="gpsUserId_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
            @focus="checkStatus = true"
            @blur="checkGpsUserId"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="请输入GPS用户密码"
            maxlength="50"
            show-word-limit
            v-model="gpsUserPassword_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="addGpsUser" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateGpsUser" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/views/admin/Pagination'
  import Cookies from 'js-cookie'

  export default {
    name: 'gpsUserList',
    data() {
      return {
        gpsUserId: '',
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10,   //默认一次显示10条数据
        dialogVisible: false,
        dialogTitle: '',
        gpsUserId_dialog: '',
        gpsUserPassword_dialog: '',
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true,
        oldGpsUserId: ''
      }
    },
    mounted() {
      this.searchList()
    },
    methods: {
      deleteGpsUser(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ ID:' + row.gpsUserId , '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('gpsuser/deleteGpsUser?gpsUserId=' + row.gpsUserId)
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
      updateGpsUser() {
        const data = {
          "gpsUserId": this.gpsUserId_dialog,
          "gpsUserPassword": this.gpsUserPassword_dialog,
          "oldGpsUserId": this.oldGpsUserId
        }
        this.$axios.post('gpsuser/updateGpsUser', data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      addGpsUser() {
        const data = {
          "gpsUserId": this.gpsUserId_dialog,
          "gpsUserPassword": this.gpsUserPassword_dialog
        }
        this.$axios.post('gpsuser/addGpsUser', data)
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
      checkGpsUserId() {
        this.$axios.get('gpsuser/checkGpsUserId?gpsUserId=' + this.gpsUserId_dialog)
          .then(response => {
            console.log(response)
            if (response.data.data && this.gpsUserId_dialog !== this.oldGpsUserId) {
              //存在相同gpsUserId
              this.checkStatus = true
              this.alertMessage('GPS用户Id已存在')
            } else if (this.gpsUserId_dialog === '') {
              //输入用户为空
              this.checkStatus = true
              this.alertMessage('组ID不能为空')
            } else {
              this.checkStatus = false
            }
          }).catch(err => {
          console.log(err)
        })
      },
      showUpdateDialog(index, row) {
        console.log(row)
        this.dialogTitle = '修改GPS用户'
        this.gpsUserId_dialog = row.gpsUserId
        this.gpsUserPassword_dialog = row.gpsUserPassword
        this.oldGpsUserId = row.gpsUserId
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      showAddDialog() {
        this.dialogTitle = '添加GPS用户'
        this.gpsUserId_dialog = ''
        this.gpsUserPassword_dialog = ''
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
        this.$axios.get('gpsuser/gpsUserList?start=' + start + '&limit=' + limit + '&gpsUserId=' + this.gpsUserId)
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
        this.gpsUserId = ''
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
