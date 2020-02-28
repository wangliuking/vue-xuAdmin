<template>
  <div ref="map" class="map"></div>
</template>

<script>
  export default {
    name: 'Map',
    data() {
      return {
        chart: echarts.ECharts,
        bmap: {}
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        console.log("*****************************")
        console.log(this.$refs.map.parentNode.offsetHeight)
        this.$refs.map.style.width = 1000
        this.$refs.map.style.height = 600
        this.chart = echarts.init(this.$refs.map)
        this.chart.setOption({
          // 加载 bmap 组件
          bmap: {
            // 百度地图中心经纬度
            center: [101.954946, 34.502353],
            // 百度地图缩放
            zoom: 6,
            // 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
            roam: true,
            // 百度地图的自定义样式，见 http://developer.baidu.com/map/jsdevelop-11.htm
            mapStyle: {
              styleJson: [{
                'featureType': 'land',
                'elementType': 'geometry',
                'stylers': {'color': '#081734'}
              }, {
                'featureType': 'building',
                'elementType': 'geometry',
                'stylers': {'color': '#04406F'}
              }, {
                'featureType': 'building',
                'elementType': 'labels',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'highway',
                'elementType': 'geometry',
                'stylers': {'color': '#015B99'}
              }, {
                'featureType': 'highway',
                'elementType': 'labels',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'arterial',
                'elementType': 'geometry',
                'stylers': {'color': '#003051'}
              }, {
                'featureType': 'arterial',
                'elementType': 'labels',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'green',
                'elementType': 'geometry',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'water',
                'elementType': 'geometry',
                'stylers': {'color': '#044161'}
              }, {
                'featureType': 'subway',
                'elementType': 'geometry.stroke',
                'stylers': {'color': '#003051'}
              }, {
                'featureType': 'subway',
                'elementType': 'labels',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'railway',
                'elementType': 'geometry',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'railway',
                'elementType': 'labels',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'all',
                'elementType': 'labels.text.stroke',
                'stylers': {'color': '#313131'}
              }, {
                'featureType': 'all',
                'elementType': 'labels.text.fill',
                'stylers': {'color': '#FFFFFF'}
              }, {
                'featureType': 'manmade',
                'elementType': 'geometry',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'manmade',
                'elementType': 'labels',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'local',
                'elementType': 'geometry',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'local',
                'elementType': 'labels',
                'stylers': {'visibility': 'off'}
              }, {
                'featureType': 'subway',
                'elementType': 'geometry',
                'stylers': {'lightness': -65}
              }, {
                'featureType': 'railway',
                'elementType': 'all',
                'stylers': {'lightness': -40}
              }, {
                'featureType': 'boundary',
                'elementType': 'geometry',
                'stylers': {'color': '#8b8787', 'weight': '1', 'lightness': -29}
              }]
            }
          },
          series: [
            {
              name: 'Top 5',
              type: 'effectScatter',
              coordinateSystem: 'bmap',
              symbolSize: function (v) {
                return 3;
              },
              data: [],
              showEffectOn: 'render',
              rippleEffect: {
                period: 4,
                brushType: 'fill',
                scale: 25
              },
              label: {
                normal: {
                  show: true,
                  formatter: "{b}",
                  fontSize: 16,
                  color: "white",
                  offset: [0, 0]
                }
              },
              itemStyle: {
                normal: {
                  color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                    colorStops: [{
                      offset: 0, color: 'rgba(255,0,0,0.3)'
                    }, {
                      offset: 0.4, color: 'rgba(255,0,0,6)'
                    }, {
                      offset: 0.9, color: 'rgba(255,0,0,9)'
                    }, {
                      offset: 1, color: 'rgba(255,0,0,1)'
                    }],
                    globalCoord: true
                  },
                  shadowBlur: 0,
                  shadowColor: '#25fffb'
                }
              }

            }
          ]
        })

        // 获取百度地图实例，使用百度地图自带的控件
        this.bmap = this.chart.getModel().getComponent('bmap').getBMap()
        this.bmap.setMinZoom(6) // 设置地图最小缩放比例
        this.bmap.setMaxZoom(12) // 设置地图最大缩放比例
        // this.bmap.addControl(new BMap.MapTypeControl({ mapTypes: [] })) // 不显示地图右上方的控件
        this.bmap.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT})) // 在左下角显示比例尺控件
        const _this = this
        // 监听地图比例缩放， 可以根据缩放等级控制某些图标的显示
        this.bmap.addEventListener('zoomend', function () {
          _this.mapZoom = _this.bmap.getZoom()
        })

      }
    }
  };

</script>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 100%;
  }
  .BMap_cpyCtrl {
    display:none;
  }
  .anchorBL{
    display:none;
  }
</style>
