// 只能修改 settimeout 到 Math.floor(Math.random())
// 不能修改Math.floor(Math.random()*1000)
// 不能使用全局变量

function print(n){
    setTimeout(()=>{
        console.log(n)
    },Math.floor(Math.random()*1000))
}

