import React, { Component } from 'react';

import { Layout } from 'antd';

import './index.less';

const { 
    Footer
} = Layout;

class MqFooter extends Component{
    
    render(){
        return(
            <Footer className="footer">
                Ant Design ©2018 Created by Ant UED
            </Footer>
        )
    }
}

export default MqFooter;