//准备数据   
var root = {
  'name': 'Self-employed',
  'children': [
    {
      'name': 'Y Pre-employers 1',
      'children': [
        {'name': 'Y cluster1'},
        {'name': 'N cluster2'}
      ]
    },
    {
      'name': 'N Tech-company',
      'children': [
        {
          'name': 'Y Pre-employers 2',
          'children': [
            {'name': 'Y cluster3'},
            {'name': 'N cluster4'}
          ]
        },
        {
          'name': 'N Tech-role',
          'children': [
            {
              'name': 'Y Pre-employers 3',
              'children': [
                {'name': 'Y cluster5'},
                {'name': 'N cluster6'}
              ]
            },
            {'name': 'N'}
          ]
        }
      ]
    }
  ]
}

var highlightColor = '#FF00B1'
var this_node = null
//1. 根据root整理出数结构的数据
const hierarchyData = d3.hierarchy(root)
                        .sum(function(d){
                          return d.name
                        })
// console.log(hierarchyData, 'hierarchyData')
//2. 生成树状布局(数据获取器)
var tree = d3.tree()
.size([180, 200])
.separation(function (a, b) {
  return (a.parent === b.parent ? 1 : 2) / a.depth
})
//3. 初始化树状图数据（绘制树的基本数据）
var treeData = tree(hierarchyData);
//4. 获取节点
var nodes = treeData.descendants();
//5. 获取边，连线
var links = treeData.links();

//6. 开始绘制树！
var treeSvg = d3.select("#tree-nav")
      .append("svg")			//在<body>中添加<svg>
      .attr("width", 350)	//设定<svg>的宽度属性
      .attr("height", 170)
      .append("g")
      .attr('transform','translate(80, -10)')

var horizontal = d3.linkHorizontal() //linkHorizontal生成的曲线在曲线的终点和起点处的切线是水平方向
  .x(d => d.y)
  .y(d => d.x);

var link = treeSvg.selectAll(".link")
.data(links)
.enter()
.append("path")
.attr("fill", "none")
.attr("stroke", function(d) {
  if (d.source.data.name == 'N Tech-role' && d.target.data.name == 'N') {
    return "#aaa";
  } else  return "white";
})
.attr("stroke-width", 2.5)
.attr('d', horizontal)

