function insertSort(arr){
    let len = arr.length
   for (let i = 1; i < len; i++) {
       let temp = arr[i]
       let j = i-1  //  默认已排序元素
    // 在已经排序的队列进行从后往前的扫描
       while(j>=0 && arr[j]>temp){
           arr[j+1] = arr[j]
           j--
       }
       arr[j+1] = temp
   }
   return arr
}

let arr = [1,32,5,7,2,31,6,4,8,9,14,23]
console.log(insertSort(arr))