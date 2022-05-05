const entry = {
    a:{
        b:{
            c:{
                dd:'abcdd'
            }
        },
        d:{
            ee:'adee'
        },
        f:'af'
  }
}
// 要求转换成如下对象
// const output = { 
//     'a.b.c.dd': 'abcdd',
//     'a.d.ee':'adee',
//     'a.f' : 'af'
// }
// 方法一:递归
// 每次处理一层结构,通过判断属性的值是否是对象来确定递归是否结束
// 如果是对象 表示没有结束 递归调用
// 如果不是对象 表示到递归最后一层 确定属性值
function treeToOnline(obj,preKey='',result ={}){
    // 遍历对象 
    for (const key in obj) {
        // 判断对象中的属性是否是它自身的属性
        if( obj.hasOwnProperty(key)){
            const newKey = `${preKey}${key}`
            // 再判断该属性是否是对象
            if(typeof obj[key] === 'object'){
                treeToOnline(obj[key],`${newKey}.`,result  )
            }
            else{
            //不是对象代表递归执行完毕
            result[newKey] = obj[key]   
            }
        }     
    }
    return result
}
console.log(treeToOnline(entry))
