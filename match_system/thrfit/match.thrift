namespace py match_service

service Match {
    i32 add_player(1: i32 score, 2: string uuid, 3: string username, 4: i32 sure_skin, 5: double player_x, 6: double player_y, 7: string channel_name),
}