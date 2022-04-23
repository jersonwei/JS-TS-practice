//  多个计算符的考察

let  a = 0
let  b = 1
let  c = b.value?.v

a ||= 10;       // a = a || 10   a = 0  所以会取10
b &&= 2 ;       // b = b &&  2   b = 1  所以取 2
c ??= 5;        // c = c ??  5   

console.log(a + b + c)  // 17

//  短路运算  可选链操作符  有值继续运行否则返回undefined

//   可选链的应用场景
const res = await fn()

if(res && res.data && res.data.list ){
    //  业务逻辑
}

if(res?.data?.list){
    // 业务逻辑
}

// ?? 与 || 运算符 空值合并运算符
p1 ?? p2 

let p1 = null || 1
let p2 = null ?? 1
//  ??  => 只会把null和undefined当成false 对于空值的判断逻辑更严密一些
//  ||  => 会把null和undefined,'',0等当成false