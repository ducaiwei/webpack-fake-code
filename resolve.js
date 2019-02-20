/**
 * @file 查找模块所在绝对路径
 * @content 在引用模块的时候  往往是很简单的 比如用相对路径 比如用模块名(node_modules下) 所以，程序需要处理各种引用方式
 */
const fs = require('fs');
const path = require('path');
const co = require('co');
/**
 * @param {string} moduleIdentifier 模块标识
 * @param {string} context 上下文 入口js所在目录
 * @returns {*|Promise}
 */
module.exports = function(moduleIdentifier, context) {
    return co(function *() {
        let result;
        // 绝对路径
        if(path.isAbsolute(moduleIdentifier)) {
            result = yield statPromise(moduleIdentifier);
            return result;
        }
        // 相对路径或者模块在入口文件所在目录
        let allPath = path.resolve(context, moduleIdentifier);
        let ext = path.extname(moduleIdentifier);
        allPath += ext === '' ? '.js' : '';
        result = yield statPromise(allPath);
        if (result) {
            return result;
        }
        // node_modules目录下查找
        let absolutePath = path.resolve(context, './node_modules', moduleIdentifier);
        let ext = path.extname(moduleIdentifier);
        absolutePath += ext === '' ? '.js' : '';
        result = yield statPromise(absolutePath);
        return result;
        // TODO
    })
}
/**
 * 判断路径文件是否存在
 * @param {string} path
 * @returns {Promise}
 */
function statPromise(path) {
    return new  Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(stats && stats.isFile) {
                resolve(path);
                return;
            }
            resolve(false);
        })
    })
}
