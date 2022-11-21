from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

from match_system.src.match_server.match_service import Match
from game.models.player.player import Player
from channels.db import database_sync_to_async


class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        print('disconnect')
        if self.room_name:
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):
        # self.room_name = None

        # start = 0
        # for i in range(start,100000000):
        #     name = "room-%d" % (i)
        #     if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
        #         self.room_name  = name
        #         break

        # if not self.room_name:
        #     return

        # if not cache.has_key(self.room_name):
        #     cache.set(self.room_name, [], 3600)

        # for player in cache.get(self.room_name):
        #     await self.send(text_data=json.dumps({
        #         'event':"create_player",
        #         'uuid': player['uuid'],
        #         'username':player['username'],
        #         'sure_skin':player['sure_skin'],
        #         'player_x':player['player_x'],
        #         'player_y':player['player_y'], 
        #     }))

        # await self.channel_layer.group_add(self.room_name, self.channel_name)


        # players = cache.get(self.room_name)
        # players.append({
        #     'uuid':data['uuid'],
        #     'username':data['username'],
        #     'sure_skin':data['sure_skin'],
        #     'player_x':data['player_x'],
        #     'player_y':data['player_y'],
        # })
        # cache.set(self.room_name, players, 3600)
        # await self.channel_layer.group_send(
        #     self.room_name,
        #     {
        #         'type':"group_send_event",
        #         'event':"create_player",
        #         'username':data['username'],
        #         'uuid':data['uuid'],
        #         'sure_skin':data['sure_skin'],
        #         'player_x':data['player_x'],
        #         'player_y':data['player_y'],
        #     }
        # )

        self.room_name = None
        self.uuid = data['uuid']
        # Make socket
        transport = TSocket.TSocket('127.0.0.1', 9090)

        # Buffering is critical. Raw sockets are very slow
        transport = TTransport.TBufferedTransport(transport)

        # Wrap in a protocol
        protocol = TBinaryProtocol.TBinaryProtocol(transport)

        # Create a client to use the protocol encoder
        client = Match.Client(protocol)

        def db_get_player():
            return Player.objects.get(user__username=data['username'])

        player = await database_sync_to_async(db_get_player)()

        # Connect!
        transport.open()
        client.add_player(player.score, data['uuid'], data['username'], data['sure_skin'], data['player_x'], data['player_y'], self.channel_name)

    
        # Close!
        transport.close()



    async def group_send_event(self, data):
        if not self.room_name:
            keys = cache.keys('*%s*' % (self.uuid))
            if keys:
                self.room_name = keys[0]
        await self.send(text_data=json.dumps(data))

    async def move_to(self, data) :
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "move_to",
                'uuid': data['uuid'],
                'tx' : data['tx'],
                'ty' : data['ty'],
            }
        )

    async def shoot_fireball(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "shoot_fireball",
                'uuid' : data['uuid'],
                'tx' : data['tx'],
                'ty': data['ty'],
                'ball_uuid': data['ball_uuid'],
                'is_se' : data['is_se'],
            }
        )

    async def attack(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "attack",
                'uuid' : data['uuid'],
                'attackee_uuid' : data['attackee_uuid'],
                'x' : data['x'],
                'y' : data['y'],
                'angle' : data['angle'],
                'damage' :  data['damage'],
                'ball_uuid' : data['ball_uuid'],
            }
        )

    async def is_attack(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "is_attack",
                'uuid' : data['uuid'],
                'attacker_uuid' : data['attacker_uuid'],
                'x' : data['x'],
                'y' : data['y'],
                'angle' : data['angle'],
                'damage' :  data['damage'],
                'ball_uuid' : data['ball_uuid'],
            }
        )

    async def update_ball_trace(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "update_ball_trace",
                'owner_uuid' : data['owner_uuid'],
                'x' : data['x'],
                'y' : data['y'],
                'vx' : data['vx'],
                'vy' : data['vy'],
                'ball_uuid' : data['ball_uuid'],
                'move_length' : data['move_length'],
            }
        )

    async def create_ball(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "create_ball",
                'uuid' : data['uuid'],
                'x' : data['x'],
                'y' : data['y'],
                'vx' : data['vx'],
                'vy' : data['vy'],
                'color' : data['color'],
                'radius' : data['radius'],
                'speed' : data['speed'],
                'move_length' : data['move_length'],
                'damage' : data['damage'],
                'se' : data['se'],
                'is_elastic' : data['is_elastic'],
                'ball_uuid' : data['ball_uuid'],
            }
        )

    async def block(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "block",
                'blocker_uuid' : data['blocker_uuid'],
                'blockee_uuid' : data['blockee_uuid'],
                'vx' : data['vx'],
                'vy' : data['vy'],
                'angle':data['angle'],
                'ball_uuid' : data['ball_uuid'],
            }
        )

    async def hp_decrease(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "hp_decrease",
                'uuid' : data['uuid'],
                'damage' : data['damage'],
            }
        )

    async def destroy_ball(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "destroy_ball",
                'owner_uuid' : data['owner_uuid'],
                'ball_uuid' : data['ball_uuid'],
            }
        )

    async def update_damage_player(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "update_damage_player",
                'damager_uuid' : data['damager_uuid'],
                'damage_x' : data['damage_x'],
                'damage_y' : data['damage_y'],
                'damage_speed' : data['damage_speed'],
                'x' : data['x'],
                'y' : data['y'],
            }
        )

    async def message(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "message",
                'uuid' : data['uuid'],
                'username' : data['username'],
                'text' : data['text'],
            }
        )

    async def make_particle(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "make_particle",
                'uuid' : data['uuid'],
                'x' : data['x'],
                'y' : data['y'],
                'vx' : data['vx'],
                'vy' : data['vy'],
                'radius' : data['radius'],
                'color' : data['color'],
                'speed' : data['speed'],
                'move_length' : data['move_length'],
            }
        )

    async def update_player(self,data):
        if self.room_name:
            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type' : "group_send_event",
                    'event' : "update_player",
                    'uuid' : data['uuid'],
                    'hp' : data['hp'],
                    'x' : data['x'],
                    'y' : data['y'],
                    'vx' : data['vx'],
                    'vy' : data['vy'],
                    'damage_x' : data['damage_x'],
                    'damage_y' : data['damage_y'],
                    'damage_speed' : data['damage_speed'],
                }
            )

    async def player_die(self,data):
        if self.room_name:
            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type' : "group_send_event",
                    'event' : "player_die",
                    'uuid' : data['uuid'],
                }
            )

    async def make_diffusion_ball(self,data):
        if self.room_name:
            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type' : "group_send_event",
                    'event' : "make_diffusion_ball",
                    'uuid' : data['uuid'],
                }
            )
        


    async def receive(self, text_data):
        data = json.loads(text_data)
        event  = data['event']
        if event == "create_player":
            await self.create_player(data)
        elif event == "move_to":
            await self.move_to(data)
        elif event == "shoot_fireball":
            await self.shoot_fireball(data)
        elif event == "attack":
            await self.attack(data)
        elif event == "update_ball_trace":
            await self.update_ball_trace(data)
        elif event == "create_ball":
            await self.create_ball(data)
        elif event == "block":
            await self.block(data)
        elif event == "hp_decrease":
            await self.hp_decrease(data)
        elif event == "destroy_ball":
            await self.destroy_ball(data)
        elif event == "update_damage_player":
            await self.update_damage_player(data)
        elif event == "is_attack":
            await self.is_attack(data)
        elif event == "message":
            await self.message(data)
        elif event == "make_particle":
            await self.make_particle(data)
        elif event == "update_player":
            await self.update_player(data)
        elif event == "player_die":
            await self.player_die(data)
        elif event == "make_diffusion_ball":
            await self.make_diffusion_ball(data)

