/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

//const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
const ccpPath = path.resolve("/home/zummon/fabric/fabric-samples/first-network/connection-org1.json");


async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        //await contract.submitTransaction('createMovie', 'movie0', 'eternal sunshine of the spotless mind', 'Michel Gondry', '2004', 'romance, sci-fi, drama')
        //await contract.submitTransaction('createMovie', 'movie1', 'Seven', 'David Fincher', '1995', 'drama, mystery')

       // await contract.submitTransaction('createMedicine', 'm1','3', 'Napa', 'ACI', '12-12-18', '31-12-19','ACII')
        //await contract.submitTransaction('createMedicine', 'm2','5', 'Exel', 'Beximco', '1-11-18', '3-10-19','Bexx')
        await contract.submitTransaction('createUser', 'mm', '0001', 'zaman', 'gmail', '###', '01623', 'customer')
       // await contract.submitTransaction('createUser',key, id,name,email, pass, phone,userType)
        console.log('Transaction has been submitted');



        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

//main();
module.exports = main;
