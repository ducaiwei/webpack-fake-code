/**
 * @file 解析模块包含的依赖
 * @content 使用esprima将模块文件解析成AST,然后逐个语句遍历，找到该模块依赖哪些模块
 */
const esprima = require('esprima');
/**
 * 解析模块包含的依赖
 * @param {string} source 模块内容字符串
 * @returns {{}} 解析模块得出的依赖关系
 */
module.exports = (source) => {
    let ast = esprima.parse(source, {range: true});
    let module = {};
}
/**
 * 遍历模块的语句
 * @param {object} module  模块对象
 * @param  {object} statement AST语法树
 */
let walkStatements = (module, statements) => {
    statements.forEach(statement => walkStatement(module, statement));
}
/**
 * 分析每一条语句
 * @param {object} module  模块对象
 * @param  {object} statement AST语法树
 */
let walkStatement = (module, statement) => {
    switch (statement.type) {
        case 'VariableDeclaration':
            if(statement.declarations) {
                walkVariableDeclarators(module, statement.declarations)
            }
            break;
        default:
            break;
    }
}
/**
 * 处理定义变量语句
 */
let walkVariableDeclarators = (module, declarators) => {
    declarators.forEach(declarator => {
        switch(declarator.type){
            case 'VariableDeclarator':
                if(declarator.init) {
                    walkExpression(module, declarator.init)
                }
                break;
        }

    });
}
/**
 * 处理表达式
 * @param {Object} module 
 * @param {Object} expression 
 */
let walkExpression = (module, expression) => {
    switch (expression.type) {
        case 'CallExpression':
            if(expression.callee && expression.callee.name === 'require' && expression.callee.type === 'Identifier' &&
            expression.arguments && expression.arguments.length === 1) {
                module.requires = module.requires || [];
                let param = Array.from(expression.arguments)[0];
                module.requires.push({
                    name: param.value,
                    nameRange: param.range
                })
            }
            break;
    
        default:
            break;
    }
}
