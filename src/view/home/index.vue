<template>
  <div style="width: 100%;position: relative">
    <div id="viewDiv"></div>
    <editArea ref="editArr"></editArea>
    <Echarts v-show="showEcharts"></Echarts>
    <arcList v-show="showList" :tableData="table" :amount="amount"
             @queryField="queryField" @rowList="rowList" @onClear="onClear"></arcList>
    <div class="btnList" id="btnList">
      <el-tooltip class="item" effect="dark" content="表格列表" placement="left" >
        <div class="btnCard" @click="listToggle"><i class="el-icon-tickets"></i></div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="数据图表" placement="left" >
        <div class="btnCard" @click="chartsToggle"><i class="el-icon-news"></i></div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="修改坐标" placement="left">
        <div class="btnCard" id="editorToggle"><i class="el-icon-location-information"></i></div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import esriLoader from 'esri-loader'
  import arcList from './arcList'
  import Echarts from './Echarts'
  import editArea from './editArea'
  import {getTableData} from '@/utils/transfer'
  import {createSearchQuery,TileLayerMapView,BaseMapToggleZoom,EditorMapDate} from '@/utils/arcgisMap'

  export default {
    components: {
      arcList, Echarts,editArea
    },
    data() {
      return {
        showList: false,
        showEcharts:true,
        showEditor:false,
        table: [],
        amount: 0,
        returnView: null,
        returnGraphics: null,
        returnLayer: null,
        highlight:null
      };
    },
    created() {
      TileLayerMapView("viewDiv").then(val=>{
        this.createMap(val[0],val[1]);
      });
    },
    methods: {
      createMap(map,view) {
        const options = {
          url: 'https://js.arcgis.com/4.11/'
        };
        esriLoader.loadModules([
          "esri/config",
          "esri/layers/FeatureLayer",
          "esri/widgets/ScaleBar",
          "esri/widgets/FeatureForm",
          "esri/widgets/FeatureTemplates",
          "esri/widgets/Legend",
          "esri/widgets/Editor"
        ], options).then(
          ([
             esriConfig, FeatureLayer, ScaleBar,
             FeatureForm, FeatureTemplates, Legend,Editor
           ]) => {
            //加载featureLayer图层
            const template = { // 模板
              title: "{SSQ}/{NAME}",
              content: [{
                type: "fields",
                fieldInfos: [
                  {fieldName: "SSQ", label: "市级"},
                  {fieldName: "NAME", label: "矮圩网或围网名称"},
                  {fieldName: "XSQ", label: "县市区"},
                  {fieldName: "XZ", label: "乡镇"},
                  {fieldName: "SCSY", label: "所处河湖水域（湿地）"},
                  {fieldName: "YZDW", label: "业主单位"},
                  {fieldName: "WXSJ", label: "修建时间"},
                  {fieldName: "AREA1", label: "面积（亩）"},
                  {fieldName: "ZYGN", label: "主要功能"},
                  {fieldName: "ZZSJ", label: "计划整治完成时间"},
                  {fieldName: "SFYWCZZ", label: "是否已完成整治"},
                  {fieldName: "WTJYMS", label: "问题简要描述"},
                  {fieldName: "AWLB", label: "圩围类别"},
                  {fieldName: "SSSY", label: "所属水域"},
                ]
              }]
            };
            const hwySym = {
              type: "simple-marker",
              size: 8,
              color: [51, 41, 0, 0.6],
              outline: { //autocasts as new SimpleLineSymbol()
                width: '2px',
                color: "white"
              }
            };
            const hwsSym = {
              type: "simple-marker",
              size: 8,
              color: [23, 207, 121, 0.6],
              outline: { // autocasts as new SimpleLineSymbol()
                width: '2px',
                color: "white"
              }
            };
            const otherSym = {
              type: "simple-marker",
              size: 8,
              color: [240, 36, 0, 0.6],
              outline: { // autocasts as new SimpleLineSymbol()
                width: '2px',
                color: "white"
              }
            };
            const hwyRenderer = {
              type: "unique-value", // autocasts as new UniqueValueRenderer()
              field: "SFYWCZZ",//查询字段
              defaultSymbol: otherSym,
              defaultLabel: "未标注状态",
              legendOptions: false,
              uniqueValueInfos: [{
                value: "是", // 表字段的值
                symbol: hwsSym,
                label: '已整治'
              },
                {
                  value: "否",
                  symbol: hwySym,
                  label: '未整治'
                }]
            };
            const citiesLayerUrl = 'https://gis37.jxwrd.gov.cn:6443/arcgis/rest/services/test/AWW/FeatureServer/0';
            const featureLayer = new FeatureLayer({
              url: citiesLayerUrl,
              outFields: ["*"],
              popupTemplate: template,
              renderer: hwyRenderer,
              popupEnabled: true,
              title: '非法矮圩网围整治信息图例'
            });
            map.add(featureLayer);
            featureLayer.queryFeatures().then((results) => {
              this.table = getTableData(results.features);
              this.amount = results.features.length;
              this.returnGraphics = results.features
            });
            //图例
            view.ui.add(new Legend({
                view: view,
                layerInfos: [{layer: featureLayer}]
              }), "bottom-left");
            //右下角-地图切换放大功能
            BaseMapToggleZoom(view);
            //编辑功能
            let editor = EditorMapDate(view,featureLayer,Editor);
            dojo.byId('editorToggle').onclick =()=>{
              this.showEditor = !this.showEditor
              this.showEditor ? view.ui.add(editor, "top-right") : view.ui.remove(editor);
            };
            //添加按钮
            view.ui.add('btnList', "top-right");
            //赋值
            this.returnLayer = featureLayer;
            this.returnView = view;
            //调用列表方法
            this.$refs.editArr.editArea(view, featureLayer, FeatureForm);
          }, reason => {
            console.log(reason);
          })
      },
      queryField(herf, data) {
        createSearchQuery(herf, data).then((results) => {
          this.table = getTableData(results[0].features);
          this.amount = results[0].features.length;
          let field = '';
          if(data.length > 0){
            for(let i=0;i<data.length;i++){
              if(i == data.length-1){
                field += " " + data[i].name + " = '" + data[i].str + "' "
              } else {
                field +=" " + data[i].name + " = '" + data[i].str + "' and "
              }
            }
          }else {
            field = "1='1'"
          }

          this.returnLayer.definitionExpression = field;

          /*this.returnView.whenLayerView(this.returnLayer).then((layerView) => {
            if(this.highlight){
              this.highlight.remove();
            }
            this.highlight = layerView.highlight(results[0].features);
          });*/
          console.log(results[1].extent);
          this.returnView.goTo(results[1].extent);
        });
      },
      rowList(row){
        this.returnGraphics.forEach((val)=>{
          if(val.attributes.OBJECTID==row.OBJECTID){
            this.returnView.goTo(val.geometry).then(() => {
              this.returnView.popup.open({
                features: [val],
                location: val.geometry
              });
            });
          }
        })
      },
      listToggle() {
        this.showList = !this.showList;
      },
      chartsToggle() {
        this.showEcharts = !this.showEcharts;
      },
      onClear(herf){
        if(this.highlight){
          this.highlight.remove();
        }
        createSearchQuery(herf,[]).then((results) => {
          this.returnLayer.definitionExpression = "1='1'";
          this.table = getTableData(results[0].features);
          this.amount = results[0].features.length;
        });
        this.returnView.goTo({
          center: [116,27],
          zoom: 2
        });
      }
    }
  }
</script>

<style scoped>
  #viewDiv{
    width: 100%;
    height: 100vh
  }
</style>
