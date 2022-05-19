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

//   第三题 深拷贝
// const obj1 = {
//     name:'zs',
//     gender:{
//         age:12,
//         sex:'男',
//         d:/aa/,
//         e:new Date()
//     },
//     c:/a/,
//     d:null,
//     e:[1,2,3],
//     dom:div

// }
// obj1.obj1 = obj1
// const sym = Symbol('sym')
// obj1[sym] = '123'

// function deepClone(obj1,hash=new WeakMap()){ // 额外开辟一个存储空间来存储当前对象和拷贝对象的对应关系
//     // 基础数据类型或者null直接返回
//     if(obj1 === null || typeof obj1 !== 'object'){
//         return obj1
//     }
//     // 处理正则
//     if(obj1 instanceof RegExp){
//         return new RegExp(obj1)
//     }
//     // 处理日期对象
//     if(obj1 instanceof Date){
//         return new Date(obj1)
//     }
//     // 处理DOM元素的拷贝
//     if(obj1 instanceof HTMLElement){
//         return obj1
//     }
//     // let res
//     // if(obj1 instanceof Array){
//     //     res = []
//     // }else{
//     //     res = {}
//     // }

//     if(hash[obj1]){
//         // 当需要拷贝当前对象时,先去存储空间中找,如果有的话直接返回
//         return hash[obj1]
//     }

//     //  创建一个新的克隆对象或者克隆数组
//     const res = new obj1.constructor()

//     hash[obj1] = res  // 如果存储空间中没有就存进存储空间hash里

//     // for (const key in obj1) {
//     //         res[key] = deepClone(obj1[key])
//     // }

//     // 处理 Symbol作为键  使用Reflect.ownKeys方法
//     // 返回一个由目标对象自身的属性键组成的数组,它的返回值等同于
//     // Object.getOwnPropertyNames(obj1).concat(Object.getOwnPropertySymbols(obj1))
//     Reflect.ownKeys(obj1).forEach(key=>{
//         res[key] = deepClone(obj1[key],hash)
//     })

//     return res
// }

// console.log('新的',deepClone(obj1))
// console.log('旧的',obj1)

    //  第三题对象深克隆
// const obj3 = {
//     a:'123',
//     b:{
//         c:'234'
//     },
//     d:null,
//     e:new Date(),
//     g:/asd/
// }
// // 循环引用
// obj3.obj3 = obj3
// const sym = Symbol(['sym'])
// obj3[sym] = 'symbol'

// function deepClone2(obj,hash=new WeakMap()){
//     // 基本类型数据返回
//     if(typeof obj !== 'object'){
//         return obj
//     }
//     // null 返回
//     if(obj === null){
//         return null
//     }
//     // 区分 Date对象
//     if(obj instanceof Date){
//         return new Date(obj)
//     }
//     // 区分 正则表达式
//     if(obj instanceof RegExp){
//         return new RegExp(obj)
//     }
//     //  存储对象引用
//     //  当需要找到引用对象时先从存储对象中找
//     if(hash[obj]){
//        return hash[obj] 
//     }
//     // 初始化返回对象
//     const newobj = new obj.constructor()

//     hash[obj] = newobj
//     // 使用Reflect.ownkeys 返回object的所有属性组成的数组
//     // for (const key in obj) {
//     //             newobj[key] = deepClone2(obj[key])
//     // }
//     Reflect.ownKeys(obj).forEach(key => {
//         newobj[key] = deepClone2(obj[key],hash)
//     });
//     return newobj
// }
// console.log('新的',deepClone2(obj3))
// console.log('旧的',obj3)








