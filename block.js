(function() {

    var X_NUM = 12;
    var Y_NUM = 22;
    var SIZE = 20;
    var OFFSET_X = Math.floor(X_NUM / 2);
    var BLOCK_DATA = {
	    t: [[[1, 1],[1, 1]],[[1, 1],[1, 1]],[[1, 1],[1, 1]],[[1, 1],[1, 1]]],
	    h: [[[1, 0],[1, 1],[0, 1]],[[0, 1, 1],[1, 1, 0]],[[1, 0],[1, 1],[0, 1]],[[0, 1, 1],[1, 1, 0]]],
	    o: [[[0, 1],[1, 1],[1, 0]],[[1, 1, 0],[0, 1, 1]],[[0, 1],[1, 1],[1, 0]],[[1, 1, 0],[0, 1, 1]]],
	    l: [[[1],[1],[1],[1]],[[1, 1, 1, 1]],[[1],[1],[1],[1]],[[1, 1, 1, 1]]],
	    k: [[[1, 0],[1, 0],[1, 1]],[[1, 1, 1],[1, 0, 0]],[[1, 1],[0, 1],[0, 1]],[[0, 0, 1],[1, 1, 1]]],
	    e: [[[0, 1, 0],[1, 1, 1]],[[1, 0],[1, 1],[1, 0]],[[1, 1, 1],[0, 1, 0]],[[0, 1],[1, 1],[0, 1]]]
	}
    var data = new Array(Y_NUM),
        offsetX = OFFSET_X,
        offsetY = -1,
        flag = false,
        timer, currentData, blockType, typeNum;




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

    function setBlockType() {
        blockType = ['t', 'h', 'o', 'k', 'l', 'e'][(Math.random() * 5).toFixed(0)];
    }

    function setTypeNum() {
        typeNum = +(Math.random() * 3).toFixed(0);
    }

    function getCurrentData() {
        return BLOCK_DATA[blockType][typeNum];
    }

    function setData() {
        if (isCollision()) {
            myEach(currentData, function(carr, index) {
                var arr = data[offsetY + index];
                arr && myEach(carr, function(v, cindex) {
                    arr[offsetX + cindex] || (arr[offsetX + cindex] = v);
                })
            })
            drawBg();
            offsetY = -1;
            offsetX = OFFSET_X;
            setBlockType();
            setTypeNum();
            currentData = getCurrentData();
        }

        drawBlock();
    }

    function isCollision() {
        var bHeight = currentData.length,
            bWidth = currentData[0].length,
            flag = false;
        if (offsetY + bHeight >= Y_NUM) return true;

        myEach(bHeight, function(num) {
            var arr = data[offsetY + num];
            arr && myEach(bWidth, function(cnum) {
                return flag = arr[offsetX + cnum];
            })
            return flag;
        })
        return flag;
    }

    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FF0000';


    function drawBlock() {
        ctx.clearRect(0, 0, 400, 640);
        var x = offsetX * SIZE;
        var y = offsetY * SIZE;
        var _y = -1;
        var _x;

        myEach(currentData, function(carr) {
            _y++, _x = -1;

            myEach(carr, function(v) {
                _x++;
                v && ctx.fillRect(x + _x * SIZE, y + _y * SIZE, SIZE - 1, SIZE - 1);
            })
        })
    }

    myEach(Y_NUM, function(num) {
        var arr = [];
        myEach(X_NUM, function() {
            arr.push(0);
        })
        data[num] = arr;
    })
    setBlockType();
    setTypeNum();
    currentData = getCurrentData();

    timer = setInterval(function() {
    	if(flag) return;
        offsetY++;
        setData();
    }, 400)

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
                num && bgCtx.fillRect(_x * SIZE, _y * SIZE, SIZE - 1, SIZE - 1);
            })
        })
    }
    drawBg();


    document.onkeydown = function(e) {
    	flag = true;
        switch (e.keyCode) {
            case 37:
                offsetX--;
                break;
            case 38:
                typeNum > 2 ? typeNum = 0 : typeNum++;
                currentData = getCurrentData();
                break;
            case 39:
                offsetX++;
                break;
            case 40:
                offsetY = offsetY + 3;
                offsetY >= Y_NUM && (offsetY = Y_NUM);
        }

        drawBlock();
        flag = false
    }
}())
