function merge(leftArr,rightArr){
    let res = []
    while (leftArr.length && rightArr.length) {
        if(leftArr[0]<rightArr[0]){
            res.push(leftArr.shift())
        }else{
            res.push(rightArr.shift())
        }
    }
    return res.concat(leftArr).concat(rightArr)
}

function mergeSort(arr){
    if(arr.length === 1) return arr

    let mid = Math.floor(arr.length/2)
    let leftarr = arr.slice(0,mid)
    let rightarr = arr.slice(mid)
    return merge(mergeSort(leftarr),mergeSort(rightarr))
}

const arr = [1,222,234,33,22,11,23,6,8,3,5,65,34,88,54,66,23,9]
console.log(mergeSort(arr))