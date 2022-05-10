// 示例一  :  'abc'  
    // ==>{
    //     value:'abc'
    // ==>}

// 示例二
// [abc[bcd[def]]]
// {
//     value:'abc',
//     children:{
//         value:'bcd',
//         children:{
//             value:'def'
//         }
//     }
// }
function strToObj(str){
    let arr = str.split(/[\[\]]/g).filter(Boolean)
    console.log(arr)
    let result = {}
    arr.reduce((pre,cur,index,self)=>{
        pre.value = cur
        if(index !== self.length -1){
            return (pre.children = {})
        }
    },result)
    return result
}
strToObj('[abc[bcd[def]]]')