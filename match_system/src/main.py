#! /usr/bin/env python3

import glob
import sys
#sys.path.append('gen-py')
#项目根目录
sys.path.insert(0, glob.glob('../../')[0])

from match_server.match_service import Match

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from queue import Queue
from time import sleep
from threading import Thread

from acapp.asgi import channel_layer
from asgiref.sync import async_to_sync
from django.core.cache import cache



queue = Queue() #消息队列

class Player:
    def __init__(self, score, uuid, username, sure_skin, player_x, player_y, channel_name):
        self.score = score
        self.uuid = uuid
        self.username = username
        self.sure_skin = sure_skin
        self.player_x = player_x
        self.player_y = player_y
        self.channel_name = channel_name
        self.waiting_time = 0 #等待时间

class Pool:
    def __init__(self):
        self.players = []

    def add_player(self, player):
        self.players.append(player)

    def check_match(self, a, b):
        dt = abs(a.score - b.score)
        a_max_dif = a.waiting_time * 50
        b_max_dif = b.waiting_time * 50
        return dt <= a_max_dif and dt <= b_max_dif

    def match_success(self, ps):
        print("Match Succhee: %s %s" % (ps[0].username, ps[1].username))
        room_name = "room-%s-%s" % (ps[0].uuid, ps[1].uuid)
        players = []
        for p in ps:
            async_to_sync(channel_layer.group_add)(room_name, p.channel_name)
            players.append({
                'uuid':p.uuid,
                'username':p.username,
                'sure_skin':p.sure_skin,
                'player_x':p.player_x,
                'player_y':p.player_y,
                'hp':100,
            })
        cache.set(room_name, players, 3600)
        for p in ps:
            async_to_sync(channel_layer.group_send)(
                room_name,
                {
                    'type': "group_send_event",
                    'event': "create_player",
                    'uuid': p.uuid,
                    'username': p.username,
                    'sure_skin': p.sure_skin,
                    'player_x':p.player_x,
                    'player_y':p.player_y,
                }
            )


    def increase_waiting_time(self):
        for player in self.players:
            player.waiting_time += 1

    def match(self):
        while len(self.players) >= 2:
            self.players = sorted(self.players, key=lambda p: p.score)
            flag = False
            for i in range(len(self.players) - 1):
                 a, b= self.players[i], self.players[i + 1]
                 if self.check_match(a, b):
                    self.match_success([a, b])
                    self.players = self.players[:i] + self.players[i + 2:]
                    flag = True
                    break
            if not flag:
                break
        self.increase_waiting_time()


class MatchHandler:
    def add_player(self, score, uuid, username, sure_skin, player_x, player_y, channel_name):
        player = Player(score, uuid, username, sure_skin, player_x, player_y, channel_name)
        print("Add player: %s %d" % (player.username, player.score))
        queue.put(player)
        return 0

def get_player_from_queue():
    try:
        return queue.get_nowait()
    except:
        return None


def worker ():
    pool = Pool()
    while True:
        player = get_player_from_queue()
        if player:
            pool.add_player(player)
        else:
            pool.match()
            sleep(1)


if __name__ == '__main__':
    handler = MatchHandler()
    processor = Match.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    # You could do one of these for a multithreaded server
    server = TServer.TThreadedServer(
        processor, transport, tfactory, pfactory)

    print('Starting the server...')
    Thread(target=worker, daemon=True).start()

    server.serve()
    print('done.')