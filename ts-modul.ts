// Ts类型编程的代码看起来比较复杂.但其实这些逻辑用JS都能写

// 接下来是类型体操的第一个套路 ,模式匹配做提取
// 我们知道 字符串可以和正则做匹配,找到匹配的部分,提取子组
// * 之后可以用1,2等引用匹配的子组
  'abc'.replace(/a(b)c/,`$1,$!,$1`)
// * TS的类型也同样可以做模式匹配
// * 比如这样一个Promise类型
    type p = Promise<'gang'>
// * 我们像提取value的类型,可以这样做
    type GetValueType<P> = P extends 
    Promise<infer Value>?Value:never

    type GetValueResult = GetValueType<Promise<'gang'>>

    // 这就是ts类型的匹配

    // ts类型的模式匹配是通过extends对类型参数做匹配,结果
    // 保存到通过infer声明的局部类型变量里,如果匹配就能从该
    // 局部变量里拿到提取出的类型

    // 我们看下这个套路的具体用法
    // 数组类型

    // First. 数组类型想提取第一个元素的类型怎么做
    type arr = [1,2,3]
    // 用它来匹配一个模式类型.提取第一个元素的类型到通过infer声明的局部变量里返回
    type GetFirst<Arr extends unknown[]> =
      Arr extends [infer First, ...unknown[]]?First :never
    type Firsts = GetFirst<[1,2,3]>  // 返回类型1

    // 类型参数Arr通过extends约束为只能是数组类型,数组元素unknow也就是可以是任何值

    /**
     *    any和unknow的区别: any和unknow都代表任意类型,但是
     *    unknow只能接受任意类型的值,而any除了可以接受任意类型的值
     *    也可以赋值给任意类型(除了Never),类型体操中经常用unknown接受
     *    和匹配任何类型,而很少把任何类型赋值给某个类型变量
     */
    // 对Arr做模式匹配,把我们要提取的第一个元素的类型,放到通过infer声明的First局部变量
    // 里,后面的元素可以使任何类型,用unknown接收,然后把局部变量First返回

    // type Firsts = GetFirst<[]>  // 返回类型never

    // Last  可以提取第一个元素,当然也可以提取最后一个元素,修改模式类型就行

    type GetLast<Arr extends unknown[]> = Arr extends 
    [...unknown[],infer Last]?Last:never
    type Lasts = GetLast<[1,2,3]>  // 类型为3 


    // PopArr 上面分别取了首尾元素,当然也可以取剩余的数组,比如去掉了最后一个元素的数组
    type PopArr<Arr extends unknown[]> = Arr extends [] 
      ? [] : Arr extends[...infer Rest,unknown] ? Rest:never
    // 如果是空数组,直接返回,否则匹配剩余的元素,放到infer声明的局部变量
    // Rest里,返回Rest
    // 当类型参数Arr为[1,2,3]时

    type Rests = PopArr<[{},1,2,3]>  // 类型为 [{},1,2]

    // 当Arr为空数组或者只有一个参数时,类型为[]

    // ShiftArr 同理可得ShiftArr的类型
    type ShiftArr<Arr extends unknown[]> = Arr extends []?
    [] : Arr extends [unknown,...infer Less]?Less:[]

    type Less = ShiftArr<[1,2,3,{}]>  //  类型为 [2,3,{}]

    // 当Arr参数为[]或者只有一个参数时类型都为[]


