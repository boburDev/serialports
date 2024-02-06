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

console.log(data)