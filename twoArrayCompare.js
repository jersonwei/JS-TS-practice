let arr1 = [1,2,3,4]
let arr2 = [2,3,5,6]
// 交集
function intersecArr(arr1,arr2){
    let set1 = Array.from(new Set(arr1))
    let set2 = Array.from(new Set(arr2)) 
    return set1.filter(item=>{
        return set2.includes(item)
    })
}
console.log(insecArr(arr1,arr2))
// 并集
function mergeArr(arr1,arr2){
    return Array.from(new Set(arr1.concat(arr2))) 
}
console.log(mergeArr(arr1,arr2))
// 差集
function delBothVal(arr1,arr2){
    let res1 = insecArr(arr1,arr2)
    let res2 = mergeArr(arr1,arr2)
   for (let i = 0; i < res2.length; i++) {
       if(res1.includes(res2[i])){
           res2.splice(i,1)
           i--
       }
   }
   return res2
    
}
console.log(delBothVal(arr1,arr2))