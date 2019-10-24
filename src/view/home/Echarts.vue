<template>
  <div class="EchartsBox">
    <div class="e-title">
      <p>江西省非法矮圩网围治理情况(2019年4月)</p>
    </div>
    <div class="e-content">
      <div id="aWcake"></div>
      <div id="aWstrip"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import {createSearchQuery} from '@/utils/arcgisMap'

  const district = ['鹰潭市', '新余市', '萍乡市', '景德镇市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市', '九江市', '南昌市'],
    $green = '#33d298',
    $red = '#f09b90',
    $black = '#83929d';

  export default {
    props: {
      statistics: [Array]
    },
    data() {
      return {
        number: 0,
        region: []
      };
    },
    created() {
      this.again();
    },
    methods: {
      again() {
        //添加数组属性
        for (let i = 0; i < district.length; i++) {
          this.region.push({data: {begin: [], march: [], end: []}});
        }
        let s1 = 0, s2 = 0, s3 = 0;
        //请求获取搜索数据
        const herf = "http://gis37.jxwrd.gov.cn:6080/arcgis/rest/services/test/AWW/FeatureServer/0";
        createSearchQuery(herf, []).then((val) => {
          //循环数据分类，统计全部数量
          val[0].features.map((value) => {
            if (value.attributes.SFYWCZZ == "是") {
              s1++;
              for (let i = 0; i < district.length; i++) {
                if (value.attributes.SSQ == district[i]) {
                  this.region[i].data.begin.push(value.attributes);
                }
              }
            } else if (value.attributes.SFYWCZZ == "否") {
              s3++;
              for (let i = 0; i < district.length; i++) {
                if (value.attributes.SSQ == district[i]) {
                  this.region[i].data.end.push(value.attributes);
                }
              }
            } else {
              s2++
              for (let i = 0; i < district.length; i++) {
                if (value.attributes.SSQ == district[i]) {
                  this.region[i].data.march.push(value.attributes);
                }
              }
            }
          });
          //每个地市数据分布
          let r1 = [], r2 = [], r3 = [];
          this.region.map((value) => {
            let v1 = value.data.begin.length, v2 = value.data.march.length, v3 = value.data.end.length;
            if (v1 < 1) {
              v1 = ''
            }
            if (v2 < 1) {
              v2 = ''
            }
            if (v3 < 1) {
              v3 = ''
            }
            r1.push(v1);
            r2.push(v2);
            r3.push(v3);
          });
          //加载图表
          let num = s1 + s2 + s3;
          this.aWcake(num, s1, s2, s3);
          this.aWstrip(r1, r2, r3);
        });
      },
      aWcake(num, s1, s2, s3) {
        let option = {
          title: {
            subtext: '总计非法矮圩' + num + '处',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: '整治信息',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {
                  value: s1, name: '已整治',
                  itemStyle: {
                    color: $green
                  }
                },
                {
                  value: s2, name: '未标注',
                  itemStyle: {
                    color: $red
                  }
                },
                {
                  value: s3, name: '未整治',
                  itemStyle: {
                    color: $black
                  }
                },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        this.charts(option, 'aWcake');
      },
      aWstrip(r1, r2, r3) {
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['已整治', '未整治', '未标注']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: district
            // data: ['鹰潭','新余','萍乡','景德镇','赣州','吉安','宜春','抚州','上饶','上饶','九江','南昌']
          },
          series: [
            {
              name: '已整治',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: r1,
              itemStyle: {
                color: $green
              }
            },
            {
              name: '未整治',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: r3,
              itemStyle: {
                color: $black
              }
            },
            {
              name: '未标注',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: r2,
              itemStyle: {
                color: $red
              }
            }
          ]
        };
        this.charts(option, 'aWstrip');
      },
      charts(option, id) {
        let myChart = echarts.init(document.getElementById(id), 'light');
        myChart.setOption(option);
      },
    }
  }
</script>

<style scoped>
  .EchartsBox {
    position: absolute;
    left: 16px;
    top: 10px;
    box-shadow: 0 0 7px rgba(0, 0, 0, .4);
    z-index: 9;
  }

  .e-title {
    background: #f8f8f8;
  }

  .e-title p {
    padding: 8px 0;
    text-align: center;
    color: #328be4;
  }

  .e-content div {
    background: #fff;
    width: 400px;
  }

  .e-content #aWcake {
    height: 220px;
    padding: 10px 50px 20px;
    border-bottom: #e5e5e5 1px solid;
  }

  .e-content #aWstrip {
    padding: 20px 10px 25px;
    height: 340px;
  }
</style>
