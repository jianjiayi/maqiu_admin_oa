import React, { Component } from 'react';

import MqTabPane from '@/components/tabPane';

import BulletinList from './list';
import BulletinForm from './form';

import './index.less'

class SystemBulletin extends Component{
    state={
        // 标签页信息
        tabsOptions:[
            {
              value:1,
              label:'公告列表',
            },
            {
              value:2,
              label:'发布公告',
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
                    this.state.tabsStatus === '1' ? <BulletinList></BulletinList> : <BulletinForm></BulletinForm>
                }
            </div>
        )
    }
};


export default SystemBulletin;