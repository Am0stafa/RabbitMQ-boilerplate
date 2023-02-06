/* RabbitMQ */
const amqp = require("amqplib");

// publish a number the user enters in the command line
const msg = {number: process.argv[2]}

connect();
async function connect() {

    try {
        const amqpServer = "amqp://localhost:5672"
        //! connect to RabbitMQ server
        const connection = await amqp.connect(amqpServer)
        //! one channel that goes in  your connection
        const channel = await connection.createChannel();
        //! assert that a queue exists, create if necessary and if it doesn't exist it will create it
        await channel.assertQueue("jobs");

        //! send message to the queue an array of bytes
        channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)))
        console.log(`Job sent successfully ${msg.number}`);
        
        //! close the channel and the connection
        await channel.close();
        await connection.close();
    }
    catch (ex){
        console.error(ex)
    }

}