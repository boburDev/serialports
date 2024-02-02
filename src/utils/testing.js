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