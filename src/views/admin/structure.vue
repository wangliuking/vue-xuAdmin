<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-tree
          :data="treeModel"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent">
        </el-tree>
      </el-col>
      <el-col :span="18">
        <tree-echarts id="treeEcharts" height="300px" :echartsData="echartsData"></tree-echarts>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <el-input
            type="text"
            placeholder="请输入名称"
            maxlength="50"
            show-word-limit
            v-model="label_dialog"
            class="dialogInput"
          >
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-show="addBtnStatus" type="primary" @click="addTree" :disabled="checkStatus">添 加</el-button>
    <el-button v-show="updateBtnStatus" type="primary" @click="updateTree" :disabled="checkStatus">更 新</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import TreeEcharts from '../../components/ECharts/treeEcharts'
  import Cookies from 'js-cookie'

  export default {
    components: {TreeEcharts},
    data() {
      return {
        treeModel: [],
        echartsData:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogVisible: false,
        dialogTitle: '',
        id_dialog: '',
        pId_dialog: '',
        label_dialog: '',
        level_dialog: '',
        addBtnStatus: false,
        updateBtnStatus: false,
        checkStatus: true
      }
    },
    mounted() {
      this.getStructureTree()
      this.getTreeEchart()
    },
    methods: {
      getStructureTree() {
        this.$axios.get('structure/selectAllStructure?structure=' + this.$store.getters.info.role)
          .then(response => {
            this.treeModel = response.data
          }).catch(err => {
          console.log(err)
          Cookies.remove('token')
          location.reload()
        })
      },
      getTreeEchart() {
        this.$axios.get('structure/treeEchart?structure=' + this.$store.getters.info.role)
          .then(response => {
            this.echartsData = response.data
          }).catch(err => {
          console.log(err)
        })
      },
      deleteTree(data) {
        console.log(data)
        this.$confirm('是否确认删除该节点及子节点？ ID:' + data.id, '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$axios.get('structure/deleteStructure?id=' + data.id)
            .then(() => {
              this.alertMessage('删除成功')
              this.getStructureTree()
              this.getTreeEchart()
            }).catch(err => {
            this.alertMessage('删除失败' + err)
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      updateTree() {
        if (this.label_dialog === '') {
          this.alertMessage('名称不能为空')
          return
        }

        const data = {
          "id": this.id_dialog,
          "label": this.label_dialog
        }
        this.$axios.post('structure/updateStructure', data)
          .then(() => {
            this.alertMessage('更新成功')
            this.getStructureTree()
            this.getTreeEchart()
          }).catch((err) => {
          this.alertMessage('更新失败' + err)
        })
        this.dialogVisible = false
      },
      addTree() {
        if (this.label_dialog === '') {
          this.alertMessage('名称不能为空')
          return
        }

        const data = {
          "id": this.pId_dialog,
          "label": this.label_dialog,
          "level": this.level_dialog
        }
        this.$axios.post('structure/insertStructure', data)
          .then(() => {
            this.alertMessage('添加成功')
            this.getStructureTree()
            this.getTreeEchart()
          }).catch((err) => {
          this.alertMessage('添加失败' + err)
        })
        this.dialogVisible = false
      },
      append(data) {
        this.dialogTitle = '添加'
        this.label_dialog = ''
        this.pId_dialog = data.id
        this.level_dialog = data.level
        this.addBtnStatus = true
        this.updateBtnStatus = false
        this.dialogVisible = true
        this.checkStatus = false
      },
      remove(data) {
        this.deleteTree(data)
      },
      update(data) {
        this.dialogTitle = '修改'
        this.id_dialog = data.id
        this.label_dialog = data.label
        this.addBtnStatus = false
        this.updateBtnStatus = true
        this.dialogVisible = true
        this.checkStatus = false
      },
      renderContent(h, {node, data, store}) {
        return (
          <span style = "flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span> <span> {node.label}</span></span>
        <span><el-button style = "font-size: 12px;" type = "text" on-click={()=>this.append(data)}>添加</el-button>
        <el-button style = "font-size: 12px;" type = "text" on-click={()=>this.remove(data)}>删除</el-button>
        <el-button style = "font-size: 12px;" type = "text" on-click={()=>this.update(data)}>修改</el-button></span></span>)
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
      }
    }
  };

</script>

<style lang="scss" scoped>

</style>
