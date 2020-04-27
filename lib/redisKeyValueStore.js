/*
 Copyright 2018 Ramananda Panda All Rights Reserved.
 SPDX-License-Identifier: MIT
*/

// process.env.DEBUG = 'RedisKVS';

const debug = require("debug")("RedisKVS");
let redis = require("redis");

module.exports = class RedisKVS {
  constructor(options) {
    debug("Enter Constructor, options are %j", options);
    if (!options.host) {
      throw new Error("Missing Required host in options");
    }
    if (!options.port) {
      throw new Error("Missing Required port in options");
    }
    if (options.tlsKey) {
      if (!options.tlsKey) {
        throw new Error("Missing Required tls key as tlsKey in options");
      }

      if (!options.tlsCert) {
        throw new Error("Missing Required certificate as tlsCert in options");
      }
    }
    this.host = options.host;
    this.options = {
      port: +options.port, // replace with your port
      host: options.host, // replace with your hostanme or IP address
      password: options.password, // replace with your password
      // optional, if using SSL
      // use `fs.readFile[Sync]` or another method to bring these values in
    };
    if (options.tlsKey) {
      this.options.tls = {
        key: options.tlsKey,
        cert: options.tlsKey,
        
      };
    }
    if(options.tlsCACerts && options.tlsKey){
      this.options.tls.ca = options.tlsCACerts
    }

    debug("options", options);
    let util = require("util");
    const self = this;
    return new Promise((resolve, reject) => {
      self.client = redis.createClient();
      resolve(self);
    });
  }

  connect() {
    debug("Connect to %s", this.url);
    // init redis client
    this.client = redis.createClient();
  }

  async getValue(name) {
    debug("getValue with name %s", name);
    try {
      if (this.client && this.client.connected) {
        return new Promise((resolve, reject) => {
          this.client.get(name,function(err,data){
            if(err){
              return reject(err);
            }else{
              resolve(data)
            }
          })
        })
      } else {
        debug("Redis server not connected. reconnecting...");
        await this.connect();
        debug("Redis server connected");
        return await this.getAsync(name);
      }
    } catch (e) {
      debug("getValue error %s", e.message);
      throw e;
    }
  }

  async setValue(name, value) {
    debug("setValue with name %s", name);
    try {
      if (this.client && this.client.connected) {
        // return await this.setAsync(name, value);
        return new Promise((resolve, reject) => {
          this.client.set(name,value,function(err){
            if(err){
              return reject(err);
            }else{
              resolve("success")
            }
          })
        })
      } else {
        debug("Redis server not connected. reconnecting...");
        await this.connect();
        debug("Redis server connected");
        return await this.setValue(name, value);
      }
    } catch (e) {
      debug("setValue error %s", e.message);
      throw e;
    }
  }
};
