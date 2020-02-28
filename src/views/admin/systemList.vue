<template>
  <div>
    <template>
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="callTime"
          label="呼叫通话时长">
        </el-table-column>
        <el-table-column
          prop="pttOnTime"
          label="ptt on 时长">
        </el-table-column>
        <el-table-column
          prop="pttSilentTime"
          label="ptt静默时长">
        </el-table-column>
        <el-table-column
          prop="gpsReportInterval"
          label="GPS上报时间间隔">
        </el-table-column>
        <el-table-column
          prop="appHeartInterval"
          label="APP用户心跳时间间隔">
        </el-table-column>
        <el-table-column
          prop="audioHeartInterval"
          label="语音传输通道建立后心跳间隔">
        </el-table-column>
        <el-table-column
          prop="tcpListenPort"
          label="TCP监听端口">
        </el-table-column>
        <el-table-column
          prop="appVoicePort"
          label="语音端口">
        </el-table-column>
        <el-table-column
          prop="bdId"
          label="本地局向码">
        </el-table-column>
        <el-table-column
          prop="bdListenPort"
          label="本地局监听端口">
        </el-table-column>
        <el-table-column
          prop="bdVoicePort"
          label="本地局语音端口">
        </el-table-column>
        <el-table-column
          prop="gpsServerPort"
          label="GPS服务端口">
        </el-table-column>
        <el-table-column
          prop="dbSynPort"
          label="数据库同步端口">
        </el-table-column>
        <el-table-column
          prop="videoRecPath"
          label="视频存储路径">
        </el-table-column>
        <el-table-column
          prop="wavRecPath"
          label="录音存储路径">
        </el-table-column>
        <el-table-column
          prop="videoUrlPrefix"
          label="视频流前缀">
        </el-table-column>
        <el-table-column
          prop="vAGWAddress"
          label="视频网关IP地址">
        </el-table-column>
        <el-table-column
          prop="vAGWPort"
          label="视频网关监听端口">
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
              @click="deleteSystem(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="呼叫通话时长"
            v-model="callTime_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="PTT on 时长"
            v-model="pttOnTime_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="ptt静默时长"
            v-model="pttSilentTime_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="GPS上报时间间隔"
            v-model="gpsReportInterval_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="APP用户心跳时间间隔"
            v-model="appHeartInterval_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="语音传输建立后心跳间隔"
            v-model="audioHeartInterval_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="TCP监听端口"
            v-model="tcpListenPort_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="语音端口"
            v-model="appVoicePort_dialog"
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
            placeholder="本地局向码"
            maxlength="30"
            show-word-limit
            v-model="bdId_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="本地局监听端口"
            v-model="bdListenPort_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="本地局语音端口"
            v-model="bdVoicePort_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="GPS服务端口"
            v-model="gpsServerPort_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="数据库同步端口"
            v-model="dbSynPort_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="视频存储路径"
            maxlength="256"
            show-word-limit
            v-model="videoRecPath_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="录音存储路径"
            maxlength="256"
            show-word-limit
            v-model="wavRecPath_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="视频流前缀"
            maxlength="256"
            show-word-limit
            v-model="videoUrlPrefix_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input
            type="text"
            placeholder="视频网关IP地址"
            maxlength="40"
            show-word-limit
            v-model="vAGWAddress_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            type="number"
            placeholder="视频网关监听端口"
            v-model="vAGWPort_dialog"
            class="dialogInput"
            oninput="if(value.length>11)value=value.slice(0,11);if(value<0)value=0"
          >
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateSystem" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    name: 'systemList',
    data() {
      return {
        list: [],
        dialogVisible: false,
        dialogTitle: '',
        id: '',
        callTime_dialog: '',
        pttOnTime_dialog: '',
        pttSilentTime_dialog: '',
        gpsReportInterval_dialog: '',
        appHeartInterval_dialog: '',
        audioHeartInterval_dialog: '',
        tcpListenPort_dialog: '',
        appVoicePort_dialog: '',
        bdId_dialog: '',
        bdListenPort_dialog: '',
        bdVoicePort_dialog: '',
        gpsServerPort_dialog: '',
        dbSynPort_dialog: '',
        videoRecPath_dialog: '',
        wavRecPath_dialog: '',
        videoUrlPrefix_dialog: '',
        vAGWAddress_dialog: '',
        vAGWPort_dialog: '',
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true
      }
    },
    mounted() {
      this.searchList()
    },
    methods: {
      updateSystem() {
        const data = {
          "id": this.id,
          "callTime": this.callTime_dialog,
          "pttOnTime": this.pttOnTime_dialog,
          "pttSilentTime": this.pttSilentTime_dialog,
          "gpsReportInterval": this.gpsReportInterval_dialog,
          "appHeartInterval": this.appHeartInterval_dialog,
          "audioHeartInterval": this.audioHeartInterval_dialog,
          "tcpListenPort": this.tcpListenPort_dialog,
          "appVoicePort": this.appVoicePort_dialog,
          "bdId": this.bdId_dialog,
          "bdListenPort": this.bdListenPort_dialog,
          "bdVoicePort": this.bdVoicePort_dialog,
          "gpsServerPort": this.gpsServerPort_dialog,
          "dbSynPort": this.dbSynPort_dialog,
          "videoRecPath": this.videoRecPath_dialog,
          "wavRecPath": this.wavRecPath_dialog,
          "videoUrlPrefix": this.videoUrlPrefix_dialog,
          "vAGWAddress": this.vAGWAddress_dialog,
          "vAGWPort": this.vAGWPort_dialog
        }
        this.$axios.post('system/updateSystem', data)
          .then(() => {
            this.alertMessage('更新成功')
            this.searchList()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
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
      showUpdateDialog(index, row) {
        console.log(row)
        this.dialogTitle = '修改'
        this.id = row.id
        this.callTime_dialog = row.callTime
        this.pttOnTime_dialog = row.pttOnTime
        this.pttSilentTime_dialog = row.pttSilentTime
        this.gpsReportInterval_dialog = row.gpsReportInterval
        this.appHeartInterval_dialog = row.appHeartInterval
        this.audioHeartInterval_dialog = row.audioHeartInterval
        this.tcpListenPort_dialog = row.tcpListenPort
        this.appVoicePort_dialog = row.appVoicePort
        this.bdId_dialog = row.bdId
        this.bdListenPort_dialog = row.bdListenPort
        this.bdVoicePort_dialog = row.bdVoicePort
        this.gpsServerPort_dialog = row.gpsServerPort
        this.dbSynPort_dialog = row.dbSynPort
        this.videoRecPath_dialog = row.videoRecPath
        this.wavRecPath_dialog = row.wavRecPath
        this.videoUrlPrefix_dialog = row.videoUrlPrefix
        this.vAGWAddress_dialog = row.vAGWAddress
        this.vAGWPort_dialog = row.vAGWPort
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
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
        this.$axios.get('system/systemList?start=&limit=&id=')
          .then(response => {
            this.list = response.data.data.list
          }).catch(err => {
          console.log(err)
          Cookies.remove('token')
          location.reload()
        })
      },
      searchList() {
        this.axiosUrl()
      }
    }
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
