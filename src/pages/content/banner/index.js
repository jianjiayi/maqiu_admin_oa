import React, { Component } from 'react';

import MqTabPane from '@/components/tabPane';

import BannerList from './list';
import BannerForm from './form/index';

import './index.less'

class Banner extends Component{
    state={
        // 标签页信息
        tabsOptions:[
            {
              value:1,
              label:'幻灯片列表',
            },
            {
              value:2,
              label:'幻灯片新增',
            },
        ],
        tabActiveIndex:'1',
        tabsStatus:'1',
    }
    //点击tab切换回调函数
    tabPaneCallback=(key)=>{
        this.setState({
            tabsStatus:key
        })
    }
    render(){
        return(
            <div className='colum'>
                <MqTabPane 
                    tabsOptions={this.state.tabsOptions}
                    tabActiveIndex = {this.state.tabActiveIndex}
                    tabPaneCallback = {this.tabPaneCallback}
                >  
                </MqTabPane>
                {
                    this.state.tabsStatus === '1' ? <BannerList></BannerList> : <BannerForm></BannerForm>
                }
            </div>
        )
    }
};


export default Banner;