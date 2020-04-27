/*
 Copyright 2020 Ramananda Panda All Rights Reserved.

 SPDX-License-Identifier: MIT

*/
process.env.DEBUG = 'RedisKVS'; 
module.exports = require('./lib/redisKeyValueStore');
