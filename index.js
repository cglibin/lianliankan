var byId = function (id) {  
    return document.getElementById(id);  
}  
var isKill = false;
var boxWidth = 60; //格子宽度
var num = 0;
var imgArr = [], boxs = {};
var h = 8,  //图片共8行  
    w = 11; //图片共11列 
var startBox = "",  //开始的格子  
    endBox = "";    //结束的格子  
var oImgArr;
var boxsLength;
var oAgainWrapper = document.getElementsByClassName("again-wrapper")[0],
    oAgain = document.getElementsByClassName("again")[0],
    oChoose = document.getElementsByClassName("choose")[0],
    oButtonArr = document.getElementsByClassName("grade"),
    oGameBox = document.getElementById("game-box");
 

//初始化  
function init() {  
    boxsLength = h*w;//图片方框的个数 
    var str = "";  
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {  
            str += '<img id="t' + i + '_l'+ j + '" src="img/blank.png">' 
        }
    }  
    oGameBox.innerHTML = str;  
    oGameBox.style.width = w * boxWidth + 'px';
    bind();
}  
function bind () {
    oImgArr = document.getElementsByTagName("img");
    oGameBox.onclick = function (e) {
        var event = e || window.event;
        choose(event.target);
    }
    // for (let i = 0; i < boxsLength; i++) {
    //     oImgArr[i].onclick = function () {
    //         console.log(this);
    //         choose(this);
    //     }
    // }
    oAgain.onclick = function () {
        window.location.reload();
    }

    oButtonArr[0].onclick = function () {
        num = 11; 
        pushArr();
    }
    oButtonArr[1].onclick = function () {
        num = 22;
        pushArr();
    }
}
function pushArr () {
    for (let i = 0; i < num; i++) {
        imgArr.push(i + 1);
    }
    oChoose.style.display = "none";
    oGameBox.style.display = "block";
    pushBoxArr();
    toHTML();  
}
// 产生88个格子（图片框）  
function pushBoxArr() {  
    let index = 0;  
    let last = imgArr.length - 1; 
    for (let i = 0; i < h; i++) {
        for (var j = 0;j < w;j++) {  
            var imgBox = new createBox(imgArr[index]);//用图片名创建,每张图片四次  
            boxs['t' + imgBox.t + '_l' + imgBox.l] = imgBox;//格子的位置(也是每张图片的id)  
            if (index === last) {  
                index = 0;  
            }else {  
                index += 1;  
            }  
        }  
    }  
} 
// 创建随机坐标的格子  
function createBox (name) {  
    var p = getPosition();  
    this.name = name;//图片名  
    this.t = p.t;//行  
    this.l = p.l;//列  
    this.position = 't' + p.t + '_l' + p.l;//位置 
}  
// 随机获取坐标  
function getPosition() {  
    let t, f;  
    getTempPosition();
    return {t:t, l:l}  
    function getTempPosition () {
        t = parseInt(Math.random() * h);  
        l = parseInt(Math.random() * w);  
        if (('t' + t + '_l' + l) in boxs) {  
            getTempPosition();
        }
    }
} 

// 初始化html  
function toHTML() {
    // console.log(boxs)
    for (var i in boxs) {//遍历所有图片的id  
        // console.log(oImgArr)
        oImgArr[i].src = 'img/' + boxs[i].name + '.jpg';
    }  
} 

// choose  
function choose(ele) { 
    if (ele.src.indexOf('blank') >= 0) {//鼠标点击了空白图片  
        return;  
    }else{  
        ele.className = 'active';//更改点击图片的样式  
        //第一次点击或点击了同一张图片  
        if (startBox == "" || startBox == ele.id) {  
            startBox = ele.id;  

        }else {//点击了第二张图片  
            endBox = ele.id; 
            if (boxs[startBox].name === boxs[endBox].name) {
                go(boxs[startBox], boxs[endBox]);
            }else {
                byId(startBox).className = "";  
                startBox = endBox;//指向第二张图片  
                endBox = "";
            } 
        }  
    }  
}   

