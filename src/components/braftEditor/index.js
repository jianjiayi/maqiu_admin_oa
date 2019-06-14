import React, { Component } from 'react';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import './index.less';
import Axios from 'axios'


class MqEditor extends Component{
    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    }
 
    async componentDidMount() {
        // 假设此处从服务端获取html格式的编辑器内容
        const htmlContent = 'Hello World!'
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
        this.setState({
            editorState: BraftEditor.createEditorState(htmlContent)
        })
    }
 
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        // const result = await saveEditorContent(htmlContent)
    }
 
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    uploadFn = (param) => {

        const serverURL = 'http://localhost:3000/upload/file'
        const xhr = new XMLHttpRequest
        const fd = new FormData()
      
        const successFn = (response) => {
          // 假设服务端直接返回文件上传后的地址
          // 上传成功后调用param.success并传入上传后的文件地址
          console.log(xhr.responseText)
          param.success({
            url: xhr.responseText.data
          })
        }
      
        const progressFn = (event) => {
          // 上传进度发生变化时调用param.progress
          param.progress(event.loaded / event.total * 100)
        }
      
        const errorFn = (response) => {
          // 上传发生错误时调用param.error
          param.error({
            msg: 'unable to upload.'
          })
        }
      
        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
      
        fd.append('file', param.file)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)
      
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
    // 上传千牛
    // uploadFn = (param) => {
    //     const token = 'HhUn8qmWzyd2im3VicF18d32zFB14OL142IxJafU:Va2RRYOz2tQXYWVdoJ4dfU92U9c=:eyJzY29wZSI6InN0YXRpYy1pbWFnZSIsImRlYWRsaW5lIjoxNTQ0NDYyMTk1fQ=='
    //     const putExtra = {
    //     }
    //     const config = {
    //     }
    //     const observer = {
    //         next(res) {
    //             param.progress(res.total.percent)
    //         },
    //         error(err) {
    //             param.error({
    //                 msg: err.message
    //             })
    //         },
    //         complete(res) {
    //             param.success({
    //                 url: 'http://pjid0qjkn.bkt.clouddn.com/' + res.key
    //             })
    //         }
    //     }
    //     qiniu.upload(param.file, param.name, token, putExtra, config).subscribe(observer)
    // }

    render() {
        const { editorState } = this.state
        return (
            <div className="my-component">
                <BraftEditor
                    height={0}
                    controls={
                        [
                            'indent', 
                            'text-color', //颜色
                            'bold', //加错
                            'italic', 
                            'underline', 
                            'strike-through',
                            'superscript', 
                            'subscript', 
                            'remove-styles', 
                            'emoji',  //表情
                            'media',//媒体文件
                            'font-family', //字体
                            'split', 
                            'font-size',  //字体大小
                            'line-height', //行高
                            'letter-spacing',//字间距
                            'headings', //常规
                            'text-align', //对齐
                            'split', 
                            'list_ul',
                            'list_ol', 
                            'blockquote', //引用
                            'code', //片段
                            'split', 
                            'link', //链接
                            'split', 
                            'hr', //水平线
                            'split', 
                            'undo',//向前
                            'redo',//向后
                            'clear',//清除
                        ]
                    }
                    fontFamilies={
                        [
                            {
                                name: '宋体',
                                family: '"宋体",sans-serif'
                            }, {
                                name: '黑体',
                                family: '"黑体",serif'
                            }, {
                                name: '隶书',
                                family: '隶书'
                            },
                            {
                                name: '微软雅黑',
                                family: '微软雅黑'
                            },
                            {
                                name: '楷体',
                                family: '楷体'
                            },
                            {
                                name: 'Impact',
                                family: 'Impact,Charcoal'
                            }, {
                                name: 'Monospace',
                                family: '"Courier New", Courier, monospace'
                            }, {
                                name: 'Tahoma',
                                family: "tahoma, 'Hiragino Sans GB', sans-serif"
                            }]
                    }
                    media={{
                        uploadFn: (info) => {
                            let formData = new window.FormData()
                            formData.append('file', info.file, info.file.name)
                            Axios({
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                },
                                method: 'post',
                                data: formData,
                                url: 'http://39.97.108.64:3000/upload/file'
                            }).then(res => {
                                if (res.data.code === 200) {
                                    console.log(res.data)
                                    let imgurl = res.data.data.imgUrl
                                    let imgObj = {
                                        data: {
                                            link: imgurl
                                        }
                                    }
                                    info.success({
                                        url: imgObj.data.link
                                        // meta: {
                                        //   id: 'xxx',
                                        //   title: 'xxx',
                                        //   alt: 'xxx',
                                        //   loop: true, // 指定音视频是否循环播放
                                        //   autoPlay: true, // 指定音视频是否自动播放
                                        //   controls: true, // 指定音视频是否显示控制栏
                                        //   poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                                        // }
                                    })
                                } else {
                                }
                            }, err => {
                            })
                        }
                    }}
                />
            </div>
        )
    }

    
};


export default MqEditor;