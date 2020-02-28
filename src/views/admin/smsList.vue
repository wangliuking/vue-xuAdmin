<template>
  <div>
    <el-input
      type="text"
      placeholder="请输入源ID"
      maxlength="30"
      show-word-limit
      v-model="srcId"
      class="searchInput"
    >
    </el-input>
    <el-input
      type="text"
      placeholder="请输入目标ID"
      maxlength="30"
      show-word-limit
      v-model="tarId"
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
        <el-table-column
          prop="srcId"
          label="源ID">
        </el-table-column>
        <el-table-column
          prop="tarId"
          label="目标ID">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">
              单呼
            </span>
            <span v-if="scope.row.type !== 1">
              组呼
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容">
        </el-table-column>
        <el-table-column
          prop="sendTime"
          label="发送时间">
        </el-table-column>
        <el-table-column
          prop="callId"
          label="短信会议ID">
        </el-table-column>
        <el-table-column
          prop="status"
          label="发送状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color: green;">
              成功
            </span>
            <span v-if="scope.row.status !== 0" style="color: red;">
              失败
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteSms(scope.$index, scope.row)">删除
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
    name: 'smsList',
    data() {
      return {
        srcId: '',
        tarId: '',
        time: '',
        list: [],
        total: 0,     //数据总条数
        page: 1,    //默认显示第1页
        limit: 10   //默认一次显示10条数据
      }
    },
    mounted() {
      this.searchList()
    },
    methods: {
      deleteSms(index, row) {
        console.log(index, row)
        this.$confirm('是否确认删除该条记录？ ID:' + row.id, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('sms/deleteSms?id=' + row.id)
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
        this.$axios.get('sms/smsList?start=' + start + '&limit=' + limit + '&srcId=' + this.srcId + '&tarId=' + this.tarId + '&startTime=' + timeArr[0] + '&endTime=' + timeArr[1] + '&structure=' + this.$store.getters.info.role)
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
        this.srcId = ''
        this.tarId = ''
        this.time = ''
        this.searchList()
      },
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
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
