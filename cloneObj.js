//       浅克隆
const  obj = {
    age:12,
    name:{d:'sx'},
    gender:0
}
//  方法一
function shallowClone(obj){
    for (const key in obj) {
        if(obj.hasOwnProperty(key)){
            result[key] = obj[key]
        }    
    }
    return result
}
const result = shallowClone(obj)
obj.name.d = 'zs'
console.log(obj,result)

// 方法二
const result2 = Object.assign({},obj)
obj.name.d = 'sss'
console.log(obj,result2)


// 方法三
const obj2 = {name:{age:8}}
const result3 = {...obj2}
obj2.name.age = 10
console.log(result3,obj2)


//          深克隆

// 方法一
const objs = {name:{age:1}}
const results = JSON.parse(JSON.stringify(objs))
objs.name.age = 12
console.log(objs,results)

// 优点很方便

// 缺点

// 1 -值为Function,Symbol,undefined,key为Symbol 序列化后会丢失
// 2 -对象存在循环引用会报错
// 3 -Date对象,序列化后会变为字符串
// 4 - RegExp,Error对象.序列化后会得到空对象
// 5 -NaN,infinity,-infinity序列化的结果会变成null
// 6 -序列化只会处理对象的可枚举的自由属性

// 方法二  递归循环
// function deepClone(){
//     let newObj = Array.isArray(obj) ? []:{}
//     if(obj && typeof obj === 'object'){
//         for (const key in newObj) {
//             if (Object.hasOwnProperty.call(obj, key)) {
//                 newObj[key] = (obj && typeof obj[key] === 'object')
//                  ? deepClone(obj[key]) : obj[key]
//             }
//         }
//     }
//     return newObj
// }


function deepClone(obj){
    let newObj = Array.isArray(obj) ? [] : {}
    if(obj && typeof obj === 'object'){
        for (const key in newObj) {
            if(obj.hasOwnProperty(key)){
                newObj[key] = (obj && typeof obj[key] === 'object')
                ? deepClone(obj[key])
                : obj[key]
            }
        }
    }
    return newObj
}

// 优点  
// 独立性: 通过递归,深度复制每个属性值
// 正确性: 直接赋值,没有经过转化

// 缺点

// 1. 完整性, 其它对线类型都没有考虑,如Date,RegExp 
// 2. 没考虑递归爆栈
// 3 没考虑循环引用










