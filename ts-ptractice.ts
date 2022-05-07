/**
 * TS类型系统中的类型
    静态类型系统的目的是把类型检查ongoing运行时提前到
    编译时,那TS类型系统中肯定要把JS的运行时类型拿过来
    也就是number,boolean,string,object,bigint,symbol
    undefined.null这些类型,还有就是他们的包装类型Numner
    Boolean,String,Object.Symbol

    复合类型方面,JS有Class,Array这些ts也支持.但是又多了
    三种类型.元组(Tuple)接口(Interface)枚举(Enum)
*/

// 元祖 就是元素个数和类型固定的数组类型
type Tuple = [number,string]

// 接口  可以描述函数.对象.构造器的结构
// 对象
type Ipersons = {
    name:string
    age:number
}
interface Ipersons2{
    name:string
    age:number
}
class Person implements Ipersons {
    name:string
    age:number
}

const obj9:Ipersons = {
    name:'asdad',
    age:656
}

// 函数

type SayHello = {
    (name:string):string
}

const func: SayHello = (name:string) =>{
    return 'hello' + name
}

// 构造器
type PersonConsructor = {
    new (name:string,age:number):Ipersons
}

function createPerson(ctor:PersonConsructor):Ipersons{
    return new ctor('gang',10)
}

// 对象类型,class类型在TypeScript里也叫做索引类型,也就是索引了多个
// 元素的类型的意思,对象可以动态添加属性,如果不知道会有什么属性
// 也可以用索引签名
interface Iperson3 {
    [prop:string]:string|number
}

const obj2:Iperson3 = {}
obj.name = 'asdasd'
obj.age=12312


//  总之接口可以用来描述函数,构造器.索引类型等符合类型

// 枚举 是一系列值的整合
enum Transpiler {
    Webpack ='webpack',
    rollup = 'rollup',
    vite='vite',
    npm ='npm',
    yarn='yarn',
    pnpm='pnpm'
}

const transpiler = Transpiler.yarn
// 除此之外,TypeScript还支持字面量类型.也就是类似111,'aaaa',{a:"1"}
// 其中.字符串的字面量类型有两种.一钟是普通的字符串字面量

// 一种是普通的字符串字面量 比如 'aaa'

// 另一种是模板字面量 比如 aaa${string} 他的意思是以aaa开头
// 后面是任意string的字符串字面量类型

// 所以想要约束以某个字符串开头的字符串字面量类型时可以这样写

function fn1(str:`#${string}`){

}
fn1('#aaa')
fn1('#asd')
// 还有四种特殊的类型 void never any unknown 

// void 代表为空.可以是null或者undefined 一般是用于函数返回值

// any是任意类型,任何类型都可以赋值给他,它也可以赋值给任何类型(除了never)

// unknown是未知类型.任何类型都可以赋值给它,他可以赋值给任何类型(除了never)

// never代表不可达 比如函数抛异常的时候 返回值就是never

// 以上就是TS类型系统的所有类型了



/**     类型装饰
 *    除了描述类型的结构外,TS的类型系统还支持描述类型的属性
 *     比如是都可选.是否可读等
 */

interface Iperson4 {
    readonly name:string
    age?:number
}

type tuple = [string,number]


// TS类型系统中的类型运算

// 条件 extends?: 
// TS中的条件判断是 extends?: 叫做条件类型(ConditionalType)

type res = 1 extends 2?true:false  // 类型为false

// 这就是TS类型系统的if else
// 但是 上面这样的逻辑没啥意义,静态的值自己就能算出结果来
// 为什么要用代码去判断呢

// 所以,类型运算逻辑都是用来做一些动态的类型的运算.也就是对类型参数的运算

type isTwo<T> = T extends 2 ? true:false

type res2 = isTwo<1>
type res3 = isTwo<2>

// 这种类型也叫做高级类型
// 高级类型的特点是传入类型参数,经过一系列类型运算逻辑后.返回新的类型

// 推导:  infer
// 如何提取类型的一部分呢,答案是infer
// 比如提取元祖类型的第一个元素

type First<Tuple extends unknown[]> = Tuple extends [
infer T,...infer R] ? T : never
type res5 = First<[1,2,3]>

// 注意,第一个extends不是条件,条件类型是extends?: 这里的extends
// 是约束的意思,也就是约束类型参数只能是数组类型
// 因为不知道数组元素的具体类型,所以用unkown

// 联合:|

// 联合类型(Union)类似js里的或运算符| 但是作用于类型
// 代表类型可以是几个类型之一
type Union = 1 | 2 | 3

// 交叉 & 
// 交叉类型(intersection)类似js中的与运算符&,但是作用于类型
// 代表对类型做合并
type ObjType = {a:number} & {c:boolean}

type res6 = {a:number,c:boolean} extends ObjType ?true:false

// 注意,同一类型可以合并,不同的类型没法合并,会被舍弃
type rs = 'aaa' & 222


// 映射类型 
// 对象 class在TypeScript对应的类型是索引类型(indexType)
// 那么如何对索引类型做修改呢  就要用到用到映射类型

// type MapType<T> ={
//     [key in keyof T]?:T[Key]
// }

// keyof T是查询索引类型中所有的索引 叫做索引查询
// T[Key]是取索引类型某个索引的值,叫做索引访问
// in 使用与遍历联合类型的运算符
// 比如我们把一个索引类型的值变成3个元素的数组

type MapType<T> ={
        [Key in keyof T]:[T[Key],T[Key],T[Key]]
    }

type rs2 = MapType<{a:1,b:2}>

// 映射类型就相当于把一个集合映射到另一个集合,这是他名字的由来

// 除了值可以变化 索引也可以做变化 用as运算符 叫做重映射

type MyType<T> = {
    [
        Key in keyof T
         as `${Key & string}${Key & string}${Key & string}`
    ] :[T[Key],T[Key],T[Key]]
}

type rs3 = MyType<{a:1,b:2}>

// 我们知道普通对象的键都是字符串类型,所以这里使用了Key & string交叉运算
// 因为Js处理对象比较多.所以索引类型的映射比较重要

// 总结
// 给JavaScript添加静态类型系统,那肯定是能复用的就复用,所以在TS中
// 基础类型和class Array等复合类型都是和JS一样的,只是又额外加了接口
// (interface),枚举(enum) 元祖(turple)这三种复合类型
// 对象类型 class类型在ts中也叫做索引类型,还有void never any unknow 
// 四种特殊类型,以及支持字面量作为类型,此外,ts类型系统也支持通过
// readonly,?等修饰符对属性的特性做进一步的描述

// 此外 ts支持对类型做运算,这是它的类型系统的强大之处,也是复杂之处
// ts支持条件,推导,联合.交叉等运算逻辑,还有对联合类型做映射

// 这些逻辑是针对类型参数.也就是泛型来说的,传入类型参数.经过一系列 
// 类型运算逻辑后,返回新的类型的类型就叫做高级类型
// 如果是静态的值,直接算出结果即可,没必要写类型逻辑

// 这些语法看起来没有多复杂,但是他们却可以实现很多复杂逻辑
// 就像JS的语法也不复杂,却可以实现很多复杂逻辑一样









