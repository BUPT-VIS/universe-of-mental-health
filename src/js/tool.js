/* 角度自适应封装方法 */
function angleSelfAdaption(arr, r, delta) {
    let angleArr = []
    if(arr.length > 0) {
        for(let i = 0; i < arr.length; i++) {
        let d = {}
        // // 没病的人或一种病 无偏移
        // if (arr.length == 1) {
        //     d.x = 0; d.y = 0; 
        // }
        // // 多于一种病 有偏移
        // else {
            d.x = r * (sin(-i * TWO_PI / arr.length + delta));
            d.y = r * (cos(-i * TWO_PI / arr.length+ delta));
        // }
        angleArr.push(d)
        } 
    }
    return angleArr
    }

/* 数组分段函数 */
function sliceArray(array, size) {
    var result = []; //Math.ceil有多余的小数点都取最大整数
        for (var x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size;
        var end = start + size;
        result.push(array.slice(start, end));
        }
        return result;
    }