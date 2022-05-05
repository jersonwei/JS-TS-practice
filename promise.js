//  场景 前端页面中需要同时发送20个请求,但是服务端有限制需要前端控制并发数
// 保证最多只能同时发送10个请求

// 要求
// 1- 最多同时执行的任务数量为10个
// 2-当前任务执行完成后 释放队列空间 自动执行下一个任务
// 3-所有任务添加到任务队列后 自动开始执行任务

//  创建任务的函数
function createTask(i){
    return ()=>{
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(i)
            },2000)
        })
    }
}
// 定义任务对象 以及任务方法的类
class TaskQueue{
    constructor(){
        this.taskList = [] // 存储任务的数组
        this.max = 10  // 最大并发数
        setTimeout(()=>{
            this.run()   //  异步调用  在所有的任务加入到队列后会自动开始执行所有热任务
        }
        )
    }
    addTask(task){
        this.taskList.push(task)  //  收集任务
    }
    run(){
        const length = this.taskList.length  //  记录任务队列中任务的个数
        if(!length){
            return  // 没有任务直接返回
        }
        const min = Math.min(length,this.max)  // 保证最大任务数在10以内
       for (let i = 0; i < min; i++) {
           //  开始执行任务
           // 每次执行任务就释放一个任务空间
           this.max--
           const task = this.taskList.shift()  //  队列的先进先出取出最早的任务
           task().then(res=>{   //  调用成功时执行
               console.log(res)
           }).catch(err=>{                                            //  失败时也需要捕捉
               console.log(err)
           }).finally(() => {       //  无论成功失败都需要记录并操作任务数
               this.max++  //  填补任务空间 保持始终有10个任务
               this.run()  //  自动执行下一个任务
           })
       }
    }
}

const taskObj = new TaskQueue()

// 生成任务
for (let i = 0; i <20; i++) {
    const task = createTask(i)
    //  将任务添加到方法中
    taskObj.addTask(task)
}

createTask(20)













