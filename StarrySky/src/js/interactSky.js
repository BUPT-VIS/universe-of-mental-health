let recPosX, recPosY, recWidth, recHeight, endPosX, endPosY;
// js 禁用鼠标右键功能
document.oncontextmenu = () => false;
function mousePressed(e) {
  //判断是否在svg区域上，是的话禁用鼠标
  // console.log(d3.event.target,'d3.event.target.localName')
  if(e.toElement.tagName === 'CANVAS') {
    // console.log("canvas");
    // console.log(e.toElement.tagName,'e')
    switch (mouseButton) {
      case LEFT:
          recWidth = 0;
          recHeight = 0;
          recPosX = mouseX;
          recPosY = mouseY;
          // console.log(recPosX, recPosY);
      break;
      case RIGHT:
          // 记录鼠标相对元素的偏移量
          recX = mouseX - recPosX;
          recY = mouseY - recPosY;
          posData.forEach((pos, i) => {
              pos.ox = mouseX - pos.x;
              pos.oy = mouseY - pos.y;
          })
          document.getElementsByTagName('canvas')[0].setAttribute('class','move-state');
      break;
    }
    document.getElementById("popupBox").style.display = "none"; 
  }
}

function mouseDragged(e) {
    if(e.toElement.tagName === 'CANVAS') {
      switch (mouseButton) {
        case LEFT:
          recWidth = mouseX - recPosX;
          recHeight = mouseY - recPosY;
          // console.log(recWidth, 'recWidth')
        break;
        case RIGHT:
          // 根据偏移量修改位置坐标
          recPosX = mouseX - recX;
          recPosY = mouseY - recY;
          posData.forEach((pos, i) => {
              pos.x = mouseX - pos.ox;
              pos.y = mouseY - pos.oy;
          })
          document.getElementsByTagName('canvas')[0].setAttribute('class','move-state');
        break;
      }
    }
  }

  function mouseReleased(e) {
    if(e.toElement.tagName === 'CANVAS') {
      switch(mouseButton) {
        case LEFT:
            recWidth = Math.abs(recWidth)
            recHeight = Math.abs(recHeight)
            useLasso();
        break;
        case RIGHT:
            document.getElementsByTagName('canvas')[0].removeAttribute('class','move-state')
        break;
      }
    }
  }

  function changeButton(btn) {
    if(btn.id == 'lasso') {
      buttonState = 'lasso'
      document.getElementsByClassName('lasso-icon')[0].style.opacity = .6
      document.getElementsByClassName('drag-icon')[0].style.opacity = 1
      document.getElementsByClassName('right-side')[0].style.right = "-292px"
      document.getElementById("showBtn").setAttribute("value", "true")
      // console.log(document.getElementById("showBtn").getAttribute("value"))
    } else if(btn.id == 'drag') {
      buttonState = 'drag'
      document.getElementsByClassName('drag-icon')[0].style.opacity = .6
      document.getElementsByClassName('lasso-icon')[0].style.opacity = 1
    }
  }

// 滚轮改变缩放没有过渡效果，但触控板连续变化
function mouseWheel(event) {
// console.log(event, 'event')
if(event.toElement.tagName === 'CANVAS') {
// delta = 125 滚动一格的默认高度值，wheelScale 缩放比率
if (event.delta < 0) {
  wheelScale = 1.25; // 上滚放大
  R *= (1*wheelScale); // 错位感
} else {
  wheelScale = 0.8; // 下滚缩小 取倒数
  R *= (wheelScale/1); // 错位感
}
  // 大小按照比例缩放
  size *= wheelScale;

  // 放大后的终点位置
  endPosX = windowWidth/2 + wheelScale * ((recPosX + recWidth) - windowWidth/2);
  endPosY = windowHeight/2 + wheelScale * ((recPosY + recHeight) - windowHeight/2);

  // 放大后的起点位置
  recPosX = windowWidth/2 + wheelScale * (recPosX - windowWidth/2);
  recPosY = windowHeight/2 + wheelScale * (recPosY - windowHeight/2);

  // 放大后的长度和宽度
  recWidth = endPosX - recPosX;
  recHeight = endPosY - recPosY;

  posData.forEach((pos, i) => {

      // 偏移量 = 缩放比率 * (元素位置 - 画面中心)
      pos.ox = wheelScale * (pos.x - windowWidth/2);
      pos.oy = wheelScale * (pos.y - windowHeight/2);

      // 画面中心 + 偏移量 = 元素位置
      pos.x = windowWidth/2 + pos.ox;
      pos.y = windowHeight/2 + pos.oy;
  })

  // 禁用浏览器默认滚动
  return false;
}

}

/* 使用套索工具 */
function useLasso() {
    idList = [];
    newDataSet = [];
    d3.select('#svgWrapper').remove();
    showDetailClickCount = 1;
    document.getElementsByClassName("right-side")[0].style.right = "10px";
    
    endPosX = mouseX;
    endPosY = mouseY;
    //值得注意的是不同的拖动方向（左上，右上，左下，右下），绘制的方法有区别，需要交换一下值 
    let tempSwitchX, tempSwitchY
    if(endPosX < recPosX) {
        tempSwitchX = recPosX
        recPosX = endPosX
        endPosX = tempSwitchX
    }
    if(endPosY < recPosY) {
        tempSwitchY = recPosY
        recPosY = endPosY
        endPosY = tempSwitchY
    }
    //遍历每个bubble，符合位置的即为选中
    for (let i = 0; i < posData.length; i++) {
        let CanXX = posData[i].x
        let CanYY = posData[i].y
        //如果没有拖拽，只有点击：
        let d = int(dist(mouseX, mouseY, CanXX, CanYY ))
        let dragConditions = Number(CanXX) < Number(endPosX) && Number(CanXX) > Number(recPosX) && Number(CanYY) < Number(endPosY) && Number(CanYY) > Number(recPosY)
        if(dragConditions || d < 10 ) {
        // console.log(d,'d')
        if(idList.indexOf(posData[i].id) === -1) {
            idList.push(posData[i].id)
        }
        }
    }
    for(let i=0; i< idList.length; i++) {
            newDataSet.push(dataSet[idList[i]])
    }
    drawPlanet(newDataSet, 380)
    if(idList.length > 0) {
        document.getElementById('empty-container').style.display = 'none'
        document.getElementById('svgContainer').style.display = 'block'
        document.getElementById('detail-legend').style.display = 'block'
    } else {
        document.getElementById('empty-container').style.display = 'flex'
        d3.select("#svgContainer").select("svg").remove()
        document.getElementById('detail-legend').style.display = 'none'
        document.getElementsByClassName('right-side')[0].style.right = '-450px'
    }
    // document.getElementById('svgContainer').setAttribute('class', 'slidedown')
    }