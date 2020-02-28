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
    <el-select v-model="type" filterable placeholder="请选择组类型">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
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
          prop="groupId"
          label="组ID">
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="组名">
        </el-table-column>
        <el-table-column
          prop="type"
          label="组类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">
              普通组
            </span>
            <span v-if="scope.row.type === 2">
              外部组
            </span>
            <span v-if="scope.row.type === 3">
              临时组
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pttSilentTime"
          label="PTT静默时长">
        </el-table-column>
        <el-table-column
          prop="callTime"
          label="一次呼叫总得通话时间限定">
        </el-table-column>
        <el-table-column
          prop="pttOnTime"
          label="单次PTT授权最长时间">
        </el-table-column>
        <el-table-column
          prop="powerName"
          label="组织结构">
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
              @click="deleteGroup(scope.$index, scope.row)">删除
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
          <span>组ID：</span>
          <el-input
            type="text"
            placeholder="请输入组ID"
            maxlength="30"
            show-word-limit
            v-model="groupId_dialog"
            class="dialogInput"
            @focus="checkStatus = true"
            @blur="checkGroupId"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>组名称：</span>
          <el-input
            type="text"
            placeholder="请输入组名"
            maxlength="50"
            show-word-limit
            v-model="groupName_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>PTT静默时长：</span>
          <el-input
            type="number"
            placeholder="请输入PTT静默时长(数字)"
            v-model="pttSilentTime_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>一次呼叫总得通话时间限定：</span>
          <el-input
            type="number"
            placeholder="一次呼叫总得通话时间限定(数字)"
            v-model="callTime_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span>单次PTT授权最长时间：</span>
          <el-input
            type="number"
            placeholder="单次PTT授权最长时间(数字)"
            v-model="pttOnTime_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <span>组类型：</span>
          <el-select v-model="type_dialog" filterable placeholder="请选择组类型">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <span>组织结构：</span>
          <el-select v-model="power_dialog" filterable placeholder="请选择组织结构">
            <el-option
              v-for="item in structures"
              :key="item.id"
              :label="item.fullName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="addGroup" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateGroup" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle_batch"
      :visible.sync="dialogVisible_batch"
      width="30%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span>组ID范围（支持,或-进行分割）：</span>
          <el-input
            type="text"
            placeholder="请输入组ID"
            maxlength="30"
            show-word-limit
            v-model="groupId_dialog_batch"
            class="dialogInput"
            @focus="checkStatus_batch = true"
            @blur="checkGroupId_batch"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>组名称：</span>
          <el-input
            type="text"
            placeholder="请输入组名"
            maxlength="50"
            show-word-limit
            v-model="groupName_dialog_batch"
            class="dialogInput"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>PTT静默时长：</span>
          <el-input
            type="number"
            placeholder="请输入PTT静默时长(数字)"
            v-model="pttSilentTime_dialog_batch"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>一次呼叫总得通话时间限定：</span>
          <el-input
            type="number"
            placeholder="一次呼叫总得通话时间限定(数字)"
            v-model="callTime_dialog_batch"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <span>单次PTT授权最长时间：</span>
          <el-input
            type="number"
            placeholder="单次PTT授权最长时间(数字)"
            v-model="pttOnTime_dialog_batch"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>组类型：</span>
          <el-select v-model="type_dialog_batch" filterable placeholder="请选择组类型">
            <el-option
              v-for="item in options"
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
              v-for="item in structures"
              :key="item.id"
              :label="item.fullName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible_batch = false">取 消</el-button>
    <el-button type="primary" @click="addGroup_batch" :disabled="checkStatus_batch">批量创建</el-button>
    <el-button type="primary" @click="updateGroup_batch" :disabled="checkStatus_batch">批量修改</el-button>
    <el-button type="primary" @click="deleteGroup_batch" :disabled="checkStatus_batch">批量删除</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/views/admin/Pagination'
  import Cookies from 'js-cookie'

  export default {
    name: 'groupList',
    data() {
      return {
        groupId: '',
        groupName: '',
        type: '',
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10,   //默认一次显示10条数据
        dialogVisible: false,
        dialogTitle: '',
        groupId_dialog: '',
        groupName_dialog: '',
        type_dialog: '',
        pttSilentTime_dialog: '',
        callTime_dialog: '',
        pttOnTime_dialog: '',
        options: [{
          id: 1,
          name: '普通组'
        }, {
          id: 2,
          name: '外部组'
        }, {
          id: 3,
          name: '临时组'
        }],
        structures: [],
        power_dialog: '',
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true,
        oldGroupId: '',

        dialogVisible_batch: false,
        dialogTitle_batch: '',
        groupId_dialog_batch: '',
        groupName_dialog_batch: '',
        type_dialog_batch: '',
        pttSilentTime_dialog_batch: '',
        callTime_dialog_batch: '',
        pttOnTime_dialog_batch: '',
        power_dialog_batch: '',
        checkStatus_batch: true
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
            this.structures = response.data.nodeList
          }).catch(err => {
          console.log(err)
        })
      },
      deleteGroup_batch() {
        const data = {
          "groupId": this.groupId_dialog_batch,
          "oldGroupId": this.$store.getters.info.role
        }
        this.$axios.post(`group/deleteGroupBatch`, data)
          .then(() => {
            this.alertMessage('删除成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('删除失败' + err)
        })
        this.dialogVisible_batch = false
      },
      updateGroup_batch() {
        const data = {
          "groupId": this.groupId_dialog_batch,
          "groupName": this.groupName_dialog_batch === '' ? null : this.groupName_dialog_batch,
          "type": this.type_dialog_batch === '' ? -1 : this.type_dialog_batch,
          "pttSilentTime": this.pttSilentTime_dialog_batch === '' ? -1 : this.pttSilentTime_dialog_batch,
          "callTime": this.callTime_dialog_batch === '' ? -1 : this.callTime_dialog_batch,
          "pttOnTime": this.pttOnTime_dialog_batch === '' ? -1 : this.pttOnTime_dialog_batch,
          "power": this.power_dialog_batch === '' ? -1 : this.power_dialog_batch,
          "oldGroupId": this.$store.getters.info.role
        }
        this.$axios.post(`group/updateGroupBatch`, data)
          .then(() => {
            this.alertMessage('修改成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('修改失败' + err)
        })
        this.dialogVisible_batch = false
      },
      addGroup_batch() {
        const data = {
          "groupId": this.groupId_dialog_batch,
          "groupName": this.groupName_dialog_batch === '' ? null : this.groupName_dialog_batch,
          "type": this.type_dialog_batch === '' ? -1 : this.type_dialog_batch,
          "pttSilentTime": this.pttSilentTime_dialog_batch === '' ? -1 : this.pttSilentTime_dialog_batch,
          "callTime": this.callTime_dialog_batch === '' ? -1 : this.callTime_dialog_batch,
          "pttOnTime": this.pttOnTime_dialog_batch === '' ? -1 : this.pttOnTime_dialog_batch,
          "power": this.power_dialog_batch === '' ? -1 : this.power_dialog_batch
        }
        this.$axios.post(`group/addGroupPatch`, data)
          .then(() => {
            this.alertMessage('添加成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('添加失败' + err)
        })
        this.dialogVisible_batch = false
      },
      deleteGroup(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ ID:' + row.groupId + '  组名:' + row.groupName, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('group/deleteGroup?groupId=' + row.groupId)
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
      updateGroup() {
        const data = {
          "groupId": this.groupId_dialog,
          "groupName": this.groupName_dialog,
          "type": this.type_dialog,
          "pttSilentTime": this.pttSilentTime_dialog,
          "callTime": this.callTime_dialog,
          "pttOnTime": this.pttOnTime_dialog,
          "power": this.power_dialog,
          "oldGroupId": this.oldGroupId
        }
        this.$axios.post(`group/updateGroup`, data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      addGroup() {
        const data = {
          "groupId": this.groupId_dialog,
          "groupName": this.groupName_dialog,
          "type": this.type_dialog,
          "pttSilentTime": this.pttSilentTime_dialog,
          "callTime": this.callTime_dialog,
          "pttOnTime": this.pttOnTime_dialog,
          "power": this.power_dialog
        }
        this.$axios.post(`group/addGroup`, data)
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
      checkGroupId_batch() {
        const tempIds = this.groupId_dialog_batch
        const regPos = /^\d+(\.\d+)?$/
        if (tempIds === null || tempIds === '') {
          this.alertMessage('组ID不能为空')
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
            this.alertMessage('批量组数量大于1000，请缩小范围')
          } else {
            this.checkStatus_batch = false
          }
        }
      },
      checkGroupId() {
        this.$axios.get('group/checkGroupId?groupId=' + this.groupId_dialog)
          .then(response => {
            console.log(response)
            if (response.data.data && this.groupId_dialog !== this.oldGroupId) {
              //存在相同groupId
              this.checkStatus = true
              this.alertMessage('组ID已存在')
            } else if (this.groupId_dialog === '') {
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
        this.dialogTitle = '修改组'
        this.groupId_dialog = row.groupId
        this.groupName_dialog = row.groupName
        this.type_dialog = row.type
        this.pttSilentTime_dialog = row.pttSilentTime
        this.callTime_dialog = row.callTime
        this.pttOnTime_dialog = row.pttOnTime
        this.power_dialog = row.power
        this.oldGroupId = row.groupId
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      showAddDialog() {
        this.dialogTitle = '添加组'
        this.groupId_dialog = ''
        this.groupName_dialog = ''
        this.type_dialog = ''
        this.pttSilentTime_dialog = ''
        this.callTime_dialog = ''
        this.pttOnTime_dialog = ''
        this.power_dialog = this.$store.getters.info.role
        this.addBtnStatus = true
        this.updateBtnStatus = false
        this.dialogVisible = true
        this.checkStatus = true
      },
      showDialog_batch() {
        this.dialogTitle_batch = '批量操作'
        this.groupId_dialog_batch = ''
        this.groupName_dialog_batch = ''
        this.type_dialog_batch = ''
        this.pttSilentTime_dialog_batch = ''
        this.callTime_dialog_batch = ''
        this.pttOnTime_dialog_batch = ''
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
        this.$axios.get('group/groupList?start=' + start + '&limit=' + limit + '&groupId=' + this.groupId + '&groupName=' + this.groupName + '&type=' + this.type + '&structure=' + this.$store.getters.info.role)
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
        this.groupId = ''
        this.groupName = ''
        this.type = ''
        this.searchList()
      },
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      formatter(row, column) {
        return row.groupName
      },
      filterTag(value, row) {
        return row.type === value
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
