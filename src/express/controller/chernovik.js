// com port = 194409107

// let commandStart = [72,0]
// let commandVerify = [72,1,1,1,1,1,1,1,1]
// let commandRequest = [72,8,0]

// CODE STARTS
                // port.open()
                // port.once('open', () => {
                //     port.write(startCommand)
                //     port.once('data', (x) => {
                //         console.log(x, 'x')
                //         port.close()
                //         port.once('close', () => {
                //             port.open()
                //             port.once('open', () => {
                //                 port.write(verifyCommand)
                //                 port.once('data', (y) => {
                //                     console.log(y, 'y')
                //                     port.close()
                //                     port.once('close', () => {
                //                         port.open()
                //                         port.once('open', ()=>{
                //                             port.write(requestCommand)
                //                             port.once('data', (z)=> {
                //                                 console.log(z, 'z')
                //                             })         
                //                         })
                //                     })
                //                 })
                //             })
                //         })
                //     })
                // })


// function getValuesFromParentheses(param) {
//     let sum = ''    
//     for(let i of param) {
//         if (i == '.' || !!Number(i) || i == ')') {
//             if (i == ')') {
//                 sum += ','
//             } else {
//                 sum += i
//             }
//         }
//     }

//     let matches = sum.split(',')
//     const result = {
//         Ua: matches[0] || "0",
//         Ub: matches[1] || "0",
//         Uc: matches[2] || "0",
//     };
//     return result
// }


//     port.open();
//     port.once('open', () => {
//         port.write(DATA1);
//         port.once('data', () => {
//             port.close();
//             port.once('close', ()=>{
//                 port.open()
//                 port.once('open', () =>{
//                     port.write(DATA2)
//                     port.once('data', () => {
//                         port.close()
//                         port.once('close', ()=>{
//                             port.open()
//                             port.once('open', () => {
//                                 port.write(DATA3)
//                                 port.once('data', volta => {
//                                     port.close()
//                                     console.log(volta)
//                                     res.send('ok')
//                                 })
//                             })
//                         })
//                     })
//                 })
//             })
//         })
//     })