var node = treeSvg.selectAll(".node")
.data(nodes)
.enter()
.append("g")
.attr("class", "node")
.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
var nodesCircles = node.append("circle")
.attr("r", 5)
.attr("fill", function(d) {
    if (d.data.name == 'N') {
      return "#aaa";
    } else {
      return "white";
    }
})
.style("cursor", "pointer")
.attr('class', function(d) {
  return d.data.name
})
.on("mouseover", function(d,i) {
  d3.select(this).attr("r", 6)
})
.on("mouseout", function(d,i) {
  d3.select(this).attr("r", 5)
})
.on("click", function(d) {
  this_node = d;
  current_node = d;
  // console.log(current_node.depth);
  var parent_nodes = [current_node.data.name];
  var parent_links = [];
  for (var depth = 0; depth < d.depth; depth++) {
        var current_link = current_node.data.name;
        current_node = current_node.parent;
        current_link = current_node.data.name + " To " + current_link;
        parent_nodes.push(current_node.data.name);
        parent_links.push(current_link);
  }
  // console.log(parent_nodes, parent_links);
/* 筛选 */
  let selectedNode = d3.select(this).node() //获取当前节点
  selectedNodeName = selectedNode.getAttribute('class') //获取当前节点的className
  // console.log(selectedNodeName, 'selectedNodeName')
  // console.log(selectedNodeName)
  switch(selectedNodeName) {
    case "Self-employed":
      posData = []
      for (let i in data.rows) {
        //if (i < 100) {
          // console.log(data[i]['Are you self-employed?'], '?@@@!!!')
          let item = data.rows[i].obj;
            posData.push({
                // 画面中心坐标 +- 比例尺
                'id': i,
                'self-employed': item['Are you self-employed?'],
                'IT-company': item['Is your employer primarily a tech company/organization?'],
                'pre-employers': item['Do you have previous employers?'],
                'Tech-role': item['Is your primary role within your company related to tech/IT?'],
                'x': tempWindowWidth/2 + xPosScale*item.x,
                'y': tempWindowHeight/2 + yPosScale*item.y,
                'ox': 0,
                'oy': 0,
                'condition': item['If so, what condition(s) were you diagnosed with?'].split('|'),
                'view': item['Do you think that team members/co-workers would view you more negatively if they knew you suffered from a mental health issue?']
            })
        } 
      // console.log(posData, 'posData????')
    break;
    case "N cluster4":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '1' && d['pre-employers'] == '0'}) //根据className筛选posData里边的人群，从而更新posData
      // posData.forEach((pos, i) => {
      //   pos.x = pos.x - tempWindowWidth/2
      //   pos.y = pos.y - tempWindowHeight/2
      //   console.log(pos.x, 'pos.x-1')
      // })
      // console.log(posData, 'posData')
    break;
    case "Y cluster3":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '1' && d['pre-employers'] == '1'}) 
      posData.forEach((pos, i) => {
        // console.log(pos.x, 'pos.x-2')
      })
    break;
    case "N cluster6":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0' && d['pre-employers'] == '0' && d['Tech-role'] == '1'}) 
    break;
    case "Y cluster5":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0' && d['pre-employers'] == '1' && d['Tech-role'] == '1'}) 
    break;
    case "N cluster2":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '1' && d['pre-employers'] == '0' }) 
    break;
    case "Y cluster1":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '1' && d['pre-employers'] == '1' }) 
    break;
    case "N":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0' && d['Tech-role'] == '0' })
      // console.log(posData, 'posData')
    break;
    case "Y Pre-employers 1":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '1' })
      // console.log(posData, 'posData')
    break;
    case "N Tech-company":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' })
      // console.log(posData, 'posData')
    break;
    case "Y Pre-employers 2":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '1'})
      // console.log(posData, 'posData')
    break;
    case "Y Pre-employers 2":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '1'})
      // console.log(posData, 'posData')
    break;
    case "N Tech-role":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0'})
      // console.log(posData, 'posData')
    break;
    case "Y Pre-employers 3":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0' && d['Tech-role'] == '1'})
      // console.log(posData, 'posData')
    break;
    default:
   
    break;
  }
  nodesCircles.each(function(d) {
    if (d.data.name == 'N') {
      d3.select(this).attr("fill", "#aaa")
    }
  });

  link.each(function(d) {
      if (parent_links.indexOf(d.source.data.name + " To " + d.target.data.name) > -1) {
          d3.select(this).attr("stroke", "#00ffd4");
      } else {
          d3.select(this). attr("stroke", "white");
      }
      if (d.source.data.name == 'N Tech-role' && d.target.data.name == 'N') {
      d3.select(this).attr("stroke", "#aaa")
    }
  });
})

  setInterval(function() {
    let random = Math.round(Math.random() * ((nodes.length - 1) + 1))
    nodesCircles.attr("stroke", function(d, i) {
      if(i === random) {
        // return "#00ffd4"
        return '#ff99e5'
      } 
    }).attr("fill", function(d, i) {
      // let random = Math.round(Math.random() * ((nodes.length - 1) + 1))
      if(i === random) {
        return '#ff99e5'
      }

      if(this_node) {
        if(((d.data.name === this_node.data.name) && (i !== random))) {
          // console.log(d.data.name, this_node.data.name, '??##')
          // return "#00ffd4"
          return highlightColor
        }
      }
      
      return 'white'

    })
}, 1000)

  
var texts = node.append("text")
.attr("dx", function(d) { return d.children ? -8 : 8; })
.attr("dy", 4)
.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
.attr("fill", "white")
.attr("stroke", "white")
.attr("stroke-width", 0.1)
.style("font-size", 10)
.text(function(d) { 
  if (d.depth > 0) {    
    if (d.data.name.slice(2) == 'Pre-employers 1' || d.data.name.slice(2) == 'Pre-employers 2' || d.data.name.slice(2) == 'Pre-employers 3' ) {
      return 'Pre-employers';
    } else {
      return d.data.name.slice(2);
    }
  } else {
    return d.data.name;
  }
});

