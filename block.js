(function() {

    var X_NUM = 12;
    var Y_NUM = 22;
    var SIZE = 20;
    var BLOCK_DATA = {
	    t: [[[1, 1],[1, 1]],[[1, 1],[1, 1]],[[1, 1],[1, 1]],[[1, 1],[1, 1]]],
	    h: [[[1, 0],[1, 1],[0, 1]],[[0, 1, 1],[1, 1, 0]],[[1, 0],[1, 1],[0, 1]],[[0, 1, 1],[1, 1, 0]]],
	    o: [[[0, 1],[1, 1],[1, 0]],[[1, 1, 0],[0, 1, 1]],[[0, 1],[1, 1],[1, 0]],[[1, 1, 0],[0, 1, 1]]],
	    l: [[[1],[1],[1],[1]],[[1, 1, 1, 1]],[[1],[1],[1],[1]],[[1, 1, 1, 1]]],
	    k: [[[1, 0],[1, 0],[1, 1]],[[1, 1, 1],[1, 0, 0]],[[1, 1],[0, 1],[0, 1]],[[0, 0, 1],[1, 1, 1]]],
	    e: [[[0, 1, 0],[1, 1, 1]],[[1, 0],[1, 1],[1, 0]],[[1, 1, 1],[0, 1, 0]],[[0, 1],[1, 1],[0, 1]]]
	}
    var color = ['#02ffd9','#02b8fd','#ff8604','#f90a2c','#75ff00','#cd04ff'];
    var nextCtx = document.querySelector('#next').getContext('2d');
    var $score = document.querySelector('#score');
    var data = new Array(Y_NUM),
        colorArr = new Array(Y_NUM),
        offsetX,
        offsetY,
        blockType,
        nextBlockType,
        nextTypeNum,
        nextBlockColor,
        blockColor,
        typeNum,
        currentData,
        timer,
        score = 0;



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

    function getBlockColor(){
        return color[(Math.random() * 5).toFixed(0)];
    }

    function getBlockType() {
        return ['t', 'h', 'o', 'k', 'l', 'e'][(Math.random() * 5).toFixed(0)];
    }

    function getTypeNum() {
        return +(Math.random() * 3).toFixed(0);
    }

    function getCurrentData() {
        return BLOCK_DATA[blockType][typeNum];
    }

    function init(){
        data = new Array(Y_NUM);
        colorArr = new Array(Y_NUM);
        myEach(Y_NUM, function(num) {
            var arr = [];
            var carr = [];
            myEach(X_NUM, function() {
                arr.push(0);
                carr.push(0);
            })
            colorArr[num] = carr;
            data[num] = arr;
        })
        initBlock();
        timer = setInterval(down , 200);
    }

    function initNext(){
        nextTypeNum = getTypeNum();
        nextBlockType = getBlockType();
        nextBlockColor = getBlockColor();
        drawNext();
    }

    initNext();

    function initBlock(){
        offsetX = Math.floor(X_NUM / 2);;
        offsetY = -1;
        blockType = nextBlockType;
        typeNum = nextTypeNum;
        currentData = getCurrentData();
        blockColor = nextBlockColor;
        initNext();
    }
    
    init();
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    


    function drawBlock() {
        ctx.clearRect(0, 0, 400, 640);
        var x = offsetX * SIZE;
        var y = offsetY * SIZE;
        var _y = -1;
        var _x;
        ctx.fillStyle = blockColor;
        myEach(currentData, function(carr) {
            _y++, _x = -1;

            myEach(carr, function(v) {
                _x++;
                v && ctx.fillRect(x + _x * SIZE, y + _y * SIZE, SIZE - 1, SIZE - 1);
            })
        })
    }

    

    var bgCtx = document.querySelector('#bg').getContext('2d');
    bgCtx.fillStyle = '#FF0000';

    function drawBg() {
        ctx.clearRect(0, 0, 400, 640);
        bgCtx.clearRect(0, 0, 400, 640);
        var _y = -1;
        myEach(data,function(arr){
            _y++;
            var _x = -1;
            myEach(arr,function(num){
                _x++;
                num && (bgCtx.fillStyle = num,bgCtx.fillRect(_x * SIZE, _y * SIZE, SIZE - 1, SIZE - 1))
            })
        })
    }

    
    function drawNext(){
        nextCtx.fillStyle = nextBlockColor;
        nextCtx.clearRect(0, 0, 400, 640);
        var ndata = BLOCK_DATA[nextBlockType][nextTypeNum];
        var _left = (80 - ndata[0].length * 20) / 2
        var _top = (80 - ndata.length * 20) / 2;
        var y = -1;
        myEach(ndata,function(arr){
            y++;
            var x = -1;
            myEach(arr,function(v){
                x++;
                v && nextCtx.fillRect(_left + x * SIZE, _top + y * SIZE, SIZE - 1, SIZE - 1);
            })
        })
    }

    function left(){
        var flag = false;
        var bHeight = currentData.length;
        var bWidth =currentData[0].length;
        if(!offsetX)return;
        offsetX--;
        myEach(bHeight,function(num){
            var arr = data[offsetY + num];
            arr && myEach(bWidth,function(cnum){
                return flag = arr[offsetX + cnum] && currentData[num][cnum];
            });
            return flag;
        })
        flag && (offsetX++);
    }

    function right(){
        var flag = false;
        var bHeight = currentData.length;
        var bWidth =currentData[0].length;
        if(offsetX + bWidth >= X_NUM)return;

        offsetX++;
        myEach(bHeight,function(num){
            var arr = data[offsetY + num];
            arr && myEach(bWidth,function(cnum){
                return flag = arr[offsetX + cnum] && currentData[num][cnum];
            });
            return flag;
        })
        flag && (offsetX--);
    }

    function setData() {
        myEach(currentData, function(carr, index) {
            var arr = data[offsetY + index];
            arr && myEach(carr, function(v, cindex) {
                arr[offsetX + cindex] || (arr[offsetX + cindex] = v ? blockColor : v);
            })
        })
        myEach(data,function(arr,num){
            var total = 0;
            myEach(arr,function(v){
                v && total++;
            })
            total === X_NUM && (data[num] = null);
        });
        var list = [];
        myEach(data,function(arr){
           arr && list.push(arr);
        });
        var nums = Y_NUM - list.length;//消除了几行
        myEach(nums,function(){
            list.unshift(new Array(X_NUM))
        })
        score += [0,100,300,500,1000][nums] || 0;
        $score.innerHTML = score;
        data = list;
        if(isOver()){
            timer && (clearInterval(timer),timer = null);
            console.log('game over');
        }
        initBlock();
        drawBg();
    }

    function isOver(){
        var isOver;
        myEach(data[0],function(v){
            return isOver = v;
        })

        return isOver;
    }

    function down(){
        var bHeight = currentData.length,
            bWidth = currentData[0].length,
            tempArr = data[offsetY + bHeight],
            flag = false;
        if (offsetY + bHeight >= Y_NUM) {//已经到了底部
            setData();
            return;
        }

        myEach(bHeight, function(num) {
            var arr = data[offsetY + num];
            arr && myEach(bWidth, function(cnum) {
                return flag = arr[offsetX + cnum] && currentData[num][cnum];
            })
            return flag;
        })
        flag || myEach(currentData[bHeight - 1],function(v,num){
            return flag = v && tempArr[offsetX + num];
        })
        
        flag ? setData() : (offsetY++,drawBlock());//如果碰到点则停止移动并设置数据 否则往下移动一格
    }

    function trans(){
        typeNum > 2 ? typeNum = 0 : typeNum++;
        currentData = getCurrentData();
        var width = currentData[0].length;
        var x = offsetX + width;
        x > X_NUM && (offsetX = X_NUM - width);
    }
        
    var isPause;
    function pause(){
        timer ? (clearInterval(timer),timer = null) : (down(),timer = setInterval(down , 200));
        isPause = !timer;
    }

    function start(){
        timer && clearInterval(timer);
        ctx.clearRect(0, 0, 400, 640);
        bgCtx.clearRect(0, 0, 400, 640);
        init();
        document.querySelector('#pause').innerHTML = '暂停';
        document.querySelector('#score').innerHTML = '0';
    }


    document.onkeydown = function(e) {
        if(e.keyCode == 32){
            pause();
            return;
        }
        if(e.keyCode == 13){
            start();
            return;
        }
        if(isPause) return;

        switch (e.keyCode) {
            case 37:
                left();
                break;
            case 38:
                trans();
                break;
            case 39:
                right();
                break;
            case 40:
                down();
                break;
        }
        drawBlock();
    }

    window.onMleft = function(){
        if(isPause) return;
        left();
    }
    window.onMright = function(){
        if(isPause) return;
        right();
    };
    window.onMdown = function(){
        if(isPause) return;
        down();
    }
    window.onMup = function(){
        if(isPause) return;
        trans();
    }
    window.onPause = function(){
        document.querySelector('#pause').innerHTML = timer ? '继续' : '暂停';
        pause();
    }
    window.onRestart = function(){
        document.querySelector('#pause').innerHTML = '暂停';
        start();
    }
}())
