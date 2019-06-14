import React, { Component } from 'react';

import MqTabPane from '@/components/tabPane';

import AdminList from './list';
import AdminForm from './form';

import './index.less'

class Admin extends Component{
    state={
        // 标签页信息
        tabsOptions:[
            {
              value:1,
              label:'用户列表',
            },
            {
              value:2,
              label:'添加用户',
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
                    this.state.tabsStatus === '1' ? <AdminList></AdminList> : <AdminForm></AdminForm>
                }
            </div>
        )
    }
};


export default Admin;