import Cookies from 'js-cookie'

const TokenKey = 'Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function checkRouter(menus, path) {
	if (menus == null) {
		return true
	} else if (menus.indexOf(path) < 0) {
		return false
	} else {
		menus = JSON.parse(menus)
		let result = false
		menus.forEach((v) => {
			if (v.moduleUrl == path) {
				result = true
			} else {
				if (v.children.length > 0) {
					v.children.forEach((val) => {
						if (val.moduleUrl == path) {
							result = true
						}
					})
				}
			}
		})
		return result
	}
}

//转换参数格式
export function getParam(form) {
	let paramArray = []
	for(let key in form) {
		let data = '' + key + '=' + form[key]
		paramArray.push(data)
	}
	return paramArray.join('&')
}

//获取当前年份
export function getYear() {
	let date = new Date()
	return date.getFullYear()
}
