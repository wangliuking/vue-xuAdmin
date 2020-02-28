<template>
  <div>
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
    <el-input
      type="text"
      placeholder="请输入局向码"
      maxlength="30"
      show-word-limit
      v-model="bdId"
      class="searchInput"
    >
    </el-input>
    <el-input
      type="text"
      placeholder="请输入局向名称"
      maxlength="50"
      show-word-limit
      v-model="bdName"
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
          prop="groupId"
          label="组ID">
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="组名">
        </el-table-column>
        <el-table-column
          prop="bdId"
          label="局向码">
        </el-table-column>
        <el-table-column
          prop="bdName"
          label="局向名称">
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
              @click="deleteGroup2BD(scope.$index, scope.row)">删除
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
          <el-select v-model="groupId_dialog" @change="checkGroup2BD" filterable placeholder="请选择组">
            <el-option
              v-for="item in groupIdList"
              :key="item.groupId"
              :label="item.groupId+' '+item.groupName"
              :value="item.groupId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-select v-model="bdId_dialog" @change="checkGroup2BD" filterable placeholder="请选择局向">
            <el-option
              v-for="item in bdIdList"
              :key="item.bdId"
              :label="item.bdId+' '+item.bdName"
              :value="item.bdId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="addGroup2BD" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateGroup2BD" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/views/admin/Pagination'
  import Cookies from 'js-cookie'

  export default {
    name: 'group2bdList',
    data() {
      return {
        bdId: '',
        bdName: '',
        groupId: '',
        groupName: '',
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10,   //默认一次显示10条数据
        dialogVisible: false,
        dialogTitle: '',
        bdId_dialog: '',
        groupId_dialog: '',
        bdIdList: [],
        groupIdList: [],
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true,
        oldBdId: '',
        oldGroupId: ''
      }
    },
    mounted() {
      this.searchList()
      this.getBdIdList()
      this.getGroupIdList()
    },
    methods: {
      getBdIdList() {
        this.$axios.get('bd/bdList?start=&limit=&bdId=&bdName=&address=')
          .then(response => {
            this.bdIdList = response.data.data.list
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
      deleteGroup2BD(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ 组Id:' + row.groupId + '  局向码:' + row.bdId, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('group2bd/deleteGroup2BD?bdId=' + row.bdId + '&groupId=' + row.groupId)
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
      updateGroup2BD() {
        const data = {
          "bdId": this.bdId_dialog,
          "groupId": this.groupId_dialog,
          "oldBdId": this.oldBdId,
          "oldGroupId": this.oldGroupId
        }
        this.$axios.post('group2bd/updateGroup2BD', data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      addGroup2BD() {
        const data = {
          "bdId": this.bdId_dialog,
          "groupId": this.groupId_dialog
        }
        this.$axios.post('group2bd/addGroup2BD', data)
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
      checkGroup2BD() {
        console.log("准备检索")
        if (this.bdId_dialog === this.oldBdId && this.groupId_dialog === this.oldGroupId) {
          return
        }
        if (this.bdId_dialog === '' || this.groupId_dialog === '') {
          this.checkStatus = true
          this.alertMessage('请选择组id或局向码')
          return
        }
        this.$axios.get('group2bd/checkGroup2BD?bdId=' + this.bdId_dialog + '&groupId=' + this.groupId_dialog)
          .then(response => {
            console.log(response)
            if (response.data.data) {
              //存在相同bdId
              this.checkStatus = true
              this.alertMessage('该组和局向关联已存在')
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
        this.bdId_dialog = row.bdId
        this.groupId_dialog = row.groupId
        this.oldBdId = row.bdId
        this.oldGroupId = row.groupId
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      showAddDialog() {
        this.dialogTitle = '添加关联'
        this.bdId_dialog = ''
        this.groupId_dialog = ''
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
        this.$axios.get('group2bd/group2bdList?start=' + start + '&limit=' + limit + '&bdId=' + this.bdId + '&bdName=' + this.bdName + '&groupId=' + this.groupId + '&groupName=' + this.groupName)
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
