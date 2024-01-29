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
                //                             port.write(XX)
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