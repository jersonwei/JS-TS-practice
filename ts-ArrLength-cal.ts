
// TS 类型系统不是图灵完备.不是所有的逻辑都能写
// 比如数值相关的逻辑


// 数组长度做计算

// TS 类型系统没有加减乘除运算符,怎么做数值运算

// 我们的数组类型取Length就是数值

type num1 = [unknown]['length']  // 1
type num2 = [unknown,unknown]['length']  // 2

// 而数组类型我们是可以构建出来的,那么通过构造不同的数组区长度
// 就能做到数值的运算

// TS类型系统中没有加减乘除运算符,但是可以通过构造不同的数组然后
// 取length的方式来完成数值计算,把数值的加减乘除转化为数组的提取和构造

// (严格来说构造的是元组) 这点也是类型体操中最麻烦的一个点


// 解下来实现我们的数组长度实现加减乘除

// Add 

// 我们知道了数值计算要转换为对数组类型的操作,那么加法的实现很容易想到

// 构造两个数组,然后合并成一个,再取Length

// 构造的数组长度是不确定的,我们就需要使用递归构造

type BuildArr <Length extends number,
               Ele = unknown,
               Arr extends unknown[] = []> =
               Arr['length'] extends Length
               ? Arr 
               : BuildArr<Length,Ele,[...Arr,Ele]>

// 类型参数Length是要构造的数组的长度,类型参数Ele是数组元素
// 默认为unknown 类型参数Arr为构造出的数组,默认是[]

// 如果Arr的长度到达了Length,就返回构造出的Arr,否则继续递归构造
// 构造数组实现了,那么基于它就能实现加法 

type Add<Num1 extends number,Num2 extends number> = 
     [...BuildArr<Num1>,...BuildArr<Num2>]['length']

type AddResult = Add<223,22>


// Substract  加法是构造数组,那减法是从数值中去掉一部分
// 我们可以通过数组类型的提取来实现

// 比如3是[unknown,unknown,unknown]的数组类型,取出2个后就变成1

type Substract <Num1 extends number,
                Num2 extends number> = 
         BuildArr<Num1> extends 
         [...arr1: BuildArr<Num2>,...arr2: infer Rest]
         ? Rest['length']
         : never

type SubstractResult = Substract<25,22>

// Multipy 我们吧加法转换为了数组构造,把剪发转换为了数组提取,那乘法呢

// 这里我们需要在加法的基础上多加一个参数,来传递中间结果的数组,算完之后再取一个length

type Multipy <Num1 extends number,
              Num2 extends number,
              ResultArr extends unknown[] = [] > = 
              Num2 extends 0 ? ResultArr['length']
              : Multipy<Num1, Substract<Num2,1>,
              [...BuildArr<Num1>,...ResultArr]>

// 类型参数Num1和Num2分别是被加数和加数

// 因为乘法是多个加法结果的累加,我们使用了一个类型参数ResultArr 来保存中间结果
// 默认值为[] 相当于从0开始

type MultipyRes = Multipy<2,33>

// Divid  乘法是递归的累加,那除法就是递归的累减

type Divid<Num1 extends number,
           Num2 extends number,
           CountArr extends unknown[] = [] > = 
           Num1 extends 0 ? CountArr['length']
           : Divid<Substract<Num1,Num2>,Num2,[unknown,...CountArr]>
     
// 类型参数Num1和Num2分别是被减数和减数
// 类型参数CountArr 是用来记录减了几次的累加数组
// 如果Num1减到了0,那么这时候减了几次就是除法结果.也就是CountArr['length']
type DividRes = Divid<20,4>


// 数组长度实现计数

// Strlen  数组长度可以取length得到,但是字符串类型不能取length

// 字符串长度不确定.明显要用递归,每次娶一个计数,就是字符长度

type StrLen < Str extends string,
              CountArr extends unknown[] = [] > = 
              Str extends `${string}${infer Rest}`
              ? StrLen<Rest,[...CountArr,unknown]>
              : CountArr['length']

// 类型参数Str是待处理的字符串,类型参数CountArr是做计数的数组
// 默认值[]代表从0开始

// 每次通过模式匹配提取去掉一个字符之后的剩余字符串,并且往计数
// 数组里多放入一个元素,递归进行取字符和计数

type StrLenRes = StrLen<'Hello World'>