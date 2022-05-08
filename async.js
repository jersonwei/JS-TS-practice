// 示例

const { reject } = require("async")

const getData = ()=> new Promise(resolve=>setTimeout(()=>{
    resolve('data')
},1000))

// async function test(){
//     const data = await getData()
//     console.log('data',data)
//     const data2 = await getData()
//     console.log('data2',data2)
//     return 'success'
// }

// 这样的一个函数,应该一秒后打印data,再过一秒打印data2,最后打印success
// test().then(res=>console.log(res))

// 思路 对于这样的一个函数,我们把它转换为generator函数会是怎样的
// function* testG(){
//     // await被编译成了yield
//     const data = yield getData()
//     console.log('data',data)
//     const data2 = yield getData()
//     console.log('data2',data2)
//     return 'success'
// }

/// 但是我们知道Generator函数是不会自动执行的 需要使用next手动执行
// 每次调用next方法,会停留在下一个yield的位置
// 利用这个特性,我们只要编写一个自动执行的函数,就可以然这个Generator函数完全实现async+await

// let result = function generatorToAsync(){
//     // await被编译成了yield
//     const data = yield getData()
//     console.log('data',data)
//     const data2 = yield getData()
//     console.log('data2',data2)
//     return 'success'
// }
// result.then(res=>console.log(res))

// 整体思路 generatorToAsync接受一个Generator函数,并且返回一个Promise对象



// 这里的先生成一个迭代器
// var datas = testG()
// 然后开始执行第一次next
// 第一次调用next方法,停留在第一个yield的位置
// 返回的promise里,包含了data需要的数据
// var datasPromise = datas.next()

// 这里返回了一个promise,就是第一次getData()所返回的promise 
// var data = yield getData()

// 这段代码要切割成左右两部分来看,第一次调用next,其实只停留在
// 了yiled getData()这里  data的值并没有确定
// 只有当下一次调用next的时候,传的参数会被作为上一个yield前面接受的值

// 也就是说,我们再次调用datas.next(这个参数才会被触发data变量)的时候
// data的值才会被确定为'这个参数才会被赋值给data变量

// 这也是迭代器函数设计的比较难得地方,对于这个题目我们的解决方法如下

function* testG(){
    // await被编译成了yield
    const data = yield getData()
    console.log('data',data)
    const data2 = yield getData()
    console.log('data2',data2)
    return 'success'
}

var gen = testG() 

var dataPromise = gen.next()

dataPromise.then(value1=>{
    // data1的value被拿到了,继续调用next并且传递给data
    var data2Promise = gen.next(value1)

    // console.log('data',data)
    // 此时就会打印出data的值

    data2Promise.value.then(value2=>{
        // data2的value拿到了,继续调用next并且传递value2
        gen.next(value2)

        // console.log('data2',data2)
        // 此时就会打印出data2
    })

})

//  上面的类似于回调地狱的场景就解决了我们的异步进程

//  最终实现
function generatorToAsync(generatorFn){
    // 返回一个新的函数
    return function(){
        // 先调用generator函数,生成迭代器
        // 对应 var gen = testG()
        const gen = generatorFn.apply(this,arguments)
        // 返回一个promise 因为外部使用.then的方式 
        // 或者await的方式去使用这个函数的返回值

        // var test = generatorToAsync(testG)
        // test().then(res=>console.log(res))

        return new Promise ((resolve,reject)=>{
            //  内部定义一个step函数,用来一步步的跨国yield的阻碍
            // key有next和throw两种取值,分别对应了gen的next和throw方法
            // arg参数则是用来把promis resolve出来的值交给下一个yield
            function step(key,arg){
                let generatorResult

                // 这个方法需要包裹在try catch中
                // 如果报错了 就把promise给reject掉,外部通过.catch可以获取到错误
                try {
                    generatorResult = gen[key](arg)
                } catch (error) {
                    return reject(error)
                }

                // gen.next() 得到的结果是一个{value,done}的结构
                const {value,done}  = generatorResult
                if(done){
                    // 如果已经完成了 就直接resolve这个promise
                    // 这个done是在最后一次调用next后才会为true
                    // 以本例来说 此时我们的结果是 {done:true,value:'success}
                    // 这个value也就是generator函数最后的返回值
                    return resolve(value)
                }else{
                    // 除了最后结束的时候外,每次调用gen.next()
                    // 其实是返回{value:Promise,done:false}的结构
                    // 这里要注意的是Promise.resolve可以接收一个promise为参数
                    // 并且这个promise参数被resolve的时候,这个then才会被调用
                    return Promise.resolve(
                    //  这里的value对应的是yield后面的promise    
                        value)
                    .then(
                    // value这个promise被resolve的时候,就会执行next
                    // 并且只要done不是true的时候,就会递归的网下解开promise
                    // 对应的gen.next().value.then(value=>{
                    // gen.next(

                    // 此时done为true了, 整个promise被resolve 
                    // 最外部的test().then(res=>console.log(res))的then就开始执行了

                    // })
                    // })
                    function onResolve(val){
                        step('next',val)
                    },
                    // 如果Promise被reject了 就在此进入step函数
                    // 不同的是,这次的try catch中调用的是gen.throw(err)
                    // 那么自然就被catch到,然后把promise给reject掉了
                    function onRejecet(err){
                        step('throw',err)
                    }
                    // val=> step('next',val),err=>step('throw',err))
                )
                }
            }
            step('next')
        })
    }

}