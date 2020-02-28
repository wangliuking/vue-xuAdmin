<template>
  <div>
    <el-input
      type="text"
      placeholder="请输入主叫ID"
      maxlength="30"
      show-word-limit
      v-model="callingId"
      class="searchInput"
    >
    </el-input>
    <el-input
      type="text"
      placeholder="请输入被叫ID"
      maxlength="30"
      show-word-limit
      v-model="calledId"
      class="searchInput"
    >
    </el-input>
    <el-date-picker
      v-model="time"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button type="success" class="searchBtn" :loading="false" @click="searchList">查 询</el-button>
    <el-button type="warning" @click="clearInput">清 空</el-button>
    <template>
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <!--<el-table-column
          prop="callId"
          label="呼叫会议ID">
        </el-table-column>-->
        <el-table-column
          prop="callingId"
          label="主叫ID">
        </el-table-column>
        <el-table-column
          prop="calledId"
          label="被叫ID">
        </el-table-column>
        <el-table-column
          prop="pttId"
          label="PTT ID">
        </el-table-column>
        <el-table-column
          prop="callStatus"
          label="呼叫状态">
          <template slot-scope="scope">
            <span v-if="scope.row.callStatus === 0" style="color: green;">
              成功
            </span>
            <span v-if="scope.row.callStatus !== 0" style="color: red;">
              失败
            </span>
          </template>
        </el-table-column>
        <!--<el-table-column
          prop="callType"
          label="呼叫类型">
        </el-table-column>-->
        <el-table-column
          prop="startTime"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间">
        </el-table-column>
        <!--<el-table-column
          prop="endReason"
          label="结束原因">
        </el-table-column>-->
        <el-table-column
          prop="filePath"
          label="播放" width="320px">
          <template slot-scope="scope">
            <audio ref="audio" :src="prefix+scope.row.filePath.substring(37,scope.row.filePath.length)"
                   controls></audio>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteCallInfo(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="changeList"/>
  </div>
</template>

<script>
  import Pagination from '@/views/admin/Pagination'
  import Cookies from 'js-cookie'

  export default {
    name: 'callInfoList',
    data() {
      return {
        callingId: '',
        calledId: '',
        time: '',
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10,   //默认一次显示10条数据
        prefix: 'http://47.108.93.159:50006'
      }
    },
    mounted() {
      this.searchList()
    },
    methods: {
      deleteCallInfo(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ ID:' + row.id, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('callInfo/deleteCallInfo?id=' + row.id)
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
      alertMessage(message) {
        const h = this.$createElement
        this.$message({
          message: h('p', null, [
            h('span', {style: 'color: teal'}, message)
          ])
        })
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
        const time = this.time + ''
        const timeArr = time.split(",")
        this.$axios.get('callInfo/callInfoList?start=' + start + '&limit=' + limit + '&callingId=' + this.callingId + '&calledId=' + this.calledId + '&startTime=' + timeArr[0] + '&endTime=' + timeArr[1] + '&structure=' + this.$store.getters.info.role)
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
        this.callingId = ''
        this.calledId = ''
        this.time = ''
        this.searchList()
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