// 判断是否连通  
function go(firstBox, secondBox) {
    var firstBoxPosition = firstBox.position,
        secondBoxPosition = secondBox.position;
    var temp; 

    //建立四个点，判断是否两两相通  
    var pt1, pt2, pt3, pt4;  
    // 上到下扫描  
    if (isKill == false) {  
    // 交换位置  
        if (firstBox.t > secondBox.t) {  
            temp = firstBox;  
            firstBox = secondBox;  
            secondBox = temp;  
        }  
        for (var i = -1; i <= h; i++) {  
            pt1 = firstBox;  
            pt2 = {t:i, l:firstBox.l};  
            pt3 = {t:i, l:secondBox.l};  
            pt4 = secondBox;  
            if( (!isNull(pt2) && (pt2.t != firstBox.t) ) || ( !isNull(pt3) && (pt3.t != secondBox.t) ) ){  
                continue;  
            }else if (link4pt(pt1, pt2, pt3, pt4)){  
                isKill = true;  
                kill(firstBox, secondBox);  
                showLine(pt1, pt2, pt3, pt4); 
                // break;  
                return;  
            }  
        }  
    }  

    // 左到右扫描  
    if (isKill == false) {  
    //交换位置  
        if (firstBox.l > secondBox.l) {  
            temp = firstBox;  
            firstBox = secondBox;  
            secondBox = temp;  
        }  
        for (var i = -1, len = w; i <= len; i++) {  
            pt1 = firstBox;  
            pt2 = {t:firstBox.t, l:i};  
            pt3 = {t:secondBox.t, l:i};  
            pt4 = secondBox;  
            if( (!isNull(pt2) && (pt2.l != firstBox.l) ) || ( !isNull(pt3) && (pt3.l != secondBox.l) ) ){  
                continue;  
            }  
            else if (link4pt(pt1, pt2, pt3, pt4)){  
                isKill = true;  
                kill(firstBox, secondBox);  
                showLine(pt1, pt2, pt3, pt4);  
                // break;  
                return;  
            }  
        }  
    }  

    //扫描完毕  
    if(isKill == false){  
        endBox = "";  
        byId(firstBoxPosition).className = "";  
        startBox = secondBoxPosition;  
    }  
}  


//干掉格子，删除boxArr中相应格子  
function kill(firstBox, secondBox) {
    boxs[firstBox.position] = null;  
    boxs[secondBox.position] = null;
    boxsLength -= 2;  
    startBox = "";  
    endBox = "";  
    isKill = false;
}  

// 显示链接路径  
function showLine(pt1, pt2, pt3, pt4) {  
    var line1 =show2pt(pt1,pt2);  
    var line2 = show2pt(pt2,pt3);  
    var line3 = show2pt(pt3,pt4);  
    var hideLine = function () {  
        oGameBox.removeChild(line1);  
        oGameBox.removeChild(line2);  
        oGameBox.removeChild(line3);  
        byId(pt1.position).src = 'img/blank.png';  
        byId(pt4.position).src = 'img/blank.png';
        byId(pt1.position).className = "";  
        byId(pt4.position).className = "";
        // console.log(boxsLength);
        if (boxsLength<=0) {  
            alert('亲，你赢了！好腻害啊。');  
            oAgainWrapper.style.display = "block"; 
            oGameBox.style.display = "none"; 
        }  
    }  
    setTimeout(hideLine, 300);  

    function show2pt (pt1, pt2){  
        var top, left, width, height, line = document.createElement('div');  
        var pt1 = pt1, pt2 = pt2, temp;  
        // 交换位置  
        if (pt1.t > pt2.t || pt1.l > pt2.l) {  
            temp = pt1;  
            pt1 = pt2;  
            pt2 = temp;  
        }  
        top = boxWidth * pt1.t + 30 + 'px';  
        left = boxWidth * pt1.l + 30 + 'px';  
        // 同行(t相等)  
        if (pt1.t == pt2.t) {  
            width = boxWidth * (pt2.l - pt1.l) + 1 + 'px';  
            height = '1px';  
        }  
        // 同列(l相等)  
        if (pt1.l == pt2.l) {  
            width = '1px';  
            height = boxWidth * (pt2.t - pt1.t) + 1 + 'px';  
        }  
        line.style.top = top;  
        line.style.left = left;  
        line.style.width = width;  
        line.style.height = height;  
        return oGameBox.appendChild(line);  
    }  
}  

// 单个格子是否空值  
function isNull (imgBox) {  
    return boxs['t' + imgBox.t + '_l' + imgBox.l] ? false : true;  
}  

// 2点是否连通  
function link2pt (firstBox, secondBox) {  
    var temp;
    var canLink = true;  
    // 交换位置  
    if (firstBox.t > secondBox.t || firstBox.l > secondBox.l) {  
        temp = firstBox;  
        firstBox = secondBox;  
        secondBox = temp;  
    }  
    if (firstBox.t == secondBox.t) {   //同行（t相等），a在b的左边  
        for (let i = firstBox.l + 1, len = secondBox.l - 1; i <= len; i++) {  
            if (boxs['t' + firstBox.t + '_l' + i]) {  
                canLink = false;  
                break;  
            }  
        }  
    }else if (firstBox.l == secondBox.l) {   //同列（l相等），a在b的上边  
        for (let i = firstBox.t + 1, len = secondBox.t - 1; i <= len; i++  ) {  
            if(boxs['t' + i + '_l' + firstBox.l]) {  
                canLink = false;  
                break;  
            }  
        }  
    }else {  
        throw ('位置错误：a.t=' + firstBox.t + ' secondBox.t=' + secondBox.t + ' firstBox.l=' + firstBox.l + ' secondBox.l=' + secondBox.l);  
    }  
    return canLink;  
}  

// 4个点是否两两连通  
function link4pt (pt1, pt2, pt3, pt4) {  
    return link2pt(pt1, pt2) && link2pt(pt2, pt3) && link2pt(pt3, pt4);  
}  
window.onload = init; 