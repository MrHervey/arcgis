<template>
  <div id="editArea" class="editArea" v-show="showEdit">
    <div id="featureUpdateDiv" style="background:#fff;">
      <div class="editHead">
        <h4 class="list-heading" style="padding: 5px">修改数据值</h4>
        <i class="el-icon-close" @click="hideEdit"></i>
      </div>
      <div id="attributeArea" style="padding: 0 7px; background: #f5f5f5; max-height: 400px; overflow: auto">
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
          <el-form-item label="市级">
            <el-input v-model="form.SSQ" size="mini" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="矮圩网或围网名称">
            <el-input v-model="form.NAME" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="县市区">
            <el-input v-model="form.XSQ" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="乡镇">
            <el-input v-model="form.XZ" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="所处河湖水域">
            <el-input v-model="form.SCSY" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="业主单位">
            <el-input v-model="form.YZDW" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="修建时间">
            <el-date-picker type="month" placeholder="选择日期" value-format="yyyy年MM月" format="yyyy年MM月"
                            v-model="form.WXSJ" style="width: 100%;" size="mini"></el-date-picker>
          </el-form-item>
          <el-form-item label="面积(亩)">
            <el-input v-model="form.AREA1" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="主要功能">
            <el-input v-model="form.ZYGN" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="计划整治完成时间">
            <el-date-picker type="month" placeholder="选择日期" value-format="yyyy年MM月" format="yyyy年MM月"
                            v-model="form.ZZSJ" style="width: 100%;" size="mini"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否已完成整治">
            <el-select v-model="form.SFYWCZZ" placeholder="请选择" style="width: 100%;" size="mini">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题简要描述">
            <el-input type="textarea" v-model="form.WTJYMS"></el-input>
          </el-form-item>
          <el-form-item label="圩围类别">
            <el-input v-model="form.AWLB" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="所属水域">
            <el-input v-model="form.SSSY" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" size="mini" id="btnUpdate">更新</el-button>
      <el-button type="info" size="mini" id="btnDelete">删除</el-button>
    </div>
    <div style="display: none;">
      <div id="formDiv"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showEdit: false,
        form: {
          SSQ: '',
          NAME: '',
          XSQ: '',
          XZ: '',
          SCSY: '',
          YZDW: '',
          WXSJ: '',
          AREA1: '',
          ZYGN: '',
          ZZSJ:'',
          SFYWCZZ: '',
          WTJYMS: '',
          AWLB: '',
          SSSY: ''
        }
      };
    },
    methods: {
      editArea(view, featureLayer, FeatureForm) {
        let editFeature, highlight;
        const featureForm = new FeatureForm({
          container: "formDiv",
          layer: this.returnLayer,
          fieldConfig: []
        });
        //监控提交按钮事件
        featureForm.on("submit", () => {
          if (editFeature) {
            //那把赋给已存在的表中
            Object.keys(this.form).forEach((name) => {
              editFeature.attributes[name] = this.form[name];
            });
            //调用方法
            const edits = {
              //更新地图
              updateFeatures: [editFeature]
            };
            applyEditsToIncidents(edits);
            dojo.byId("viewDiv").style.cursor = "auto";
          }
        });

        // 调用.applyEdits()修改服务器数据
        function applyEditsToIncidents(params) {
          featureLayer.applyEdits(params).then(function (editsResult) {
            //添加或修改信息
            if (editsResult.addFeatureResults.length > 0 || editsResult.updateFeatureResults.length > 0) {
              unselectFeature();
              let objectId;
              if (editsResult.addFeatureResults.length > 0) {
                objectId = editsResult.addFeatureResults[0].objectId;
              } else {
                featureForm.feature = null;
                objectId = editsResult.updateFeatureResults[0].objectId;
              }
              //查询字段
              selectFeature(objectId);
            } else if (editsResult.deleteFeatureResults.length > 0) {
              this.showEdit = false
            }
          }).catch(function (error) {
            console.log("error = ", error);
          });
        }

        //地图可视区域点击事件
        view.on("click", (event) => {
          unselectFeature();
          if (dojo.byId("viewDiv").style.cursor != "crosshair") {
            view.hitTest(event).then((response) => {
              if (response.results.length === 0) {
                this.showEdit = false
              } else {

                selectFeature(
                  response.results[0].graphic.attributes[featureLayer.objectIdField] //获取ID
                ).then((val) => {
                  this.form = val.attributes;
                });
                this.showEdit = true;
              }
            });
          }
        });

        //搜索字段信息
        function selectFeature(objectId) {
          //queryFeatures 字段查询
          return new Promise((resolve, reject) => {
            featureLayer.queryFeatures({
              objectIds: [objectId],
              outFields: ["*"],
              returnGeometry: true
            }).then((results) => {
              if (results.features.length > 0) {
                //获取点的所有信息
                editFeature = results.features[0];
                featureForm.feature = editFeature;
                //高亮显示
                view.whenLayerView(editFeature.layer).then(function (layerView) {
                  highlight = layerView.highlight(editFeature);
                });
                resolve(results.features[0]);
              }
            });
          })
        }

        function unselectFeature() {
          if (highlight) {
            highlight.remove();
          }
        }

        //更新按钮
        document.getElementById("btnUpdate").onclick = function () {
          featureForm.submit();
        };
        // 删除按钮
        document.getElementById("btnDelete").onclick = function () {
          const edits = {
            deleteFeatures: [editFeature]
          };
          applyEditsToIncidents(edits);
          document.getElementById("viewDiv").style.cursor = "auto";
        };
      },
      hideEdit() {
        this.showEdit = false;
      },
    }
  }
</script>

<style scoped>

</style>
