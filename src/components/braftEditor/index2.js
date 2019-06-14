import React, { Component } from 'react';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import './index.less';
import Axios from 'axios';
import { uploadFile } from '@/config';


class MqEditor extends Component {
    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    }

    async componentDidMount() {
        this.props.onRef(this);
        // 假设此处从服务端获取html格式的编辑器内容
        const htmlContent = this.props.htmlContent;
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
        this.setState({
            editorState: BraftEditor.createEditorState(htmlContent)
        })
    }

    //传递的组件参数改变是调用
    componentWillReceiveProps(nextProps){
        let htmlContent = nextProps.htmlContent;
        this.setState({
            editorState: BraftEditor.createEditorState(htmlContent)
        })
    }

    submitContent = () => {
        try {
            // 在编辑器获得焦点时按下ctrl+s会执行此方法
            // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
            return this.state.editorState.toHTML();

        } catch (err) {
            return err
        }

    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    uploadFn = (info) => {
        let formData = new window.FormData()
        formData.append('file', info.file, info.file.name)
        Axios({
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: 'post',
            data: formData,
            url: uploadFile
        }).then(res => {
            if (res.data.code === 200) {
                let imgurl = res.data.data.imgUrl
                let imgObj = {
                    data: {
                        link: imgurl
                    }
                }
                info.success({
                    url: imgObj.data.link,
                    meta: {
                        id: 'xxx',
                        title: 'xxx',
                        alt: 'xxx',
                        loop: true, // 指定音视频是否循环播放
                        autoPlay: true, // 指定音视频是否自动播放
                        controls: true, // 指定音视频是否显示控制栏
                        poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                    }
                })
            } else {
            }
        }, err => {
            console.log('上传失败:' + err)
        })
    }
    //  校验不通过的媒体文件将不会被添加到媒体库中
    validateFn = (file) => {
        // return file.size < 1024 * 100 ? message.success("图片上传成功！") : message.warn("图片太大，请上传合适大小的图片！");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                file.size < 1024 * 100 ? resolve() : reject()
            }, 2000)
        })
    }
    // 指定媒体库允许选择的本地文件的MIME类型
    uploadAccepts = {
        image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
        video: 'video/mp4',
        audio: 'audio/mp3'
    }

    render() {
        const { editorState } = this.state
        return (
            <div>
                <BraftEditor
                    value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                    media={{ uploadFn: this.uploadFn }}
                />
            </div>
        )
    }
};


export default MqEditor;