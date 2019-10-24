import esriLoader from 'esri-loader';
import mapImage from '@/assets/images/mapImage.png';
import mapVector from '@/assets/images/mapVector.jpg';
const options = {
  url: 'https://js.arcgis.com/4.11/'
};
//首页地图加载
export function TileLayerMapView(divID) {
  return new Promise((resolve, reject) => {
    esriLoader.loadModules([
      "esri/layers/TileLayer", "esri/Map",'esri/Basemap',"esri/views/MapView","esri/geometry/Point"
    ], options).then(([TileLayer, Map, Basemap, MapView,Point]) => {
      const layer = new TileLayer({
        url: 'https://map.jxwrd.gov.cn/arcgis/rest/services/EsriBaseMap/MapServer'
      });
      const basemap = new Basemap({
        baseLayers: [layer],
        title: '影像图',
        thumbnailUrl: mapImage
      });
      let map = new Map({
        basemap: basemap
      });
      let view = new MapView({
        container: divID,
        map: map,
        zoom: 2,
        center: new Point({
          x: 116,
          y: 27,
          spatialReference: {
            wkid: 4490
          }
        }),
        constraints:{
          minZoom:1,
          maxZoom:11
        }
      });
      view.ui.empty("top-left");
      resolve([map,view]);
    })
  });
}

//字段查询
export function createSearchQuery(href,data) {
  return new Promise((resolve, reject) => {
    esriLoader.loadModules(["esri/tasks/support/Query", "esri/tasks/QueryTask"], options).then((
      [Query, QueryTask]) => {
      let queryTask = new QueryTask(href);
      let query = new Query(), field = '';
      if(data.length > 0){
        for(let i=0;i<data.length;i++){
          if(i == data.length-1){
            field += " " + data[i].name + " = '" + data[i].str + "' "
          } else {
            field +=" " + data[i].name + " = '" + data[i].str + "' and "
          }
        }
        query.where = field;
      }else {
        query.where ="1='1'"
      }
      query.returnGeometry = true;
      query.outFields = ["*"];
      queryTask.execute(query).then((data) => {
        if(data){
          queryTask.executeForExtent(query).then((results) => {
            resolve([data,results])
          });
        }
      });
    });
  });
}
//地图切换
export function BaseMapToggleZoom(view) {
  esriLoader.loadModules([
    "esri/layers/TileLayer",'esri/Basemap',"esri/widgets/BasemapToggle","esri/widgets/Zoom"
  ], options).then(([TileLayer, Basemap,BasemapToggle,Zoom]) => {
    //放大小
    const zoom = new Zoom({
      view: view
    });
    view.ui.add(zoom, "bottom-right");
    //地图切换
    const layers = new TileLayer({
      url: 'https://gis37.jxwrd.gov.cn:6443/arcgis/rest/services/Image/jx2mDOM/MapServer'
    });
    var stamen = new Basemap({
      baseLayers: [layers],
      title: '矢量图',
      thumbnailUrl: mapVector
    });
    const toggle = new BasemapToggle({
      titleVisible: true,
      view: view,
      nextBasemap: stamen
    });
    view.ui.add(toggle, "bottom-right");
  })
}
//地图点移动
export function EditorMapDate(view,featureLayer,Editor) {
  return new Editor({
    view: view,
    allowedWorkflows: ["update"],
    layerInfos: [{
      layer: featureLayer, // pass in the feature layer
      fieldConfig: [{
        name: "DWFHQK",
        label: "定位复核"
      }],
      enabled: true,
      addEnabled: false,
      updateEnabled: true,
      deleteEnabled: false
    }]
  });
}


