// object.keys 
// 1 返回的属性有什么特性
// 2 包括继承的属性嘛
// 3 返回的属性顺序是什么样的
// 4 属性中有负数和小数,返回的属性顺序是什么样的
// 5 属性中有Symbol值,返回的属性顺序是什么样的
// 6 Object.keys(null) && Object.keys(undefined)
// 7 Object.keys(1,2,3)
// 8 Object.keys('123')

const obj = {
    'a':'aa',
    'b':'bb',
    'c':'cc'
}

Object.keys(obj)   //  ['a','b','c']
// 1 返回的属性有什么特性  返回对象中具有可枚举的属性  下面的例子来解释可枚举属性


const obj1 = Object.create({},{
    getFoo:{
        value:()=> this.foo
        // 如果设置enumerable:true 就会返回['getFoo','foo']
    }
})
obj1.foo = 1
Object.keys(obj1)  // ['foo'] 这里的getFoo中的enumerable默认为false 也就是不会被枚举


// 2 包括继承的属性嘛  
class A {
    constructor(name){
        this.name = name
    }
}

class B extends A {
    constructor(name,age){
        super(name)  //  相当于设置__proto__
        this.age = age
    }
}

const b = new B('cat',10)
Object.keys(b) // ['name','age']  是可以被继承的

// 3 返回的属性顺序是什么样的
// 大于0的整数类型的属性会进行排序,字符串的类型会按顺序排列  Symbol类型无法访问
const sa = Symbol('a')
const obj3 ={
    5:'5',
    a:'a',
    1:'1',
    c:'c',
    3:'3',
    b:'b'
}
obj3[sa] = 'sa'
Object.keys(obj3) [1,3,5,'a','c','b']

Object.keys({
    5:'5',
    [Symbol('a')]:'Symbol',
    3:'3',
    b:'b'
})
// [3,5,'b']

// 4 属性中有负数和小数,返回的属性顺序是什么样的
Object.keys({
    3:'3',
    1:'1',
    '-1':'-1',
    0.2:'0.2'
})

// 5 属性中有Symbol值,返回的属性顺序是什么样的
// [1,3,'-1','0.2']  对于负数和小数不会排序 会当做字符串处理

// 6 Object.keys(null) && Object.keys(undefined)
//  会将传入的变量处理成对线,在来处理对象的属性
Object.keys(null)
Object.keys(undefined) 
// 所以这两个会报出类型错误的异常

// 7 Object.keys(123)
//  Number =>Numner(123)  会被Number包装 但是这个包装对象中没有任何属性 所以返回空数组
Object.keys(123) // []


// 8 Object.keys('123')
//   会被String进行包裹
Object.keys('123')  // 因为字符串是类数组  会拿到对应的下标 [0,1,2]

