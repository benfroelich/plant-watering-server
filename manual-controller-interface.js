"use strict";

const net = require('net');

async function getStatus()
{
    const resp = await issueCommand({'action': 'get-status'});
    return resp;
}

function issueCommand(command)
{
    return new Promise((resolve, reject) => {
        const client = net.createConnection(
            process.env.MANUAL_CONTROL_PORT,
            'localhost',
            function () {
                console.log('connected');
                //client.write('{\"action\": \"get-status\"}');
                client.write(JSON.stringify(command))
            }
        );

        client.on('data', function(data) {
            resolve(JSON.parse(data));
        });

        client.on('close', function() {
            console.log('connection closed');
        });
    });
}

module.exports.getStatus = getStatus;
module.exports.issueCommand = issueCommand;

async function tryGetStatus()
{
    console.log("tryGetStatus begins");
    var stat = await getStatus();
    console.log(`tryGetStatus got ${JSON.stringify(stat)}`);
}

