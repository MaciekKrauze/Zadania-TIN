// Główne funkcje kalkulatora
function operation(fn) {
    return fn;
}

function compose(...operations) {
    if (operations.length === 0) {
        return x => x;
    }

    return operations.reduceRight((composed, fn) =>
            (...args) => fn(composed(...args)),
        x => x
    );
}

function calculate(operation, value) {
    return operation(value);
}

function sequence(...operations) {
    return operation(value => operations.reduce((acc, op) => op(acc), value));
}


function add(x) {
    return operation(value => value + x);
}

function subtract(x) {
    return operation(value => value - x);
}

function multiply(x) {
    return operation(value => value * x);
}

function divide(x) {
    return operation(value => value / x);
}

function power(x) {
    return operation(value => Math.pow(value, x));
}

function negate() {
    return operation(value => -value);
}

function sum() {
    return operation(arr => arr.reduce((acc, val) => acc + val, 0));
}