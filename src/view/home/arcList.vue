<template>
  <div>
    <div class="arcList">
      <div class="arcNumber el-row--flex is-justify-space-between">
        <div class="statistics">
          <b>共<span style="color: red;">{{amount}}</span>条数据</b>
        </div>
        <div class="arcForm">
          <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
            <el-form-item label="地理位置">
              <el-cascader
                expand-trigger="hover"
                :options="options"
                v-model="formInline.array"
                placeholder="请选择地区"
                size="mini"
              >
              </el-cascader>
            </el-form-item>

            <el-form-item label="整治情况">
              <el-select v-model="formInline.SFYWCZZ" placeholder="是否完成" size="mini">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="矮圩类别">
              <el-select v-model="formInline.AWLB" placeholder="选择类型" size="mini">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="矮圩" value="矮圩"></el-option>
                <el-option label="网围" value="网围"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属水域">
              <el-select v-model="formInline.SSSY" placeholder="选择水域" size="mini">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="主要干流" value="主要干流"></el-option>
                <el-option label="大型水库" value="大型水库"></el-option>
                <el-option label="主要天然湖泊" value="主要天然湖泊"></el-option>
                <el-option label="其他水域" value="其他水域"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
              <el-button type="info" @click="onClear('formInline')" size="mini">清除</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table :data="tableData" height="260" stripe style="width: 100%" @row-click="rowList">
        <el-table-column prop="SSQ" label="市级" width="70"></el-table-column>
        <el-table-column prop="NAME" label="矮圩网或围网名称" width="160"></el-table-column>
        <el-table-column prop="XSQ" label="县市区"></el-table-column>
        <el-table-column prop="XZ" label="乡镇"></el-table-column>
        <el-table-column prop="SCSY" label="所处河湖水域"></el-table-column>
        <el-table-column prop="YZDW" label="业主单位"></el-table-column>
        <el-table-column prop="WXSJ" label="修建时间"></el-table-column>
        <el-table-column prop="AREA1" label="面积"></el-table-column>
        <el-table-column prop="ZYGN" label="计划完成时间"></el-table-column>
        <el-table-column prop="SFYWCZZ" label="是否已整治"></el-table-column>
        <el-table-column prop="WTJYMS" label="问题简要描述" width="280"></el-table-column>
        <el-table-column prop="AWLB" label="圩围类别"></el-table-column>
        <el-table-column prop="SSSY" label="所属水域"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { createSearchQuery } from '@/utils/arcgisMap'
  let herf = "http://gis37.jxwrd.gov.cn:6080/arcgis/rest/services/test/AWW/FeatureServer/0";
  export default {
    props:{
      tableData:[Array],
      amount:[Number]
    },
    data() {
      return {
        options: [{
          value: '全部',
          label: '全部',
        },{
          value: '南昌市',
          label: '南昌市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '南昌县',
            label: '南昌县'
          }, {
            value: '安义县',
            label: '安义县'
          }, {
            value: '进贤县',
            label: '进贤县'
          }]
        },{
          value: '九江市',
          label: '九江市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '九江县',
            label: '九江县'
          }, {
            value: '武宁县',
            label: '武宁县'
          }, {
            value: '修水县',
            label: '修水县'
          }, {
            value: '永修县',
            label: '永修县'
          }, {
            value: '德安县',
            label: '德安县'
          }, {
            value: '都昌县',
            label: '都昌县'
          }, {
            value: '湖口县',
            label: '湖口县'
          }, {
            value: '彭泽县',
            label: '彭泽县'
          }, {
            value: '瑞昌市',
            label: '瑞昌市'
          }, {
            value: '共青城市',
            label: '共青城市'
          }, {
            value: '庐山市',
            label: '庐山市'
          }]
        },{
          value: '上饶市',
          label: '上饶市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '上饶县',
            label: '上饶县'
          }, {
            value: '玉山县',
            label: '玉山县'
          }, {
            value: '弋阳县',
            label: '弋阳县'
          }, {
            value: '铅山县',
            label: '铅山县'
          }, {
            value: '余干县',
            label: '余干县'
          }, {
            value: '鄱阳县',
            label: '潘阳县'
          }, {
            value: '万年县',
            label: '万年县'
          }, {
            value: '婺源县',
            label: '婺源县'
          }, {
            value: '德兴市',
            label: '德兴市'
          }]
        },{
          value: '抚州市',
          label: '抚州市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '南城县',
            label: '南城县'
          }, {
            value: '黎川县',
            label: '黎川县'
          }, {
            value: '崇仁县',
            label: '崇仁县'
          }, {
            value: '南丰县',
            label: '南丰县'
          }, {
            value: '宜黄县',
            label: '宜黄县'
          }, {
            value: '乐安县',
            label: '乐安县'
          }, {
            value: '金溪县',
            label: '金溪县'
          }, {
            value: '资溪县',
            label: '资溪县'
          }, {
            value: '广昌县',
            label: '广昌县'
          }]
        },{
          value: '宜春市',
          label: '宜春市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '丰城市',
            label: '丰城市'
          }, {
            value: '樟树市',
            label: '樟树市'
          }, {
            value: '高安市',
            label: '高安市'
          }, {
            value: '万载县',
            label: '万载县'
          }, {
            value: '上高县',
            label: '上高县'
          }, {
            value: '奉新县',
            label: '奉贤县'
          }, {
            value: '奉新县',
            label: '奉新县'
          }, {
            value: '宜丰县',
            label: '宜丰县'
          }, {
            value: '铜鼓县',
            label: '铜鼓县'
          }, {
            value: '靖安县',
            label: '靖安县'
          }]
        },{
          value: '吉安市',
          label: '吉安市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '井冈山市',
            label: '井冈山市'
          }, {
            value: '吉安县',
            label: '吉安县'
          }, {
            value: '吉水县',
            label: '吉水县'
          }, {
            value: '峡江县',
            label: '峡江县'
          }, {
            value: '新干县',
            label: '新干县'
          }, {
            value: '永丰县',
            label: '永丰县'
          }, {
            value: '泰和县',
            label: '泰和县'
          }, {
            value: '遂川县',
            label: '遂川县'
          }, {
            value: '万安县',
            label: '万安县'
          }, {
            value: '安福县',
            label: '安福县'
          }, {
            value: '永新县',
            label: '永新县'
          }]
        },{
          value: '赣州市',
          label: '赣州市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '信丰县',
            label: '信丰县'
          }, {
            value: '大余县',
            label: '大余县'
          }, {
            value: '上犹县',
            label: '上犹县'
          }, {
            value: '崇义县',
            label: '崇义县'
          }, {
            value: '安远县',
            label: '安远县'
          }, {
            value: '龙南县',
            label: '龙南县'
          }, {
            value: '定南县',
            label: '定南县'
          }, {
            value: '全南县',
            label: '全南县'
          }, {
            value: '宁都县',
            label: '宁都县'
          }, {
            value: '于都县',
            label: '于都县'
          }, {
            value: '兴国县',
            label: '兴国县'
          }, {
            value: '会昌县',
            label: '会昌县'
          }, {
            value: '寻乌县',
            label: '寻乌县'
          }, {
            value: '石城县',
            label: '石城县'
          }, {
            value: '润金市',
            label: '润金市'
          }]
        },{
          value: '景德镇市',
          label: '景德镇市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '乐平市',
            label: '乐平市'
          }, {
            value: '浮梁县',
            label: '浮梁县'
          }]
        },{
          value: '萍乡市',
          label: '萍乡市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '泸溪县',
            label: '泸溪县'
          }, {
            value: '上栗县',
            label: '上栗县'
          }, {
            value: '莲花县',
            label: '莲花县'
          }]
        },{
          value: '新余市',
          label: '新余市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '分宜县',
            label: '分宜县'
          }]
        },{
          value: '鹰潭市',
          label: '鹰潭市',
          children: [{
            value: '全部',
            label: '全部'
          }, {
            value: '贵溪市',
            label: '贵溪市'
          }, {
            value: '余江县',
            label: '余江县'
          }]
        }],
        value: '',
        formInline: {
          array: [],
          SFYWCZZ: '',
          AWLB:'',
          SSSY:''
        },
        formArray:[]
      };
    },
    methods: {
      onSubmit() {
        this.formArray=[];
        if(this.formInline.array[0]!=''&&this.formInline.array[0]!='全部'){
          this.formArray.push({name:'SSQ',str:this.formInline.array[0]});
        }
        if(this.formInline.array[1]!=''&&this.formInline.array[1]!='全部'&&this.formInline.array.length>1){
          this.formArray.push({name:'XSQ',str:this.formInline.array[1]});
        }
        if(this.formInline.SFYWCZZ!=''&&this.formInline.SFYWCZZ!='全部'){
          this.formArray.push({name:'SFYWCZZ',str:this.formInline.SFYWCZZ});
        }
        if(this.formInline.AWLB!=''&&this.formInline.AWLB!='全部'){
          this.formArray.push({name:'AWLB',str:this.formInline.AWLB});
        }
        if(this.formInline.SSSY!=''&&this.formInline.SSSY!='全部'){
          this.formArray.push({name:'SSSY',str:this.formInline.SSSY});
        }
        this.$emit('queryField',herf,this.formArray);
      },
      rowList(row, column, event) {
        this.$emit('rowList',row);
      },
      onClear(formName){
        this.formInline = {
          array: [],
          SFYWCZZ: '',
          AWLB:'',
          SSSY:''
        }
        this.$emit('onClear',herf);
      }
    }
  }
</script>

<style scoped>
  .EchartsBox {
    position: fixed;
    left: 16px;
    top: 20px;
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
