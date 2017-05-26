"use strict";

/*global describe, it, before, beforeEach, after, afterEach */

const assert = require("assert");
const lb = require("../../built/util/load_balance");

describe('LoadBalancer', function () {
    describe('constructor', function () {
        it('empty list', function () {
            let data = [];
            assert.throws(() => { let target = new lb.LoadBalancer(data); }, Error, "Should throw an error");
        });
        it('non-empty list', function () {
            let data = [
                { name: "wrkr1", weight: 1 }
            ];
            let target = new lb.LoadBalancer(data);
        });
    });
    describe('1 worker', function () {
        it('non-empty list', function () {
            let data = [
                { name: "wrkr1", weight: 1 }
            ];
            let target = new lb.LoadBalancer(data);
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
        });
    });
    describe('2 workers', function () {
        it('same initial load', function () {
            let data = [
                { name: "wrkr1", weight: 1 },
                { name: "wrkr2", weight: 1 }
            ];
            let target = new lb.LoadBalancer(data);
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
        });
        it('different initial load - wrkr1 is higher', function () {
            let data = [
                { name: "wrkr1", weight: 4 },
                { name: "wrkr2", weight: 1 }
            ];
            let target = new lb.LoadBalancer(data);
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
        });
        it('different initial load - wrkr2 is higher', function () {
            let data = [
                { name: "wrkr1", weight: 1 },
                { name: "wrkr2", weight: 4 }
            ];
            let target = new lb.LoadBalancer(data);
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
        });
    });
    describe('3 workers', function () {
        it('same initial load', function () {
            let data = [
                { name: "wrkr1", weight: 1 },
                { name: "wrkr2", weight: 1 },
                { name: "wrkr3", weight: 1 }
            ];
            let target = new lb.LoadBalancer(data);
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
        });
        it('different initial load - wrkr1 is highest', function () {
            let data = [
                { name: "wrkr1", weight: 4 },
                { name: "wrkr2", weight: 1 },
                { name: "wrkr3", weight: 1 }
            ];
            let target = new lb.LoadBalancer(data);
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
        });
        it('different initial load - wrkr2 is highest', function () {
            let data = [
                { name: "wrkr1", weight: 1 },
                { name: "wrkr2", weight: 4 },
                { name: "wrkr3", weight: 1 }
            ];
            let target = new lb.LoadBalancer(data);
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
        });
        it('different initial load - wrkr3 is highest', function () {
            let data = [
                { name: "wrkr1", weight: 1 },
                { name: "wrkr2", weight: 1 },
                { name: "wrkr3", weight: 4 }
            ];
            let target = new lb.LoadBalancer(data);
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
        });
    });
});
describe('LoadBalancerEx', function () {
    describe('Simple tests without affinity', function () {
        describe('constructor', function () {
            it('empty list', function () {
                let data = [];
                assert.throws(() => { let target = new lb.LoadBalancerEx(data); }, Error, "Should throw an error");
            });
            it('non-empty list', function () {
                let data = [
                    { name: "wrkr1", weight: 1 }
                ];
                let target = new lb.LoadBalancerEx(data);
            });
        });
        describe('1 worker', function () {
            it('non-empty list', function () {
                let data = [
                    { name: "wrkr1", weight: 1 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
            });
        });
        describe('2 workers', function () {
            it('same initial load', function () {
                let data = [
                    { name: "wrkr1", weight: 1 },
                    { name: "wrkr2", weight: 1 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            });
            it('different initial load - wrkr1 is higher', function () {
                let data = [
                    { name: "wrkr1", weight: 4 },
                    { name: "wrkr2", weight: 1 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            });
            it('different initial load - wrkr2 is higher', function () {
                let data = [
                    { name: "wrkr1", weight: 1 },
                    { name: "wrkr2", weight: 4 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
            });
        });
        describe('3 workers', function () {
            it('same initial load', function () {
                let data = [
                    { name: "wrkr1", weight: 1 },
                    { name: "wrkr2", weight: 1 },
                    { name: "wrkr3", weight: 1 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            });
            it('different initial load - wrkr1 is highest', function () {
                let data = [
                    { name: "wrkr1", weight: 4 },
                    { name: "wrkr2", weight: 1 },
                    { name: "wrkr3", weight: 1 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            });
            it('different initial load - wrkr2 is highest', function () {
                let data = [
                    { name: "wrkr1", weight: 1 },
                    { name: "wrkr2", weight: 4 },
                    { name: "wrkr3", weight: 1 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            });
            it('different initial load - wrkr3 is highest', function () {
                let data = [
                    { name: "wrkr1", weight: 1 },
                    { name: "wrkr2", weight: 1 },
                    { name: "wrkr3", weight: 4 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(), "wrkr3", "Incorrect worker proposed");
            });
        });
    });
    describe('Tests with affinity, equal load', function () {
        describe('2 workers', function () {
            it('same initial load', function () {
                let data = [
                    { name: "wrkr1", weight: 0 },
                    { name: "wrkr2", weight: 0 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
            });
            it('different initial load - wrkr1 is higher', function () {
                let data = [
                    { name: "wrkr1", weight: 3 },
                    { name: "wrkr2", weight: 0 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
            });
            it('different initial load - wrkr2 is higher', function () {
                let data = [
                    { name: "wrkr1", weight: 0 },
                    { name: "wrkr2", weight: 1 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
            });
        });
        describe('3 workers', function () {
            it('same initial load', function () {
                let data = [
                    { name: "wrkr1", weight: 0 },
                    { name: "wrkr2", weight: 0 },
                    { name: "wrkr3", weight: 0 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr3", "Incorrect worker proposed");
            });
            it('different initial load - wrkr1 is highest', function () {
                let data = [
                    { name: "wrkr1", weight: 4 },
                    { name: "wrkr2", weight: 0 },
                    { name: "wrkr3", weight: 0 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr3", "Incorrect worker proposed");
            });
            it('different initial load - wrkr2 is highest', function () {
                let data = [
                    { name: "wrkr1", weight: 0 },
                    { name: "wrkr2", weight: 1 },
                    { name: "wrkr3", weight: 0 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr3", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"]), "wrkr3", "Incorrect worker proposed");
            });
        });
    });
    describe('Tests without affinity, unequal load', function () {
        describe('2 workers', function () {
            it('same initial load', function () {
                let data = [
                    { name: "wrkr1", weight: 0 },
                    { name: "wrkr2", weight: 0 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(null, 2), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(null, 2), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr2", "Incorrect worker proposed");
            });
            it('uneven initial load', function () {
                let data = [
                    { name: "wrkr1", weight: 1 },
                    { name: "wrkr2", weight: 0 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(null, 2), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(null, 2), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(null, 1), "wrkr1", "Incorrect worker proposed");
            });
        });
    });
    describe('Tests with affinity, unequal load', function () {
        describe('2 workers', function () {
            it('same initial load', function () {
                let data = [
                    { name: "wrkr1", weight: 0 },
                    { name: "wrkr2", weight: 0 }
                ];
                let target = new lb.LoadBalancerEx(data);
                assert.equal(target.next(["wrkr1"], 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 4), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 2), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 1), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 7), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 1), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 1), "wrkr2", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 1), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 5), "wrkr1", "Incorrect worker proposed");
                assert.equal(target.next(["wrkr1"], 1), "wrkr2", "Incorrect worker proposed");
            });
        });
    });
});
