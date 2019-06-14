import React, { Component } from 'react';

import MqTabPane from '@/components/tabPane';

import LinkList from './list/index';
import LinkForm from './form/index';

import './index.less'

class FriendLink extends Component{
    state={
        // 标签页信息
        tabsOptions:[
            {
              value:1,
              label:'链接列表',
            },
            {
              value:2,
              label:'添加链接',
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
                    this.state.tabsStatus === '1' ? <LinkList></LinkList> : <LinkForm></LinkForm>
                }
            </div>
        )
    }
};


export default FriendLink;
