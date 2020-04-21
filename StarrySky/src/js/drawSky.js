let data = {}; //全局对象
let bubbles = []; //全局数组
var datas = [];
let SizeSlider;
var idList = [] //每次圈选的item的id
var newDataSet = [] //每次圈选的全局数据
var dataSet = []; //全局数据
var item_interval = 10; //每个气泡的间距
var posData = [];//存放点的最终位置的数组
var posDataTotal = [];
var initPosData = [];
var size = 1;//缩放比率
R = 0.8;//星球的布局半径  
var B;
var drag = false;
var wheelScale; //缩放常数（1.25 ，-1.25）
var currentSliderBarValue; //
var selectedNodeName; //树：筛选名
var xPosScale, yPosScale;
var tempWindowWidth, tempWindowHeight
var useCanvasValid = false;

//载入JSON
let table;
function preload() {
  //data = loadJSON("2016.json");
  data = loadTable('mental-health-in-tech-2016.csv', 'csv', 'header');
}

function setup() {
  var xScale = windowWidth/(80*2);
  var yScale = windowHeight/(40*2);
  xPosScale = xScale;
  yPosScale = yScale;
  // SizeSlider = createSlider(0, 25, 1.5);
  // SizeSlider.class('size-sliderbar')

  // process data
  for (let i in data.rows) {
    var item = data.rows[i].obj;
    //console.log(i, item);
    posData.push({
        // 画面中心坐标 +- 比例尺
        'id': i,
        'self-employed': item['Are you self-employed?'],
        'IT-company': item['Is your employer primarily a tech company/organization?'],
        'pre-employers': item['Do you have previous employers?'],
        'Tech-role': item['Is your primary role within your company related to tech/IT?'],
        'x': windowWidth/2 + xScale*item.x,
        'y': windowHeight/2 + yScale*item.y,
        'ox': 0,
        'oy': 0,
        'condition': split(item['If so, what condition(s) were you diagnosed with?'], '|'),
        'view': item['Do you think that team members/co-workers would view you more negatively if they knew you suffered from a mental health issue?']
    })

    dataSet.push(item);
  } 
  posDataTotal = posData;
  // createCanvas(windowWidth, windowHeight);
  // noStroke();
}

/* 绘制图像 */
function draw() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    var t = millis() / 1000;
    // size = SizeSlider.value();
    push();
    fill('rgba(255,255,255,0.2)');
    //noFill();
    stroke('rgba(255,255,255,0.4)');
    strokeWeight(1);
    rect(recPosX, recPosY, recWidth, recHeight, 2);
    pop();
    tempWindowWidth = windowWidth;
    tempWindowHeight = windowHeight;

    posData.forEach((pos, i) => {
        // 计算明度
        var brightness = 70 + 6*pos.condition.length;
        // 计算小圆半径 星环半径
        var r = 0, ring = 0;
        if (pos.view == "Yes, they do") {
            r = size * (pos.condition.length*Math.abs(sin(10*t+0.1*i)));
        } else if (pos.view == "Yes, I think they would") {
            r = size * (pos.condition.length*Math.abs(sin(4*t+0.1*i)));
        } else if (pos.view == "Maybe") {
            r = size * (pos.condition.length*Math.abs(sin(2*t+0.1*i)));
        } else if (pos.view == "No, I don't think they would") {
            r = size * (pos.condition.length );
            ring = 8 * size;
        } else if (pos.view == "No, they do not") {
            r = size * (pos.condition.length);
            ring = 25 * size;
        }

        // 星环
        push();
        stroke(255, brightness);
        strokeWeight(size/4);
        noFill();
        if (ring > 0)  ellipse(pos.x, pos.y, ring, ring);
        pop();

        // 病情
        var dx, dy; // 小圆偏移
        pos.condition.forEach((condition, j) => {
            // 没病的人或一种病 无偏移
            if (pos.condition.length == 1) {
                dx = 0; dy = 0;
            }
            // 多于一种病 有偏移
            else {
                dx = (r/3) * sin(j * TWO_PI / pos.condition.length);
                dy = (r/3) * cos(j * TWO_PI / pos.condition.length);
            }                
            push();
            colorMode(HSB, 360, 100, 100, 100); //色相 饱和度 明度 透明度
            //fill(240, 1, brightness, brightness / 10); 
            blendMode(LIGHTEST); //加色混合

            if (condition == 'Mood Disorder (Depression, Bipolar Disorder, etc)') {
                fill(354.24, 354.24, brightness);
            } else if (condition == 'Anxiety Disorder (Generalized, Social, Phobia, etc)') {
                fill(285.47, 78.84, brightness);
            } else if (condition == 'Attention Deficit Hyperactivity Disorder') {
                fill(253.71, 80.41, brightness);
            } else if (condition == 'Post-traumatic Stress Disorder') {
                fill(230.61, 73.06, brightness);
            } else if (condition == 'Obsessive-Compulsive Disorder') {
                fill(220.66, 74.09, brightness);
            } else if (condition == 'Substance Use Disorder') {
                fill(190.54, 58.73, brightness);
            } else if (condition == 'Personality Disorder (Borderline, Antisocial, Paranoid, etc)') {
                fill(157.82, 51.97, brightness);
            } else if (condition == 'Stress Response Syndromes') {
                fill(132.4, 53.54, brightness);
            } else if (condition == 'Addictive Disorder') {
                fill(93.29, 68.92, brightness);
            } else if (condition == 'Eating Disorder (Anorexia, Bulimia, etc)') {
                fill(53.76, 68.65, brightness);
            } else if (condition == 'Dissociative Disorder') {
                fill(30.65, 77.18, brightness);
            } else if (condition == 'Psychotic Disorder (Schizophrenia, Schizoaffective, etc)') {
                fill(12.24, 83.4, brightness);
            } else if (condition == '') {
            push();
            rectMode(CENTER);
            translate(pos.x,pos.y);
            rotate(PI / 4);
            fill(255, 100);
            rect(0, 0, r, r);
            pop();
            } else {
                fill(100, 100, brightness);
            }
            ellipse(pos.x + dx, pos.y + dy, r, r);
            pop();
        })
    })
    }