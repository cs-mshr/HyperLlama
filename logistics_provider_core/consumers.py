import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Code to execute when a WebSocket connection is established
        await self.accept()  # Accept the WebSocket connection

    async def disconnect(self, close_code):
        # Code to execute when the WebSocket is disconnected
        pass

    async def receive(self, text_data):
        # Code to handle incoming WebSocket messages
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message back to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
