let length = 1
function fn(){
    console.log(this.length)
}

let obj = {
    length:100,
    action:function(callback){

        callback() // fn() 相当于window.fn()  this.length = 1

        // arguments = [fn,1,2,3,4]  此处的fn的载体是在arguments中 类数组也有length属性
        arguments[0]()  // 5

        let foo = arguments[0]  // 相当于把fn的地址赋值给foo 同样相当于window.foo()

        foo()   // 1 

        this.foo2 = arguments[0] //  这里是吧fn赋值给了obj.foo2属性,是挂载在obj中的

        this.foo2()  //  this.length = 100 
    }
}

let arr1 = [1,2,3,4]
obj.action(fn,...arr1)