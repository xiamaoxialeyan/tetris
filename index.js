var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var data = new Array(22);
for (var i = 0; i < 22; i++) {
    var arr = [];
    for (var j = 0; j < 12; j++) {
        arr.push(0);
    }
    data[i] = arr;
}

function myEach(obj, fn, context) {
    if (!obj) return;
    var toStr = Object.prototype.toString.call(obj);
    if (toStr === '[object Array]') {
        for (var i = 0, length = obj.length; i < length; i++) {
            if (fn.apply(context || this, [obj[i], i])) break;
        }
        return;
    }

    if (toStr === '[object Object]') {
        for (var key in obj) {
            if (fn.apply(this || context, [obj[key]], key)) break;
        }
        return;
    }

    if (toStr === '[object Number]') {
        var num = 0;
        while (num < obj) {
            fn.call(this || context, num) && (num = obj);
            num++;
        }
    }

}

ctx.fillStyle = '#FF0000';

// var gradient = ctx.createLinearGradient(0, 0, 170, 0);
// gradient.addColorStop("0", "magenta");
// gradient.addColorStop("0.5", "blue");
// gradient.addColorStop("1.0", "red");



// var Block = function(opts){
// 	this.options = opts;
// 	this.el = opts.el;
// 	this.ctx = this.el.getContext('2d');
// }

var blockData = {
    t: [
        [
            [1, 1],
            [1, 1]
        ],
        [
            [1, 1],
            [1, 1]
        ],
        [
            [1, 1],
            [1, 1]
        ],
        [
            [1, 1],
            [1, 1]
        ]
    ],
    h: [
        [
            [1, 0],
            [1, 1],
            [0, 1]
        ],
        [
            [0, 1, 1],
            [1, 1, 0]
        ],
        [
            [1, 0],
            [1, 1],
            [0, 1]
        ],
        [
            [0, 1, 1],
            [1, 1, 0]
        ]
    ],
    o: [
        [
            [0, 1],
            [1, 1],
            [1, 0]
        ],
        [
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0]
        ],
        [
            [1, 1, 0],
            [0, 1, 1]
        ]
    ],
    l: [
        [
            [1],
            [1],
            [1],
            [1]
        ],
        [
            [1, 1, 1, 1]
        ],
        [
            [1],
            [1],
            [1],
            [1]
        ],
        [
            [1, 1, 1, 1]
        ]
    ],
    k: [
        [
            [1, 0],
            [1, 0],
            [1, 1]
        ],
        [
            [1, 1, 1],
            [1, 0, 0]
        ],
        [
            [1, 1],
            [0, 1],
            [0, 1]
        ],
        [
            [0, 0, 1],
            [1, 1, 1]
        ]
    ],
    e: [
        [
            [0, 1, 0],
            [1, 1, 1]
        ],
        [
            [1, 0],
            [1, 1],
            [1, 0]
        ],
        [
            [1, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1]
        ]
    ]
}



function draw(data, x, y) {
    ctx.clearRect(0, 0, 400, 640);
    var _y = -1;
    myEach(data, function(arr) {
        _y++;
        var _x = -1;
        myEach(arr, function(v) {
            _x++;
            v && ctx.fillRect(x + _x * 20, y + _y * 20, 19, 19);
        })
    })
}

function isCollision() {
    var bdata = blockData[blockType][typeNum],
        bWidth = bdata.length,
        flag = false;
    bHeight = bdata[0].length;
    if (offsetY + bHeight > 21) return true;
    myEach(bHeight, function(num) {
        var arr = data[offsetY + num];
        myEach(bWidth, function(cnum) {
            return flag = arr[offsetX + cnum];
        })
        return flag;
    })
    return flag;
}

function getBlockType() {
    return ['t', 'h', 'o', 'k', 'l', 'e'][(Math.random() * 5).toFixed(0)];
}

var blockType = getBlockType();
var typeNum = +(Math.random() * 3).toFixed(0);
var offsetY = -1;
var offsetX = 6;
var bWidth = 0;
var bHeight = 0;

var timer = setInterval(function() {
    typeNum > 3 && (typeNum = 0);
    var bdata = blockData[blockType][typeNum];
    // bWidth = bdata.length;
    // bHeight = bdata[0].length;
    offsetY++;
    if (isCollision()) {
        var __y = offsetY;
        myEach(bdata, function(carr, index) {
            var arr = data[offsetY + index];
            arr && myEach(carr, function(v, cindex) {
                arr[offsetX + cindex] = v;
            })
        })
        drawBg();
        offsetY = 23;
    }
    if (offsetY > 22) {
        offsetY = -1;
        blockType = getBlockType();
        offsetX = 6;
    }
    draw(bdata, offsetX * 20, offsetY * 20);
}, 500)

var moveLeft = function() {
    offsetX--;
}
var moveRight = function() {
    offsetX++;
}

var trans = function() {
    typeNum++;
}

var bgCtx = document.querySelector('#bg').getContext('2d');
bgCtx.fillStyle = '#FF0000';

function drawBg() {
    bgCtx.clearRect(0, 0, 400, 640);
    var _y = -1;
    data.forEach(function(arr) {
        _y++;
        var _x = -1;
        arr.forEach(function(num) {
            _x++;
            num && bgCtx.fillRect(_x * 20, _y * 20, 19, 19);
        })

    })
}
drawBg();

var speed = function() {

}

var down = function(e){
	console.log(e);
}
