const amqp = require("amqplib");

connect();

async function connect() {
// 1.connect to RabbitMQ server 2.create a channel 3.assert that a queue exists
    try {
        const amqpServer = "amqp://localhost:5672"
        //! connect to RabbitMQ server
        const connection = await amqp.connect(amqpServer)
        //! one channel that goes in  your connection
        const channel = await connection.createChannel();
        //! assert that a queue exists, create if necessary and if it doesn't exist it will create it
        await channel.assertQueue("jobs");
        
        //! consume messages from the queue
        channel.consume("jobs", message => {
            // the message contains
            // content: the message itself
            // fields: metadata
            // properties: metadata
            // consumerTag: the consumer tag
            // deliveryTag: the delivery tag
            // redelivered: if the message was redelivered
            // exchange: the exchange the message was published to
            // routingKey: the routing key used
        
            const input = JSON.parse(message.content.toString());
            console.log(`Received job with input ${input.number}`)

            if (input.number == 7 ) 
                //! acknowledge the message so that it is removed from the queue
                channel.ack(message);
        })

        console.log("Waiting for messages...")
    
    }
    catch (ex){
        console.error(ex)
    }

}