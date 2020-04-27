/*
 Copyright 2018 Zhao Chaoyi All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0

*/

const RedisKVStore = require("../index");
const assert = require("assert");

let kvs;
describe("Test RedisKVStore", () => {
  it("Test constructor", async () => {
    kvs = await new RedisKVStore({
      port: 6379,
      host: "localhost",
      password: "",
    });
  });

  it("Test setValue", async () => {
    await kvs.setValue("test", "case");
    const res = await kvs.getValue("test");
    return assert.equal(res, "case");
  });
});
