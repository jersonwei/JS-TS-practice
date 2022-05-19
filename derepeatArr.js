// 数组去重 
let arr = [1,1,1,2,2,2,1,3,4,3,22,22,33,33,11,11,2,4]
// 方法一
function delRepeat(arr){
   for (let i = 0; i < arr.length; i++) {
       if(arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])){
           arr.splice(arr.lastIndexOf(arr[i]),1)
           i--
       }
   }
   return arr
}
console.log(delRepeat(arr))
// 方法二
function delRepeat2(arr){
    const resArr = []
   for (let i = 0; i < arr.length; i++) {
       if(resArr.indexOf(arr[i]) === -1){
           resArr.push(arr[i])
       }
   }
   return resArr
}
console.log(delRepeat2(arr))
// 方法三
function delRepeat3(arr){
    return arr.filter((item,index)=>{
        return arr.indexOf(item) === index
    })
}
console.log(delRepeat3(arr))
// 方法四
function delRepeat4(arr){
    const resArr = arr.sort((a,b) => {a-b})
   for (let i = 0; i < resArr.length; i++) {
       if(resArr[i] === resArr[i+1]){
           resArr.splice(i,1)
           i--
       }
   }
   return resArr
}
console.log(delRepeat4(arr))
// 方法五
function delRepeat5(arr){
    let map = {}
   for (let i = 0; i < arr.length; i++) {
       if(!map[arr[i]]){
        map[arr[i]] = 1
       }else{
        map[arr[i]] = map[arr[i]] +1 
       }
   }
   return Object.keys(map).map(item=>+item)
}
console.log(delRepeat5(arr))
// 方法六
function delRepeat6(arr){
    return Array.from(new Set(arr))
}
console.log(delRepeat6(arr))