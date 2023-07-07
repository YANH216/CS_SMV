import ajax from './ajax'

const BASE = 'http://localhost.charlesproxy.com:8080'

export const reqHomeContentData = () =>  ajax(BASE + '/data') 