<template>
  <div>
    <el-input
      type="text"
      placeholder="请输入局向ID"
      maxlength="30"
      show-word-limit
      v-model="bdId"
      class="searchInput"
    >
    </el-input>
    <el-input
      type="text"
      placeholder="请输入局向名"
      maxlength="30"
      show-word-limit
      v-model="bdName"
      class="searchInput"
    >
    </el-input>
    <el-input
      type="text"
      placeholder="请输入局向IP"
      maxlength="30"
      show-word-limit
      v-model="address"
      class="searchInput"
    ></el-input>
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
          prop="bdId"
          label="局向码">
        </el-table-column>
        <el-table-column
          prop="address"
          label="局向IP地址">
        </el-table-column>
        <el-table-column
          prop="csPort"
          label="局向信令端口">
        </el-table-column>
        <el-table-column
          prop="voicePort"
          label="局向语音端口">
        </el-table-column>
        <el-table-column
          prop="bdName"
          label="局向名">
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
              @click="deleteBD(scope.$index, scope.row)">删除
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
            type="text"
            placeholder="请输入局向ID"
            maxlength="30"
            show-word-limit
            v-model="bdId_dialog"
            class="dialogInput"
            @focus="checkStatus = true"
            @blur="checkBdId"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="请输入局向IP地址"
            maxlength="30"
            show-word-limit
            v-model="address_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="请输入局向信令端口(数字)"
            v-model="csPort_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="局向语音端口(数字)"
            v-model="voicePort_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="请输入局向名"
            maxlength="30"
            show-word-limit
            v-model="bdName_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="addBD" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateBD" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/views/admin/Pagination'
  import Cookies from 'js-cookie'

  export default {
    name: 'bdList',
    data() {
      return {
        bdId: '',
        bdName: '',
        address: '',
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10,   //默认一次显示10条数据
        dialogVisible: false,
        dialogTitle: '',
        bdId_dialog: '',
        bdName_dialog: '',
        address_dialog: '',
        csPort_dialog: '',
        voicePort_dialog: '',
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true,
        oldBdId: ''
      }
    },
    mounted() {
      this.searchList()
    },
    methods: {
      deleteBD(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ ID:' + row.bdId + '  局向名:' + row.bdName, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('bd/deleteBD?bdId=' + row.bdId)
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
      updateBD() {
        const data = {
          "bdId": this.bdId_dialog,
          "bdName": this.bdName_dialog,
          "address": this.address_dialog,
          "csPort": this.csPort_dialog,
          "voicePort": this.voicePort_dialog,
          "oldBdId": this.oldBdId
        }
        this.$axios.post('bd/updateBD', data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      addBD() {
        const data = {
          "bdId": this.bdId_dialog,
          "bdName": this.bdName_dialog,
          "address": this.address_dialog,
          "csPort": this.csPort_dialog,
          "voicePort": this.voicePort_dialog
        }
        this.$axios.post('bd/addBD', data)
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
      checkBdId() {
        this.$axios.get('bd/checkBdId?bdId=' + this.bdId_dialog)
          .then(response => {
            console.log(response)
            if (response.data.data && this.bdId_dialog !== this.oldBdId) {
              //存在相同bdId
              this.checkStatus = true
              this.alertMessage('局向码已存在')
            } else if (this.bdId_dialog === '') {
              //输入用户为空
              this.checkStatus = true
              this.alertMessage('局向码不能为空')
            } else {
              this.checkStatus = false
            }
          }).catch(err => {
          console.log(err)
        })
      },
      showUpdateDialog(index, row) {
        console.log(row)
        this.dialogTitle = '修改局向'
        this.bdId_dialog = row.bdId
        this.bdName_dialog = row.bdName
        this.address_dialog = row.address
        this.csPort_dialog = row.csPort
        this.voicePort_dialog = row.voicePort
        this.oldBdId = row.bdId
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      showAddDialog() {
        this.dialogTitle = '添加局向'
        this.bdId_dialog = ''
        this.bdName_dialog = ''
        this.address_dialog = ''
        this.csPort_dialog = ''
        this.voicePort_dialog = ''
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
        this.$axios.get('bd/bdList?start=' + start + '&limit=' + limit + '&bdId=' + this.bdId + '&bdName=' + this.bdName + '&address=' + this.address)
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
        this.bdId = ''
        this.bdName = ''
        this.address = ''
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
