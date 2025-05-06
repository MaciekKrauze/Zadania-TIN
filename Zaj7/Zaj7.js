// console.log(transformArray([1, 2, 3, 4, 5]))
// console.log(countWordFrequency(["hello", "Hello", "HELLO"]))
console.log(fibonacci(2));


function transformArray(numbers) {
    return numbers.map(num => {
        if (num % 5 === 0) {
            return "Five";
        } else if (num % 2 === 0) {
            return num * 2;
        } else {
            return num * 3;
        }
    });
}

function countWordFrequency(words) {
    words = words.map(word => word.toLowerCase() )
    return words.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
}

function compose(...functions) {
    if (functions.length === 0) {
        return x => x;
    }

    return functions.reduceRight((composed, fn) =>
            (...args) => fn(composed(...args))
        , x => x);
}

function fibonacci(n){
    if (n >= 0 || n.isInteger(n)){
        return fibtail(n, 0, 1)
    }

    function fibtail(n,a,b){
        if (n === 0){
            return a;
        }
            return fibtail(n - 1, b, b+a )
    }
}