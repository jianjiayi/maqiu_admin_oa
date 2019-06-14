// 时间格式化
const formateDate = ()=>{
    let now = new Date();
    let year = now.getFullYear();
    let month = checkTime(now.getMonth() + 1);
    let day = now.getDate();
    let weekday = now.getDay();
    let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return {
        date: year + '年' + month + '月' + day + '日',
        week: week[weekday]
    }
}

let checkTime = (i)=> {
    if (i < 10) {
      i = '0' + i
    }
    return i
}



export default  {
    formateDate
}
