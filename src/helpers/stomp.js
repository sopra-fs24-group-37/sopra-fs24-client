import { Client } from '@stomp/stompjs';

const client = new Client({
  brokerURL: "ws://localhost:8080/ws",
});

export const connectWebSocket = () => {
  client.activate();
  return client;
};

export const disconnectWebSocket = () => {
  client.deactivate();
};


/**
useEffect(() => {
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    onConnect: () => {
      client.subscribe("/topic/games/" + gameId, message =>
        console.log(`Received: ${message.body}`)
      );
      client.publish({ destination: "/app/games/" + gameId + "/joined", body: gameId });
    },
  });
  
  client.activate();
}, []);
*/