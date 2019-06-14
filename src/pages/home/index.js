import React, { Component } from 'react';

import {Button } from 'antd';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/candlestick';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/graphic';
import 'echarts/lib/component/dataZoom';

import './index.less'

//首页
class Home extends Component{
    state={

    }
    componentDidMount() {
        // axios.ajax({
        //   url: '/echarts/k'
        // }).then(res => {
        //   if (res.code === 0) {
        //     this.setState({
        //       mockCandlestick: res.result.list
        //     })
            
        //   }
        // })
        this.echartsPie()
    }
    
    echartsPie = () => {
        var myChart = echarts.init(document.getElementById('main0'));
        // 绘制图表
        myChart.setOption({
            title: { text: '今日访问量' },
            tooltip: {},
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    }
    
      
    render(){
        return(
            <div className="home">
                <div className=''>
                    
                </div>
                <div className='echarts'>
                    <div className="main" id="main0"></div>
                </div>
                
            </div>
        )
    }
};


export default Home;