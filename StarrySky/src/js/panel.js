var showLeft = false;
var showLegend = true;

document.getElementById("popupBox").style.display = "none";
//var showDetailClickCount = 0;

function showDetail() {
    var showDetail = document.getElementById("showBtn").getAttribute("value");
    if (showDetail == "false") {
      drawPlanet(newDataSet, windowWidth-90);
      document.getElementsByClassName("left-side")[0].style.display = "none";
      document.getElementsByClassName("detail-icon")[0].style['background-image'] = '';
      // document.getElementsByClassName("right-side")[0].style.right = "10px";
      document.getElementsByClassName("right-panel")[0].style.width = '100%'
      document.getElementById("showBtn").setAttribute("value", "true");
    }
    else if(showDetail == "true") {
      drawPlanet(newDataSet, 350);
      document.getElementsByClassName("left-side")[0].style.display = "block";
      document.getElementsByClassName("detail-icon")[0].style['background-image'] = 'url(img/arrow.svg)';
      document.getElementsByClassName("right-panel")[0].style.width = 350 + 'px';
      document.getElementById("showBtn").setAttribute("value", "false");
    }
  }

  function closeDetail() {
    document.getElementsByClassName("left-side")[0].style.display = "block";
    d3.select("#svgContainer").select("svg").remove();
    document.getElementById('empty-container').style.display = 'flex'
    //var showDetail = document.getElementById("showBtn").getAttribute("value");
    document.getElementsByClassName("right-side")[0].style.right = "-450px";
    recHeight = 0;
    recWidth = 0;
    document.getElementById("detail-legend").style.display = "none";
}

function changeLegend() {
  if(showLegend === true) {
    document.getElementById("detail-legend").style.display = "none"
    document.getElementById("detail-legend__btn").style.display = "block"
    showLegend = false
  } else {
    document.getElementById("detail-legend").style.display = "block"
    document.getElementById("detail-legend__btn").style.display = "none"
    showLegend = true
  }
}

function showLeftDetail(obj) {
    if(obj.id === 'showNavigation') {
      if(showLeft === false) {
        document.getElementsByClassName("left-side")[0].style.left = "-400px";
        showLeft = true
      } else {
        document.getElementsByClassName("left-side")[0].style.left = "10px";
        showLeft = false
      }
    }
  }

