// 递归复用

// 递归是吧问题分解为一系列相似的小问题,通过函数不断调用自身来解决这一个个小问题
// 知道满足结束条件,就完成了问题的求解

// TS的高级类型支持类型参数,可以做各种类型运算逻辑,返回新的类型,和函数调用时对应的
// 自然也支持递归

// TS类型系统不支持循环,但支持递归,当处理数量不固定的类型的时候,可以只处理一个类型
// 然后递归的调用自身处理下一个类型,直到结束条件也就是所有的类型都处理完了,就完成了不
// 确定数量的类型编程,达到循环的效果

// Promise的递归调用

// DeepPromiseValueType   我们先实现一个提取不确定层数的Promise中的value的高级类型
type ttt = Promise<Promise<Promise<Record<string,any>>>>

// 这里是3层Promise,value类型是索引类型
type DeepPromiseValueType<P extends Promise<unknown>> =
    P extends Promise<infer ValueType>
        ? ValueType extends Promise<unknown>
            ? DeepPromiseValueType<ValueType>
            : ValueType
        : never

// 类型参数P是待处理的Promise,通过extends约束为Promise类型.value类型不确定.设为unknown

// 每次只处理一个类型的提取.也就是通过模式匹配提取出value的类型到infer声明额局部变量ValueType中
// 然后判断如果ValueType依然是Promise类型,那就递归处理

// 结束条件就是ValueType不为Promise类型,那就处理完了所有的层数,返回这时的ValueType
// 这样,我们就提取到了最里层的Promise的value类型,也就是索引类型

type DeepPromiseResult = DeepPromiseValueType<Promise<Promise<Record<string,any>>>>


// 数组类型的递归 

// ReverseArr  

// 现有如下一个元祖类型 
type arr = [1,2,3,4,5]
// 我们将其翻转就是 [5,4,3,2,1]
type ArrReverse<Arr extends unknown[]> = Arr extends
    [infer One,infer Two,infer Three,infer Four,infer Five]
    ? [Five,Four,Three,Two,One]
    : []
type ArrReverseResult = ArrReverse<arr>

// 如果我们的数组长度不确定,就需要用递归来处理
type resusionArr<Arr extends unknown[]> = Arr extends
    [infer First, ...infer ArrRest]
    ? [...resusionArr<ArrRest>,First]
    : Arr
type resusionArrResult = resusionArr<[1,2,3,4,5,6,7,8,9]>
