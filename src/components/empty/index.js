import React, { Component } from 'react';

import {Icon } from 'antd';

import './index.less'

class Empty extends Component{
    render(){
        const displyStyle = this.props.styleDisplay;
        return(
            <div 
                className='Empty'
                style={{display:displyStyle}}>
                <div className="Empty-img">
                    <img src="./images/empty.png"></img>
                    <span>暂无数据</span>
                </div>
            </div>
        )
    }
};


export default Empty;