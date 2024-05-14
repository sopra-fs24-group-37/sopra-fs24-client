import { Client } from "@stomp/stompjs";
import { getWSDomain } from "./getDomain";

const client = new Client({
  brokerURL: getWSDomain(),
});

export const connectWebSocket = () => {
  client.activate();
  
  return client;
};

export const disconnectWebSocket = () => {
  client.deactivate();
};

