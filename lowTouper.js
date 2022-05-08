// 小写驼峰转换为大写驼峰
const obj = {firstName:'ssss',lastName:'xxxx'}
function lowTouper(obj){
    let arr =Object.keys(obj) 
    let valArr = Object.values(obj)
    let newArr = []
   for (let i = 0; i < arr.length; i++) {
        const str = arr[i][0].toUpperCase() + arr[i].slice(1)
        newArr.push(str)
   }
  for (let i = 0; i < newArr.length; i++) {
      delete obj[arr[i]]
      obj[newArr[i]] = valArr[i] 
  }
  return obj
}

console.log(lowTouper(obj))