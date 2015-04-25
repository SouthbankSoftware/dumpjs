'use strict';

var D = require('../../app/dump');

function squeeze (str) {
    return str.replace(/\s/ig, '');
}

describe('Restore objects', function () {


    it('Restore deep object 3', function () {
        var obj = {
            x: 1,
            y: 'abc',
            z: false,
            f: {
                a: 2,
                b: {
                    c: 'text',
                    d: {g: true}
                }
            }
        };

        expect(D.restore(D.dump(obj))).to.be.eql(obj);
    });

    it('Restore recursive object', function () {
        var obj = { x: 1, y: 'abc'};
        obj.z = obj;

        expect(D.restore(D.dump(obj))).to.be.eql(obj);
    });

    it('Restore recursive object 2', function () {
        var obj = { x: 1, y: 'abc', z: {a: 1}};
        obj.z.b = obj;
        obj.z.c = obj.z;

        var obj2 = D.restore(D.dump(obj));
        //console.log(D.dump(obj));
        //console.log(obj);
        //console.log(obj2);
        expect(obj2).to.be.eql(obj);
    });

    /*
        it('Serialize empty obj literal', function () {
            var dumpedObj = squeeze('{"@0": {}}');
            expect(D.dump({})).to.be.eql(dumpedObj);
        });

        it('Serialize simple obj literal', function () {
            var obj = {x: 1, y: 2};

            var dumpedObj = JSON.stringify({'@0': {x: 1, y: 2}});
            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Serialize composite obj literal 1', function () {
            var obj2 = {z: 1};
            var obj = {x: 1, y: 2, f: obj2};

            var dumpedObj = JSON.stringify({
                '@0': {x: 1, y: 2, f: '@1'},
                '@1': {z: 1}
            });
            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Serialize composite obj literal 2', function () {
            var obj2 = {z: 1};
            var obj3 = {y: 1};
            var obj = {x: 1, f: obj2, c: obj3};

            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, 'f': '@1', 'c': '@2'},
                '@1': {'z': 1},
                '@2': {'y': 1}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Serialize composite obj literal 3', function () {
            var obj3 = {y: 1};
            var obj2 = {z: 1, c: obj3};
            var obj = {x: 1, f: obj2};

            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, 'f': '@1'},
                '@1': {'z': 1, c: '@2'},
                '@2': {'y': 1}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Serialize composite multileve obj literal', function () {
            var obj5 = {d: 1, k: 2};
            var obj4 = {a: 1, l: obj5};
            var obj3 = {y: 1, m: obj4};
            var obj2 = {z: 1, c: obj3};
            var obj = {x: 1, f: obj2};

            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, f: '@1'},
                '@1': {'z': 1, c: '@2'},
                '@2': {'y': 1, m: '@3'},
                '@3': {'a': 1, l: '@4'},
                '@4': {d: 1, k: 2}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Serialize composite obj with recursion', function () {
            var obj2 = {z: 1, c: null};
            var obj = {x: 1, f: obj2};
            obj2.c = obj;
            obj.a = obj;

            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, 'f': '@1', a: '@0'},
                '@1': {'z': 1, c: '@0'}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Serialize empty array', function () {
            var arr = [];
            var dumpedObj = JSON.stringify({
                '@0': []
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Serialize primitive array', function () {
            var arr = [1, 2, 3, 'abc', true];
            var dumpedObj = JSON.stringify({'@0': [1, 2, 3, 'abc', true]});

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Serialize composite array', function () {
            var obj = {x: 1};
            var arr = [1, 2, obj, 3];

            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 3],
                '@1': {x: 1}
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Serialize composite array 2', function () {
            var obj = {x: 1, y: {z: 'a', f: {d: 1}}};
            var arr = [1, 2, obj, 3];
            obj.o = obj;
            obj.y.f.a = obj;

            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 3],
                '@1': {x: 1, y: '@2', o: '@1'},
                '@2': {z: 'a', f: '@3'},
                '@3': {d: 1, a: '@1'}
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Serialize composite array 3', function () {
            var arr = [1, 2, [3, 4], 5, [6]];

            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 5, '@2'],
                '@1': [3, 4],
                '@2': [6]
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Serialize composite array 4', function () {
            var arr = [1, 2, [3, 4, [6, 7, {x: 2}]], 8, [9]];

            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 8, '@2'],
                '@1': [3, 4, '@3'],
                '@2': [9],
                '@3': [6, 7, '@4'],
                '@4': {x: 2}
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Serialize recursive array', function () {
            var arr = [1, 2, [3, 4], 8];
            arr[2].push(arr);
            arr.push(arr);

            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 8, '@0'],
                '@1': [3, 4, '@0']
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });


        it('Map test', function () {
            var m = new Map();
            var id = 2;
            m.set('id0', 0);
            m.set('id1', 1);
            m.set('id2', 2);

            var iterator = m.entries();
            var entry;

            while ((entry = iterator.next(), !entry.done)) {
                // console.log(entry);
                if (id < 7) {
                    id++;
                    m.set('id' + id, id);
                }
            }
        });

        */
});