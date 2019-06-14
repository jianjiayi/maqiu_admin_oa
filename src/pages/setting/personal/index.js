import React, { Component } from 'react';

import MqTabPane from '@/components/tabPane';

import ColumnList from './list';
import ColumnForm from './form';

import './index.less'

class Personal extends Component{
    state={
        // 标签页信息
        tabsOptions:[
            {
              value:1,
              label:'个人信息',
            },
            {
              value:2,
              label:'资料修改',
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
                    this.state.tabsStatus === '1' ? <ColumnList></ColumnList> : <ColumnForm></ColumnForm>
                }
            </div>
        )
    }
};


export default Personal;