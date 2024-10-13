import json
from channels.generic.websocket import AsyncWebsocketConsumer


class DriverLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.driver_id = self.scope['url_route']['kwargs']['driver_id']
        self.group_name = f'driver_{self.driver_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        await self.send(text_data=json.dumps({
            'message': text_data
        }))

    async def location_update(self, event):
        location = event['location']
        await self.send(text_data=json.dumps({
            'type': 'location_update',
            'location': location
        }))
