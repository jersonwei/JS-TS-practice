//  函数柯里化

//  const foo = function(...args){}

// foo(1,2,3) == 6  true
// foo(1)(2,3) == 6 true
// foo(1)(2)(3)(4) == 10  true

function curry(args){
    return args.reduce((pre,cur)=>{
        return pre + cur
    },0)
}

function foo(...args1){
    let sum1 = curry(args1)

    function fn(...args2){
        let sum2 = curry(args2)
        return foo(sum1 + sum2)  // 结果需要将所有的实参进行求和,需要进行递归求值
    }
    // 核心内容 因为最终涉及到与数字的等号运算
    fn.toString=()=>{
        return sum1
    }
    // 连续调用所以要返回该函数
    return fn
}

foo(1)(2)(3)(4) == 10