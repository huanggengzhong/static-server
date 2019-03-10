// 导入模块
// 内置模块 http
const http = require('http');
// 内置模块 fs
const fs = require('fs');
// 内置模块 path
const path = require('path');

// 第三方模块 mime
const mime = require('mime');

// 根目录 绝对路径 拼接路径
let rootPath = path.join(__dirname, 'www');

// 创建服务器
let server = http.createServer((req, res) => {
    // 请求过来之后执行的代码
    // 根据请求的url 生成一个完整的路径
    let fullPath = path.join(rootPath, req.url);

    // 路径是否存在
    if (fs.existsSync(fullPath) == true) {
        // 存在
        // fsStatus的对象
        let fsStatus = fs.statSync(fullPath);
        // 是不是文件
        if (fsStatus.isFile() == true) {
            // 文件
            // 读取 设置content-type 返回
            fs.readFile(fullPath, (err, data) => {
                // 设置content-type
                res.setHeader('content-type', mime.getType(fullPath));
                // 返回
                res.end(data);
            })
        }
        // 是不是文件夹
        else if (fsStatus.isDirectory() == true) {
            // 文件夹
            // 获取文件夹内部信息
            let liList = fs.readdirSync(fullPath);
            // 定义拼接的字符串
            let liStr = '';
            // 根目录
            if (req.url == '/') {
                liList.forEach(v => {
                    liStr += `<li><a href="${v}">${v}</a></li>`
                })
            } else {
                // 额外的拼接返回上一级
                liStr += `<li><a href="javascript:window.history.back()">上一级</a></li>`
                // 次级目录
                liList.forEach(v => {
                    liStr += `<li><a href="${req.url+'/'+v}">${v}</a></li>`
                })

            }
            // 返回
            res.end(`
            <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
            <html>
             <head>
              <meta charset="UTF-8">
              <title>Index of ${req.url}</title>
             </head>
             <body>
            <h1>Index of ${req.url}</h1>
            <ul>
                    ${liStr}
            </ul>
            </body></html>
            `)
        }

    } else {
        // 不存在
        res.end(`
                <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
                    <html><head>
                    <title>404 Not Found</title>
                    </head><body>
                <h1>Not Found</h1>
                <p>The requested URL ${req.url} was not found on this server.</p>
                </body></html>
        `)

    }

})


// 开启监听
server.listen(8080, () => {
    console.log('success:服务器开启成功啦');
})