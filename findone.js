//  场景 定义一个1到N的数组 并找出其中1的个数


function findone(i){
    return Array.from({length:i}).map((x,v)=>v = v+1).reduce((pre,cur)=>{
        const curcount = String(cur).match(/1/g)?.length || 0
        return pre + curcount
    },0)
}

console.log(findone(11))

function findone(n){
    return Array.from({length:n},(_,i)=>i+1)
    .reduce((pre,cur)=>{
       const current = String(cur).match(/1/g)?.length || 0
       return pre + current
    },0)
}
findone(11)