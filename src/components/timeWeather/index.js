import React, { Component } from 'react';
import './index.less'

import utils from '@/assets/utils';

import axios from 'axios'

class TimeWeather extends Component {
    state = {
        city: '北京',
        isListBadge: false,
        drawerVisible: false,
        sysTime: ''
    }
    componentDidMount() {
        this.request();
    }
    //ajax加载数据
    request = (status, pages) => {//status:状态码，pages:查询页数
        let _this = this;
        axios.get(`http://api.help.bj.cn/apis/weather2d?id=${this.state.city}`).then(res => {
            let data = res.data
            if (data.status === '0') {
                this.setState({
                    weather: data.weather,
                    weathertemp: data.temp
                })
            }
        })
    }
    render() {
        return (
            <div className='time-weather'>
                <div className='time'>
                    <span>{utils.formateDate().date}</span>
                    <span>{utils.formateDate().week}</span>
                </div>
                <div className='weather'>
                    <span>{this.state.weather}</span>
                    <span>{this.state.weathertemp}</span>
                </div>
            </div>
        )
    }
};


export default TimeWeather;