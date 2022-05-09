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


// Includes  既然递归可以做循环用,那么查找元素这种自然也可以实现
// 比如查找[1,2,3,4,5]中是否存在4,是就返回true,否则就返回false

type FindInArr<Arr extends unknown[],FindItem> = Arr extends
    [infer First, ...infer Rest] 
    ? IsEqual<First, FindItem> extends true
        ? true 
        : FindInArr<Rest, FindItem>
    : false

type IsEqual<A,B> = (A extends B ? true : false)
   & (B extends A ? true : false)

// 类型参数Arr是待查找的数组类型,元素类型任意,也就是unknown,FindItem待查找的元素类型

// 每次提取一个元素到infer声明的局部变量First中,剩余的放到局部变量Rest

// 判断First是否是要继续查找的元素,也就是和FindItem相等,是的话就返回true,否则递归判断下一个

// 直到结束条件也就是提取不出下一个元素,这时返回false

// 相等的判断就是A是B的子类型,并且B也是A的子类型,这就就完成了不确定长度的递归循环

type IncludesResult1 = FindInArr<[1,2,3,4,5],4>

type IncludesResult2 = FindInArr<[1,2,3,4,5],6>

// RemoveItem  可以查找自然就可以删除,只需要改下返回结果,构造一个新的数组返回

type RemoveInArr<
    Arr extends unknown[],
    RemoveItem,
    ResultArr extends unknown[] = []> = Arr extends
    [infer First, ...infer Rest]
    ? IsEqual2<First,RemoveItem> extends true
        ? RemoveInArr<Rest,RemoveItem,ResultArr>
        : RemoveInArr<Rest,RemoveItem,[...ResultArr, First]>
    : ResultArr

type IsEqual2<A,B> = (A extends B ? true : false) & (B extends A ? true : false)

// 类型参数Arr是待处理的数组,元素类型任意,也就是unknown[],类型参数Item为待查找的元素类型
// 类型参数ResultArr是构造出来的新数组,默认值是[]

// 通过模式匹配提取数组中的一个元素的类型,如果是Item类型的话就删除,
// 也就是不放入构造的新数组,直接返回之前的Result

// 否则放入构造的新数组,也就是再构造一个新的数组[...Result.First]
// 直到模式匹配不再满足,也就是处理完了所有的元素,返回这时候的Result

type RemoveInArrResult = RemoveInArr<[1,2,2,3,4,5],2>

// BuildArray 当我们构造数组的时候,也可以使用递归
// 比如传入5和元素类型,构造一个长度为5的该元素类型构成的数组

type BuildArray <Length extends number,
     Ele extends unknown,
     Arr extends unknown[]> = Arr['length'] extends Length
     ? Arr 
     : BuildArray<Length,Ele,[...Arr, Ele]>
    
// 类型参数Length为数组长度,约束为number,类型参数Ele为元素类型 默认值为unknown
// 类型参数Arr为构造出的数组,默认值为[]

// 每次判断下Arr的长度是否到了Length,是的话就返回Arr,否则在Arr上加一个元素,然后递归构造


// 字符串类型的递归

// ReplaceAll  

type ReplaceAll <Str extends string,
                From extends string,
                To extends string>
                = Str extends `${infer Prefix}${From}${infer Suffix}`
                ? `${Prefix}${To}${Suffix}`
                : Str

type ReplaceAllResult = ReplaceAll<'xqw','x','w'>

// 但是这里只能处理一个字符的替换,如果要替换多个就要递归替换
type ReplaceAll2< Str extends string,
                  From extends string,
                  To extends string> = Str extends
                  `${infer Left}${From}${infer Right}`
                  ? `${Left}${To}${ReplaceAll2<Right,From,To>}`
                  : Str

    // 类型参数Str是待处理的字符串类型,From是待替换的字符,To是替换到的字符
    // 通过模式匹配提取From左右的字符串到infer声明的局部变量Left和Right里,

    // 用Left和To构造新的字符串,剩余的Right部分继续递归的替换

    // 结束条件是不再满足模式匹配,也就是没有要替换的元素,这是就直接返回字符串Str

    type ReplaceAll2Result = ReplaceAll2<'xxxxssss','s','w'> 
            