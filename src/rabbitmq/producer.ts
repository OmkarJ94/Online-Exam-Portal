import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL!;

export async function sendToQueue(queueName: string, message: object) {
  let connection: amqp.ChannelModel | null = null;
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });

    const buffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queueName, buffer, { persistent: true });

    console.log("Message sent to queue:", queueName, message);

    await channel.close();
  } catch (err) {
    console.error("Failed to send message to queue:", err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
