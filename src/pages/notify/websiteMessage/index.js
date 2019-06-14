import React, { Component } from 'react';

import { DatePicker } from 'antd';

import './index.less'

const { RangePicker } = DatePicker;



class WebsiteMessage extends Component {
    render() {

        var b = 1; 
        var a = {
          b: 2,
          c: function() { 
            console.log(this.b);
          }
        };
        
        a.c(); // 2


        return (
            <div>
                <RangePicker/>
            </div>
        )
    }
};


export default WebsiteMessage;