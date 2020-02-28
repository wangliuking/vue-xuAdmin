<template>
    <div>
      <div :id="id" :style="{width: width, height: height}"></div>
    </div>
</template>

<script>
  import echarts from 'echarts'
  import westeros from './theme/westeros'
  export default {
    name: 'lineEcharts',
    props: {
      id: {
        type: String,
        default: 'myChart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      echartsData:{
        type:Array,
        default:[]
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
    },
    watch: {
      echartsData() {
        this.initChart()
      }
    },
    methods: {
      initChart() {
        if(this.chart == null){
          this.chart = echarts.init(document.getElementById(this.id),'westeros')
        }

        this.chart.setOption({
          tooltip: {
            // show：'true',//默认：true；是否显示提示框组件，包括提示框浮层和 axisPointer。
            trigger: 'item',//默认：item；触发类型。item：数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。'axis'：坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。'none':什么都不触发。
            triggerOn: 'mousemove'
          },
          series:[
            {
              type: 'tree',
              data: this.echartsData,
              left: '2%',
              right: '2%',
              top: '15%',
              bottom: '10%',
              symbol: 'emptyCircle',
              orient: 'vertical',
              expandAndCollapse: true,//默认：true；子树折叠和展开的交互，默认打开 。
              initialTreeDepth:7,//默认：2，树图初始展开的层级（深度）。根节点是第 0 层，然后是第 1 层、第 2 层，... ，直到叶子节点
              label: {
                normal: {
                  position: ['220%','40%'],//标签的位置。
                  rotate: 0,//标签旋转。从 -90 度到 90 度。正值是逆时针。
                  verticalAlign: 'middle',//文字垂直对齐方式，默认自动。
                  align: 'right',//文字水平对齐方式，默认自动。
                  fontSize: 20,//文字的字体大小
                }
              },
              leaves: {
                label: {
                  normal: {
                    position: ['220%','40%'],
                    rotate: 0,
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 20,//文字的字体大小
                  }
                }
              },
              animationDurationUpdate: 750
            }
          ]
        })
      }
    }
  }
</script>

<style scoped>

</style>
