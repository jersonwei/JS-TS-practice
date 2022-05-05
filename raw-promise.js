let p1 = new Promise((resolve,reject)=>{
    resolve('成功')
    reject('失败')
})
console.log(p1)

let p2 = new Promise((resolve,reject)=>{
    reject('失败')
    resolve('成功')
})
console.log(p2)
let p3 = new Promise((resolve,reject)=>{
    throw(new Error('抛出错误'))
})
console.log(p3)

class MyPromise {
    // 构造方法
    constructor(executor){
        // 初始化值
        this.initValue()
        // 初始化this指向
        this.initBind()
        // 执行传进来的函数  

        //  模拟throw 需要用try catch 包裹
        try {
            executor(this.resolve,this.reject)
        } catch (error) {
            // 6 处理错误时直接转到reject
            this.reject(error)
        }
    }
    initBind(){
        // 1 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    initValue(){
        // 2 初始化值
        this.PromiseState = 'pending' // 状态
        this.PromiseResult = null     // 终值
        this.onFulfilledCallbacks = []  // 8 保存成功回调
        this.onRejectedCallbacks = []  // 保存失败回调
    }

    resolve(value){
        // 不是pending 就直接返回
        if(this.PromiseState !== 'pending') return
        // 3 如果执行resolve 状态变为fullfilled
        this.PromiseState = 'fullfilled'
        // 终值为传进来的值
        this.PromiseResult = value

        // 9 执行保存的成功回调
        while(this.onFulfilledCallbacks.length){
            this.onFulfilledCallbacks.shift()(this.PromiseResult)
        }
    }

    reject(reason){
        // 5 不是pending 就直接返回
        if(this.PromiseState !== 'pending') return
        // 4 如果执行reject 状态变为reject
        this.PromiseState = 'rejected'
        // 终值 也是传进来的值
        this.PromiseResult = reason
        // 抛出Promise错误
        // throw (new)

        // 执行保存的失败回调
        while(this.onRejectedCallbacks.length){
            this.onRejectedCallbacks.shift()(this.PromiseResult)
        }
    }
    
    then(onFulfilled,onRejected){
        // 接收两个回调函数 onFulfilled  onRejected

        //  参数校验  确保一定是函数
        onFulfilled = typeof onFulfilled === 'function'? onFulfilled : val => val

        onRejected =  typeof onRejected === 'function' ? onRejected : reason => {throw(reason)}  

        var thenPromise = new MyPromise((resolve,reject)=>{
            setTimeout(() => {
                const resolvePromise = cb =>{
                    try {
                        const x = cb(this.PromiseResult)
                        if(x === thenPromise){
                        // 不能返回自身
                        throw new Error('不能返回自身...')
                    }
                    if(x instanceof MyPromise){
                        // 如果返回值是Promise
                        // 如果返回值是promise对象,返回值为成功,新promise就是成功
                        // 如果返回值是promise对象,返回值是失败,新promise就是失败
                        // 只有then知道返回的promise是成功还是失败
                        x.then(resolve,reject)
                    }else{
                        // 非Promise就直接成功
                        resolve(x)
                    }
                } catch (error) {
                    reject(error)
                    throw new Error(error)
                }
            }
            })
            
            if(this.PromiseState === 'fulfilled'){
            // 如果当前状态为成功状态,执行第一个回调
            onFulfilled(this.PromiseResult)
        }else if(this.PromiseState === 'rejected'){
            // 状态为失败执行第二个回调
            onRejected(this.PromiseResult)
            // 7 前两个功能实现完成
        }else if(this.PromiseState === 'pending'){
            // 10 当值为pending时存储对应的回调,并绑定this
            this.onFulfilledCallbacks.push(onFulfilled.bind(this))
            this.onRejectedCallbacks.push(onRejected.bind(this))
        }
    })
        // 返回这个包装的promise
        return thenPromise
    }

    static all(PromiseArr){
        const result = []
        let count = 0
        return new MyPromise((resolve,reject)=>{
            const addData = (index,value) => {
                result[index] = value
                count++
                if(count === PromiseArr.length) resolve(result)
             }

             PromiseArr.forEach((promise,index) => {
                 if(promise instanceof MyPromise){
                     promise.then(res =>{
                         addData(index,res)
                     },err=>reject(err))
                 }else{
                     addData(index,promise)
                 }
             });
        })
    }

