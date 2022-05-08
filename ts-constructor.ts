// 构造器

// 构造器和函数的区别是,构造器是用于创建对象的.所以可以被new
// 同样,我们也可以通过模式匹配提取构造器的参数和返回值的类型

//GetInstanceType 构造器类型可以用interface声明,使用new():xx的语法

interface Person {
    name:string
}

interface PersonConstructor {
    new(name:string): Person
}

// 这里的PersonConstructor返回的是Person类型的实例对象
// 这个也可以通过模式匹配出来

type GetInstanceType <
    ConstructorType extends new(...args:any) => any
    > = ConstructorType extends new(...args:any) => 
    infer InstanceType ? InstanceType : any 

    // 类型参数ConsructorType是待处理的类型.通过extends约束为构造器类型

    // 用ConstructorType匹配一个模式类型,提取返回的实例类型到infer声明的
    // 局部变量InstaceType里.返回InstanceType
    // 这样就能取出构造器对应的实例类型
    type GetInstanceTypeRes = GetInstanceType<PersonConstructor>

    // 索引类型
    // 索引类型也同样可以用模式匹配提取某个索引的值的类型,这个用的也挺多的
    // 比如React的index.d.ts里的PropsWithRef的高级类型,就是通过模式匹配提取
    // 了ref的值的类型
    type PropsWithRef<P> = 
    'ref' extends keyof P
        ? P extends {ref?: infer R | undefined}
            ? string extends R 
                ? PropsWithRef<P> & {ref: Exclude<R,string> | undefined }
                : P
            : p 
        : P        
    
    // 我们简化一下那个高级类型.提取Props里ref的类型

    // GetRefProps  我们同样通过模式匹配的方式提取ref的值的类型
    type GetRefProps<Props> = 
        'ref' extends keyof Props 
            ? Props extends {ref?: infer Value | undefined}
                ? Value
                : never
            : never

    // 类型参数Props为待处理的类型

    // 通过keyofProps取出Props的所有索引构成的联合类型 判断下ref
    // 是否在其中,也就是`ref` extends keyof Props 

    // 为什么要做这个判断.上面注释里写了
    // 在ts3.0里面如果没有对应的索引,Obj[key]返回的是{}而不是never,所以这样坐下兼容处理

    // 如果有ref这个索引的话,就通过infer提取Value的类型返回,否则返回never
    type GetRefPropsRes = GetRefProps<{ref?: 1,name:'ding'}>

    // 当ref为undefined时
    type GetRefPropsRes2 = GetRefProps<{ref?: undefined,name:'ding'}>

    // 总结 

    // 就像字符串可以匹配一个模式串提取子组一样,
    // TS类型也可以匹配一个模式类型提取某个部分的类型

    // TS类型的模式匹配时通过类型extends一个模式类型,把需要提取的部分放到
    // 通过infer声明的局部变量里,后面可以从这个局部变量拿到类型做各种后续处理

    // 模式匹配的套路在数组,字符串,函数,构造器,索引类型,Promise等类型中都有大量的应用
    // 掌握好这个套路能提升很大一截类型体操水平

    // 类型编程主要的目的就是对类型做各种转换,那么如歌对类型做修改呢
    // TS类型系统支持3种可以声明任意类型的变量:type,infer类型参数

    // type 叫做类型别名,其实就是声明一个变量存储某个类型
    type ttt = Promise<number>
    // infer用于类型的提取,然后存到一个变量里,相当于局部变量
    type GetValueType3<P> = P extends Promise<infer Value> ? Value:never
    // 类型参数用于接收具体的类型.在类型运算中也相当于局部变量
    type isTwo<T> = T extends 2 ?true:false
    // 但是,严格来说这三种也都不叫变量,因为它们不能被重新赋值
    // ts设计可以做类型编程的类型系统的目的就是为了产生各种复杂的类型,拿不拿修改怎么产生新类型

    // 重新构造

    // ts的type.infer类型参数声明的变量都不能修改,想对类型做各种变换产生
    // 新的类型就需要重新构造

    // 数组,字符串,函数等类型的重新构造比较简单
    // 索引类型,也就是多个元素的聚合类型的重新构造复杂一些,涉及到了映射类型的语法

    // 数组类型的重新构造

    // push  有这样一个元祖类型
    type tuple = [1,2,3]
    // 我想给这个元祖类型再添加一些类型,怎么做呢

    // TS类型变量不支持修改,我们可以构造一个新的元祖类型
    type Push<Arr extends unknown[], Ele> = [...Arr,Ele]

    // 类型参数Arr是要修改的数组/元组类型,元素的类型任意.也就是unknown 
    // 类型参数Ele是添加的元素的类型
    // 返回的使用Arr已有的元素加上Ele构造的新的元组类型

    type PushResult = Push<[1,2,3],4>

    // 这就是数组/愿足矣的重新构造
    
    // 数组和元组的区别, 数组类型是指任意多个同一类型的元素构成的.比如number[]
    // Array<number> 而元组则是数量固定,类型可以不同的元素构成的.比如[1,true.'guang']


    // Unshift  可以在后面添加 同样也可以在前面添加
    type Unshift<Arr extends unknown[],Ele> = [Ele,...Arr]

    type UnshiftResult = Unshift<[1,2,3],4>

    // 这两个案例比较简单,下面是个复杂的

    // 有这样两个元组
    type tuplel = [1,2]

    type tuplel2 = ['shen','zhen']
    // 我们想把它们合并成这样的元组
    type tuples = [[1,'shen'],[2,'zhen']]
    
    type Zip<One extends [unknown,unknown],Other extends [unknown,unknown]>
    = One extends [infer OneFirst,infer OneSecond]
    ? Other extends [infer OtherFirst,infer OtherSecond]
        ? [[OneFirst,OtherFirst],[OneSecond,OtherSecond]]
    : []
        : []
    
    // 两个类型参数One,Other是两个元组,
    // 类型是[unknown,unknown],代表2个任意类型的元素构成的元组

    // 通过infer分别提取One和Other的元素到infer声明的局部变量
    // OneFirst,OneSecond,OtherFirst,OtherSecond

    // 用提取的元素构造成新的元组返回即可
    type tuples3 = Zip<tuplel,tuplel2>   //    [[1,'shen'],[2,'zhen']]

    // 但是这样只能合并两个元素的元组.如果是n个呢,那就只能用递归了
    type Zip2<One extends unknown[],Other extends unknown[]> = 
    One extends [infer OneFirst,...infer OneRest]
        ? Other extends [infer OtherFirst,...infer OtherRest] 
            ? [[OneFirst,OtherFirst],...Zip2<OneRest,OtherRest>]
        : [] 
            : []

    // 类型参数One.Other声明为unknown[],也就是元素个数任意.类型任意的数组

    // 每次提取One和Other的第一个元素OneFirst,OtherFirst,剩余的放到
    // OneRest和OtherRest中递归处理

    // 这样,就能处理任意个数元组的合并
    type tuplel4 = Zip2<[1,2,3,4,6],['a','b','c','d','e']>

    // 字符串类型的重新构造

    // CapitalizeStr 我们想把一个字符串字面量类型的'dong'转换成首字母大写的'Dong'

    // 需要用到字符串类型的提取和重新构造
        type CapitalizeStr<Str extends string> =
            Str extends `${infer First}${infer Rest}`
                ? `${Uppercase<First>}${Rest}`
                    : Str 
    
    // 我们声明了类型参数Str是要处理的字符串类型,通过extends约束为string
    // 通过infer提取出首个字符到局部变量First.提取后面的字符到局部变量Rest

    // 然后使用TS提供的内置高级类型Uppercase把首字母转为大写
    // 加上Rest,构造成新的字符串类型返回

    type CapitalizeResult = CapitalizeStr<'dong'>

    // 这就是字符串类型的重新构造:从已有的字符串类型中提取出一些部分字符串
    // 经过一系列变换,构造成新的字符串类型

    // CamelCase  我们再来实现 dong_dong_dong到dongDongDong的变换
    // 同样是提取和重新构造
    type CamelCase<Str extends string> = 
        Str extends `${infer Left}_${infer Right}${infer Rest}`
        ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
            :Str
    
    // 类型参数Str是待处理的字符串类型,约束为string
    // 提取_之前和之后的两个字符到infer声明的局部变量Left和Right
    // 剩下的字符放到Rest里

    // 然后把右边的字符Right大写和Left构造成新的字符串,剩余的字符
    // Rest要继续递归的处理,这样就完成了从下划线到驼峰形式的转换

    type CamelCaseResult = CamelCase<'dong_dong_dong'>

    // DropSubStr 可以修改自然也可以删除,示例如下
    type DropSubStr<Str extends string, SubStr extends string> = 
    Str extends `${infer Prefix}${SubStr}${infer Suffix}`
        ? DropSubStr<`${Prefix}${Suffix}`,SubStr>
            : Str
    
    // 类型参数Str是待处理的字符串,SubStr是要删除的字符串,都通过extends约束为string

    // 通过模式匹配提取SubStr之前和之后的字符串到infer声明的局部变量Prefix,Suffix中
    // 如果不匹配就直接返回Str

    // 如果匹配,那就用Prefix,Suffix构造成新的字符串,然后继续递归删除SubStr,直到不再匹配

    type DropResult = DropSubStr<'dingdong','dong'>

    // 函数类型的重新构造

    // AppendArgument  我们可以在函数类型上添加一个参数

    type AppendArgument<Func extends Function,Arg > =
        Func extends (...args:infer Args) => infer ReturnType 
            ? (...args:[...Args,Arg]) => ReturnType
                : never 

    // 类型参数Func是待处理的函数类型,通过extends约束为Function,Arg是要添加的参数类型

    // 通过模式匹配提取参数到infer声明的局部变量Args中,提取返回值到局部变量ReturnType中

    // 用Args数组添加Arg构造成新的参数类型,结合ReturnType构造成新的函数类型返回

    // 这样就完成了函数类型的修改
    type AppendArgumentResult = AppendArgument<(name:string)=>boolean,number>

    // 索引类型的重新构造

    // 索引类型是聚合多个元素的类型
    type objs = {
        name:string
        age:number
        gender:boolean
    }
    // 索引类型可以添加修饰符readonly(可读)、?(可选): 
    type objs1 = {
        readonly name:string
        age?:number
        gender:boolean
    }
    // 对它的修改和构造类型涉及到了映射类型的语法
    // type Mapping<Obj extends object> = {
    //     [Key in keyof Obj]: Obj[Key]
    // }

    // Mapping 映射的过程中可以对value做下修改 
    type Mapping<Obj extends object> = {
        [Key in keyof Obj]: [Obj[Key],Obj[Key],Obj[Key]]
    } 

    // 类型参数Obj是待处理的索引类型,通过extends约束为object
    // 用keyof取出Obj的索引,作为新的索引类型的索引,也就是 Key in keyof Obj

    // 值的类型可以做变换.这里我们用之前索引类型的值Obj[Key]构造成了
    // 三个元素的元组类型 [Obj[Key],Obj[Key],Obj[Key]]

    type res = Mapping<{a:1,b:2}>   //  {a:[1,1,1],b:[2,2,2]}
    // 索引类型的映射如下图所示
    // a:1 ====> a:[1,1,1]
    // b:2 ====> b:[2,2,2]

    // UppercaseKey 除了可以对Value做修改,可以对Key做修改.使用as 这叫做重映射

    // 比如把索引类型的Key变为大写
    type UppercaseKey<Obj extends object> = {
        [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
    }
    // 类型参数Obj是待处理的索引类型,通过extends约束为object

    // 新的索引类型的索引为Obj中的索引,也就是Key in keyof Obj 但要做些变换,也就是as之后

    // 通过Uppercase把索引Key转为大写,因为索引可能为string,number,symbol类型,而这里
    // 只能接受string类型,所以要 & string,也就是取索引中string的部分

    // value保持不变,也就是之前的索引Key对应的值的类型Obj[Key]
    // 这样构造出的新的索引类型,就把原来索引类型的索引转为了大写

    type UppercaseKeyResult = UppercaseKey<{ding:1,dong:2}>

    // Record ts提供了内置的高级类型Record来创建索引类型

    // type Record<K extends string | number | symbol, T> = { [P in K]: T}

    // 指定索引和值的类型分别为K和T.就可以创建一个对应的索引类型

    // 上面的索引类型的约束我们用的object 更语义化一点推荐用Record<string, object>

    type UppercaseKeys<Obj extends Record<string,any>> = {
        [Key in keyof Obj as Uppercase<Key & string>] : Obj[Key]
    }

    // 也就是约束类型参数Obj为key为string,值为任意类型的索引类型

    // ToReadonly 索引类型的索引可以添加readonly的修饰符,代表只读
    type ToReadonly<T> = {
        readonly [Key in keyof T]: T[Key]
    }

    // 通过映射类型构造了新的索引类型,给索引加上了readonly的修饰,其余的保持不变
    // 索引依然为原来的索引Key in keyof T, 值依然为原来的值T[Key]

    type ToReadonlyResult = ToReadonly<{name:string,age:number}>


    // ToPartial  同理,索引类型还可以添加可选修饰符
    
    type ToPartial<T> = {
        [Key in keyof T]?: T[Key]
    }
    // 给索引类型T的索引添加了?可选修饰符,其余保持不变
    type ToPartialResult = ToPartial<{name:string,age:number}>