/**   字符串类型
 *    字符串类型也同样可以做模式匹配，匹配一个模式字符串 把需要提取的
 *    部分放到infer声明的局部变量里
 */ 

    // StartWith 判断字符串是否是以某个前缀开头，也是通过模式匹配

    type StartWith<Str extends string, Prefix extends string> = Str extends
    `${Prefix}${string}`?true:false

    // 需要声明字符串Str, 匹配的前缀Prefix两个类型参数,他们都是string
    // 用Str去匹配一个模式类型,模式类型的前缀是Prefix,后面是任意的string
    // 如果匹配返回true,否则返回false

    // 当匹配时
    type StartWithResult = StartWith<'jerson and wei','jerson'>  // 匹配为true


    // Replace 字符串可以匹配一个模式类型,提取想要的部分,自然也可以用这些再构建一个新的类型

    // 比如实现字符串替换
    type ReplaceStr<Str extends string,
                    From extends string,
                    To extends string> = 
                    Str extends `${infer Prefix}${From}${infer Suffix}`
                    ? `${Prefix}${To}${Suffix}`: Str

    // 声明要替换的字符串为Str,待替换的字符串From.替换成的字符串3个类型参数                
    // 通过extends约束都是string类型

    // 用Str去匹配模式串,模式串由From和之前之后的字符串构成,把之前之后的字符串
    // 放到通过infer声明的局部变量Prefix,Suffix里

    // 用Prefix,Suffix加上替换到的字符串To构造成新的字符串类型返回
    // 当匹配时

    type ReplaceResult = ReplaceStr<"gang is gang is ?",'?','gang'>  
    // 匹配时就会将匹配到的字符串进行替换   否则仍然是替换前的字符串

    // Trim  能够匹配和替换字符串 那也就能实现去掉空白字符的Trim
    // 但是我们不知道有多少个空白字符,所以需要使用递归
    // 先实现TrimRight
    type TrimStrRight<Str extends string> = Str extends 
    `${infer Rest}${' '| '\n' | '\t'} `
    ? TrimStrRight<Rest>:Str

    // 类型参数Str是要Trim的字符串
    // 如果Str匹配字符串+空白字符(空格,换行,制表符),那就把字符串放到infer声明的
    // 局部变量Rest里
    // 把Rest作为类型参数递归TrimRight,直到不匹配.这时的类型参数Str就是处理结果

    type TrimRightResult = TrimStrRight<'gang          '>  // 递归清除右边的空格


    // TrimLeft 同理可以得到清除左边的空格
    type TrimStrLeft<Str extends string> = Str extends
    `${' ' | '\n' | '\t'}${infer Rest}`?TrimStrLeft<Rest>:Str

    type TrimLeftResult = TrimStrLeft<'     gang'>    // 模式匹配清除左边的空格


    // TrimRight和TrimLeft结合就是Trim
    type Trim<Str extends string> = TrimStrRight<TrimStrLeft<Str>>

    type TrimResult = Trim<'   gang    '>

// 函数 
// 函数同样也可以做类型匹配,比如提取参数,返回值的类型

// GetParameters
// 函数类型可以通过模式匹配来提取参数的类型
type GetParameters<Func extends Function> = Func extends
(...args: infer Args) => unknown ? Args:never
// 类型参数Func是要匹配的函数类型,通过extends约束为Function
// Func和模式类型做匹配,参数类型放到用infer声明的局部变量Args里
// 返回值可以是任何类型,用unknown

// 返回提取到的参数类型Args
type ParametersResult = GetParameters<(name:string,age:number) =>string >


// GetReturnType  
// 能提取参数类型,同样可以提取返回值类型
type GetReturnType<Func extends Function> = Func extends
(...args:any[]) => infer ReturnType?
ReturnType:never
// Func和模式类型做匹配,提取返回值到通过infer声明的局部变量ReturnType里返回

// 参数类型可以是任意类型,也就是any[](注意,这里不能用unknown,因为参数类型是要赋值给)
// 别的类型的,而unknown只能用来接收类型,所以用any

type ReturnTypeResult = GetReturnType<()=>'dont'>

// GetThisParameterType  方法里可以调用this 比如这样

class Dong {
    name:string

    constructor(){
      this.name = 'ding'
    }

    wei(){
      return '喂,我叫: ' + this.name
    }
}

const dong = new Dong()
// dong.wei()

// 用对象.方法名的方式调用的时候.this就指向那个对象
// 但是方法也可以用call 或者apply调用
// dong.wei.call({xxx:1})

// call调用的时候,this就变了.但这里却没有被检查出来this指向的错误

// 如何让编译器能够检查出this指向的错误呢
// 可以在方法声明时指定this的类型
class Ding {
  name:string;

  constructor(){
    this.name = 'ding'
  }

  wei(this:Ding){
    return '喂,我叫 ' + this.name
  }
}
// 这样,当call/apply调用的时候,就能检查出this指向的对象是否是对的

const ding = new Ding()

ding.wei()

ding.wei.call({xxx:1})

// 这里的this类型同样也可以通过模式匹配提取出来

type GetThisParameterType<T> = 
    T extends (this: infer ThisType,...args:any[]) => any
    ? ThisType : unknown

    // 类型参数T是待处理的类型
    // 用T匹配一个模式类型,提取this的类型到infer声明的局部变量
    // ThisType中,其余的参数是任意类型,也就是any,返回值也是任意类型

    // 返回提取到的ThisType 这样就能提取出this的类型

    type GetThisParameterTypeRes = 
    GetThisParameterType<typeof ding>