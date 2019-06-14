import React, { Component } from 'react';

import './index.less';


class WaveWrapper extends Component{
    render(){
        return(
            <div className="waveAnimation">
                <div className="waveWrapperInner bgTop">
                    <div className="wave waveTop" style={{backgroundImage: 'url(./images/wave-top.png)'}}></div>
                </div>
                <div className="waveWrapperInner bgMiddle">
                    <div className="wave waveMiddle" style={{backgroundImage: 'url(./images/wave-mid.png)'}}></div>
                </div>
                <div className="waveWrapperInner bgBottom">
                    <div className="wave waveBottom" style={{backgroundImage: 'url(./images/wave-bot.png)'}}></div>
                </div>
            </div>
        )
    }
};


export default WaveWrapper;