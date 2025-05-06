
// console.log(reverseWords("JavaScript jest świetny!"))
// countWords("JavaScript jest świetny jest!")
// console.log(areBracketsBalanced("((())"))
// console.log(numberToWords(123))
// console.log(transformData([{}], { "name": "uppercase" }))
// console.log(analyzeTicTacToe([["X", "", ""], ["", "X", ""], ["", "", "X"]]))
// console.log(formatCreditCard("123456"))
console.log(findLongestPalindrome("cbbd"))

function reverseWords (sentence) {
    sentence = sentence.split(" ");
    let newSentence = "";
    for (let i = 0; i < sentence.length; i++) {
        let word = sentence[i].split("");
        for (let i = word.length-1; i >= 0; i--) {
            newSentence += word[i];
        }
        newSentence += " "
    }
    return  newSentence

}

function countWords(sentence) {
    let wordCounts = {};
    let word = "";

    for (let i = 0; i < sentence.length; i++) {
        let char = sentence[i].toLowerCase();

        if ((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || (char >= 'Ā' && char <= 'ſ')) {
            word += char;
        } else if (word.length > 0) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
            word = "";
        }
    }
    if (word.length > 0) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
    return wordCounts;
}

function areBracketsBalanced(sentence){
    let stack = [];
    for (let i = 0; i < sentence.length; i++) {
        let char = sentence[i];
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else if (char === ')' || char === ']' || char === '}') {
            if (stack.length === 0) {
                return false;
            }
            let top = stack[stack.length - 1];
            if ((char === ')' && top === '(') || (char === ']' && top === '[') || (char === '}' && top === '{')) {
                stack.pop();
            } else {
                return false;
            }
        }
    }
    return true;
}

function numberToWords(number) {
    if (number < 0 || number > 999) {
        return "Liczba poza zakresem";
    }

    number = number.toString();
    let numberWords = "";

    if (number.length === 1) {
        if (number[0] == 0) {
            return "zero";
        }
        number = "  " + number;
    }
    if (number.length === 2) {
        number = " " + number;
    }

    if (number.length === 3) {
        switch (number[0]) {
            case "1": numberWords += "sto"; break;
            case "2": numberWords += "dwieście"; break;
            case "3": numberWords += "trzysta"; break;
            case "4": numberWords += "czterysta"; break;
            case "5": numberWords += "pięćset"; break;
            case "6": numberWords += "sześćset"; break;
            case "7": numberWords += "siedemset"; break;
            case "8": numberWords += "osiemset"; break;
            case "9": numberWords += "dziewięćset"; break;
        }
        if (number[0] !== " ") numberWords += " ";
    }

    if (number[1] === "1") {
        switch (number[2]) {
            case "0": numberWords += "dziesięć"; break;
            case "1": numberWords += "jedenaście"; break;
            case "2": numberWords += "dwanaście"; break;
            case "3": numberWords += "trzynaście"; break;
            case "4": numberWords += "czternaście"; break;
            case "5": numberWords += "piętnaście"; break;
            case "6": numberWords += "szesnaście"; break;
            case "7": numberWords += "siedemnaście"; break;
            case "8": numberWords += "osiemnaście"; break;
            case "9": numberWords += "dziewiętnaście"; break;
        }
    } else {
        switch (number[1]) {
            case "2": numberWords += "dwadzieścia"; break;
            case "3": numberWords += "trzydzieści"; break;
            case "4": numberWords += "czterdzieści"; break;
            case "5": numberWords += "pięćdziesiąt"; break;
            case "6": numberWords += "sześćdziesiąt"; break;
            case "7": numberWords += "siedemdziesiąt"; break;
            case "8": numberWords += "osiemdziesiąt"; break;
            case "9": numberWords += "dziewięćdziesiąt"; break;
        }
        if (number[1] !== " " && number[1] !== "0") numberWords += " ";

        switch (number[2]) {
            case "1": numberWords += "jeden"; break;
            case "2": numberWords += "dwa"; break;
            case "3": numberWords += "trzy"; break;
            case "4": numberWords += "cztery"; break;
            case "5": numberWords += "pięć"; break;
            case "6": numberWords += "sześć"; break;
            case "7": numberWords += "siedem"; break;
            case "8": numberWords += "osiem"; break;
            case "9": numberWords += "dziewięć"; break;
        }
    }

     return numberWords.trim();

}

function transformData(data, transformations) {
    return data.map(item => {
        let newItem = { ...item };
        for (let key in transformations) {
            if (newItem.hasOwnProperty(key)) {
                let transformation = transformations[key];
                if (transformation === "uppercase" && typeof newItem[key] === "string") {
                    newItem[key] = newItem[key].toUpperCase();
                } else if (transformation === "lowercase" && typeof newItem[key] === "string") {
                    newItem[key] = newItem[key].toLowerCase();
                } else if (transformation === "round" && typeof newItem[key] === "number") {
                    newItem[key] = Math.round(newItem[key]);
                } else if (transformation === "increment" && typeof newItem[key] === "number") {
                    newItem[key] += 1;
                } else if (transformation === "decrement" && typeof newItem[key] === "number") {
                    newItem[key] -= 1;
                } else if (transformation === "remove") {
                    delete newItem[key];
                }
            }
        }
        return newItem;
    });
}

function analyzeTicTacToe(board) {
    function checkWinner(player) {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
            if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
        }
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
        if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
        return false;
    }

    let xCount = 0, oCount = 0;
    for (let row of board) {
        for (let cell of row) {
            if (cell === 'X') xCount++;
            if (cell === 'O') oCount++;
        }
    }
    if (xCount < oCount || xCount > oCount + 1) return "Invalid";

    let xWins = checkWinner('X');
    let oWins = checkWinner('O');

    if (xWins && oWins) return "Invalid";
    if (xWins) return "X wins";
    if (oWins) return "O wins";

    return (xCount + oCount === 9) ? "Draw" : "Ongoing";
}

function formatCreditCard(cardNumber){
    const digitsOnly = cardNumber.replace(/\D/g, '');

    if (digitsOnly.length < 8 || digitsOnly.length > 19) {
        return "Invalid card number";
    }

    const lastFourDigits = digitsOnly.slice(-4);

    const maskedPart = "*".repeat(digitsOnly.length - 4);

    const maskedNumber = maskedPart + lastFourDigits;

    let formattedNumber = '';
    for (let i = 0; i < maskedNumber.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedNumber += ' ';
        }
        formattedNumber += maskedNumber[i];
    }

    return formattedNumber;
}

function findLongestPalindrome(str) {
    let cleaned = "";
    for (let i = 0; i < str.length; i++) {
        let ch = str[i].toLowerCase();
        let code = ch.charCodeAt(0);
        // Sprawdzamy, czy znak jest literą (a-z) lub cyfrą (0-9)
        if ((code >= 97 && code <= 122) || (code >= 48 && code <= 57)) {
            cleaned += ch;
        }
    }

    if (cleaned.length < 2) return "";

    let longest = "";

    function expandAroundCenter(left, right) {
        for (; left >= 0 && right < cleaned.length; left--, right++) {
            if (cleaned[left] !== cleaned[right]) {
                break;
            }
        }
        return cleaned.substring(left + 1, right);
    }

    for (let i = 0; i < cleaned.length; i++) {
        let oddPal = expandAroundCenter(i, i);
        if (oddPal.length > longest.length) {
            longest = oddPal;
        }

        let evenPal = expandAroundCenter(i, i + 1);
        if (evenPal.length > longest.length) {
            longest = evenPal;
        }
    }

    return longest.length > 1 ? longest : "";
}