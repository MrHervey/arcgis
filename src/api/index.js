import fetch from '@/utils/fetch';

//添加
export function postAddFeatures(obj) {
  return fetch({
    url: 'https://gis37.jxwrd.gov.cn:6443/arcgis/rest/services/test/AWW/FeatureServer/0/addFeatures',
    method: 'post',
    data: obj
  });
}

