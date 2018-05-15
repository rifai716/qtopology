"use strict";

/*global describe, it, before, beforeEach, after, afterEach */

const assert = require("assert");
const tb = require("../../built/std_nodes/transform_bolt");

function test(input, output, template, done) {
    let emited = [];
    let name = "some_name";
    let xdata = input;
    let xdata_out = output;
    let xstream_id = null;
    let config = {
        onEmit: (data, stream_id, callback) => {
            emited.push({ data, stream_id });
            callback();
        },
        output_template: template
    };
    let target = new tb.TransformBolt();
    target.init(name, config, null, (err) => {
        assert.ok(!err);
        target.receive(xdata, xstream_id, (err) => {
            assert.ok(!err);
            assert.equal(emited.length, 1);
            assert.deepEqual(emited[0].data, xdata_out);
            assert.equal(emited[0].stream_id, xstream_id);
            done();
        });
    });
}

describe.only('TransformBolt', function () {
    it('constructable', function () {
        let target = new tb.TransformBolt();
    });
    it('init', function (done) {
        let emited = [];
        let name = "some_name";
        let config = {
            onEmit: (data, stream_id, callback) => {
                emited.push({ data, stream_id });
                callback();
            },
            output_template: { b: "a" }
        };
        let target = new tb.TransformBolt();
        target.init(name, config, null, (err) => {
            assert.ok(!err);
            done();
        });
    });
    describe('single level', function () {
        it('single level 1', function (done) {
            test(
                { a: true },
                { b: true },
                { b: "a" },
                done
            );
        });
        it('single level 2', function (done) {
            test(
                { a: true, x: 12, z: "abc", y: "###" },
                { b: true, c: 12, d: "abc" },
                { b: "a", c: "x", d: "z" },
                done
            );
        });
    });
    describe('2-level', function () {
        it('2-level 1', function (done) {
            test(
                { a: true },
                { b: { x: true } },
                { b: { x: "a" } },
                done
            );
        });
        it('2-level 2', function (done) {
            test(
                { a: true, b: "xyz", c: new Date(12345678908) },
                { b: { x: true }, c: { r: new Date(12345678908) } },
                { b: { x: "a" }, c: { r: "c" } },
                done
            );
        });
    });
    describe('single level + deep', function () {
        it('single level 1', function (done) {
            test(
                { w: { a: true } },
                { b: true },
                { b: "w.a" },
                done
            );
        });
        it('single level 2', function (done) {
            test(
                { a: true, t: { x: 12, z: "abc" }, y: "###" },
                { b: true, c: 12, d: "abc" },
                { b: "a", c: "t.x", d: "t.z" },
                done
            );
        });
    });
    describe('csv real-life', function () {
        it('csv 1', function (done) {
            test(
                { ts: new Date(1526381842000), country: "SI", browser: "Chrome", amount: 123.45, duration: 432 },
                {
                    ts: new Date(1526381842000),
                    tags: {
                        country: "SI",
                        browser: "Chrome"
                    },
                    values: {
                        amount: 123.45,
                        duration: 432
                    }
                },
                {
                    ts: "ts",
                    tags: {
                        country: "country",
                        browser: "browser"
                    },
                    values: {
                        amount: "amount",
                        duration: "duration"
                    }
                },
                done
            );
        });
    });
});