    static race(PromiseArr){
        return new Promise((resolve,reject)=>{
            PromiseArr.forEach(promise=>{
                if(promise instanceof MyPromise){
                    promise.then(res=>{
                        resolve(res)
                    },err=>{
                        reject(err)
                    })
                }else{
                    resolve(promise)
                }
            })
        })
    }

    static allSetttled(PromiseArr){
        return new Promise((resolve,reject)=>{
            const res = []
            let count = 0
            const addData = (status,value,i)=>{
                res[i] = {
                    status,
                    value
                }
                count++
                if(count === PromiseArr.length){
                    resolve(res)
                }
            }
            PromiseArr.forEach((promise,i)=>{
                if(promise instanceof MyPromise){
                    promise.then(res=>{
                        addData('fulfilled',res,i)
                    },err=>{
                        addData('rejected',err,i)
                    })
                }else{
                    addData('fulfilled',promise,i)
                }
            })
        })
    }

    static any(PromiseArr){
        return new Promise((resolve,reject)=>{
            let count = 0
            PromiseArr.forEach(promise=>{
                promise.then(val=>{
                    resolve(val)
                },err=>{
                    count++
                    if(count === PromiseArr.length){
                        reject(new AggregateError('All promise were rejected'))
                    }
                })
            })
        })
    }
}

//  测试链式调用then
const l1 = new Promise((resolve,reject)=>{
    resolve(100)  // 输出状态: 成功 值:200
    // reject(100)  // 输出 状态成功 值300
}).then(res=>2*res,err=>3*err)
.then(res=>console.log('成功',res),err=>console.log('失败',err))

const test1 = new MyPromise((resolve,reject)=>{
    resolve('成功')
})

const test2 = new MyPromise((resolve,reject)=>{
    reject('shib')
})

console.log(test1,test2)


// 目前为止上面只是一个基本函数,比如Promise的状态不可变就没解决

// 我们只需要在两个方法加个判断就好了 如果状态不是pending就直接返回

// 继续优化 再promise中使用throw等同于reject 这时候就要使用try catch了

// .then方法的调用 示例如下

//  立即输出成功
const s1 = new Promise((resolve,reject)=>{
    resolve('成功')
}).then(res=>console.log(res),err=>console.log(err))

// 1秒后输出失败
const s2 = new Promise((resolve,reject)=>{
    setTimeout(() => {
        reject('失败')
    },1000)
}).then(res=>console.log(res),err=>{console.log(err)})

// 

const s3 = new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('成功')
    },1000)
}).then(res=>console.log(res),err=>{console.log(err)})
.then(res=>console.log(res),err=>console.log(err))

// 总结如下 

// 1  then接收两个回调,一个是成功回调,一个是失败回调
// 2  当Promise状态为fulfilled执行成功回调,为rejecetd执行失败回调
// 3  如resolve或reject在定时器里,则定时器结束后再执行then
// 4  then支持链式调用,下一次then执行受上一次then返回值的影响

// 定时器情况  我们不能保证1秒后才执行then函数,但是我们可以保证1秒后执行then里面的
// 回调,在定时器中 我们需要将我们的两个回调存储起来,1秒后根据对应的状态执行不同的回到

// 链式调用 then支持链式调用,下次执行受上一次返回值的影响
const s5 = new Promise((resolve,reject)=>{
    resolve(100)
}).then(res=> 2* res,err=>console.log(err))
.then(res=>console.log(res),err=>console.log(err))

const s6 = new Promise((resolve,reject)=>{
    resolve(100)
}).then(res=> new Promise((resolve,reject)=>resolve(3*res)),err=>console.log(err))
.then(res=>console.log(res),err=>console.log(err))

// 从上面的例子 我们可以知道
// 1. then方法本身会返会一个新的Promise对象
// 2. 如果返回值是promise对象,返回值为成功,新promise就是成功
// 3. 如果返回值是promise对象,返回值为失败,新promise就是失败
// 4. 如果返回值非promise对象,新promise对象就是成功,值为此返回值

// 我们知道then是Promise上的方法,那我们如何实现then完之后还能继续then呢,只需要返回一个Promise对象即可

//  微任务  我们知道then是微任务
const p = new Promise((resolve,reject)=>{
    resolve(1)
}).then(res=>console.log(res),err=>console.log(err))
console.log(2)

// 输出顺序为 2,1

// 我们只需要让resolvePromise函数异步执行就可以了  可以用定时器模拟

// all  
// 1. 接受一个Promise数组,数组中如果有非Promise项,则此项当做成功
// 2.如果所有Promise都成功,则返回成功结果数组
// 3.如果有一个Promise失败,则返回这个失败结果