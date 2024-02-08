const { queryMaker } = require('./crc')
// function decimalToHex(d, padding) {
//     if (Array.isArray(d)) {
//         return d.map(value => {
//             var hex = Number(value).toString(16);
//             padding =
//                 typeof padding === 'undefined' || padding === null
//                     ? (padding = 2)
//                     : padding;

//             while (hex.length < padding) {
//                 hex = '0' + hex;
//             }
//             return hex;
//         });
//     } else {
//         var hex = Number(d).toString(16);
//         padding =
//             typeof padding === 'undefined' || padding === null
//                 ? (padding = 2)
//                 : padding;

//         while (hex.length < padding) {
//             hex = '0' + hex;
//         }
//         return hex;
//     }
// }


// function getValuesFromParentheses(inputString) {
//     const regex = /\(([^)]+)\)/g;
//     const matches = [];

//     let match;
//     while ((match = regex.exec(inputString))) {
//         matches.push(match[1]);
//     }
//     return matches;
// }

let x = `
47 
63 
49 
55 
49 
33 
13 
10
`.trim().split(' \n')
let data = []
for(let i of x) {
	data.push(+i)
}

let addArg = '.R1.ENDQI().p'

// console.log(newArg, queryMaker(newArg,false), queryMaker([1,82,49,2,69,84,48,80,69,40,41,3]))
let result = []
let counter = 1
for(let i of addArg){
	if (i == '.') {
		result.push(counter)
		if (counter == 3) break;
		counter++
	} else {
		result.push(i)
	}
}
// console.log(result)
let newArg = result.map(c => {
	if (typeof c == 'number') {
		return c
	}
	return c.charCodeAt (0)
})
// console.log(newArg, Buffer.from(newArg))

function strToDec(str) {
	return str.split('').map(c => c.charCodeAt (0))
}

// console.log(strToDec('5.2.24'))



// LEETCODE
