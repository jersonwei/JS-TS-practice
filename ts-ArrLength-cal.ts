
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