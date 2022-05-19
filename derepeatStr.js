let str = 'asddw3asfdasdasd1sd324524agdfheh46sd'

function deRepStr(str){
    let firstArr = str.split('')
    let map = {}
   for (let i = 0; i < firstArr.length; i++) {
       if(!map[firstArr[i]]){
        map[firstArr[i]] = 1
       }else{
        ++map[firstArr[i]]
       }
   }
   let max = Math.max(...Object.values(map))
   console.log(max)
    for (const key in map) {
        if(map[key] === max){
            console.log(`最大值是${key}出现次数为${map[key]}`)
        }
    }
    console.log(map) 
}

deRepStr(str)