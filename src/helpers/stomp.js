import { Client, Message } from '@stomp/stompjs';

const client = new Client({
  brokerURL: "ws://localhost:8080/ws",
  onConnect: () => {
    client.subscribe("/topic/games/" + gameId, message =>
      console.log(`Received: ${message.body}`)
    );
    client.publish({ destination: "/app/games/" + gameId + "/joined", body: gameId });
  },
});