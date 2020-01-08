//准备数据   
var root = {
  'name': 'self-employed',
  'children': [
    {
      'name': 'Y have pre-employers 1',
      'children': [
        {'name': 'Y star6'},
        {'name': 'N star5'}
      ]
    },
    {
      'name': 'N tech/IT company',
      'children': [
        {
          'name': 'Y have pre-employers 2',
          'children': [
            {'name': 'Y star2'},
            {'name': 'N star1'}
          ]
        },
        {
          'name': 'N tech/IT role',
          'children': [
            {
              'name': 'Y have pre-employers 3',
              'children': [
                {'name': 'Y star4'},
                {'name': 'N star3'}
              ]
            },
            {'name': 'N'}
          ]
        }
      ]
    }
  ]
}
var treeWidth  = 400;	//SVG绘制区域的宽度
var treeHeight = 200;	//SVG绘制区域的高度
  
//1. 根据root整理出数结构的数据
const hierarchyData = d3.hierarchy(root)
                        .sum(function(d){
                          return d.name
                        })
// console.log(hierarchyData, 'hierarchyData')
//2. 生成树状布局(数据获取器)
var tree = d3.tree()
.size([treeHeight-50, treeWidth-90])
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
var treeSvg = d3.select("body")			//选择<body>
      .append('div').attr('id', 'tree-wrap')
      .append("svg")			//在<body>中添加<svg>
      .attr("width", treeWidth)	//设定<svg>的宽度属性
      .attr("height", treeHeight)
      // .style("border", "solid 1px #000")//设定<svg>的高度属性
      .attr('class', 'svg-tree')
      // .attr('transform','translate(50, -50)')

var link = treeSvg.selectAll('.link')
  .data(links)
  .enter()
  .append('path')
  .attr('class', 'link')
  .attr('d', d3.linkHorizontal()  //linkHorizontal生成的曲线在曲线的终点和起点处的切线是水平方向
    .x(d=>d.y).y(d=>d.x))
    .attr('transform', 'translate(50, 0)')

var node = treeSvg.selectAll('.node')
  .data(nodes)
  .enter()
  .append('g')
  .attr('class', 'node')
  .attr('transform', function (d) { return 'translate(' + (d.y+50) + ',' + d.x + ')' })
  // console.log('nodes', nodes);
  // console.log('links', links);

var nodess = node.append('circle')
  .attr('r', 5)
  .attr("class", function(d) {
    // console.log(d.data.name, 'd.name???')
    return d.data.name;
  })
  .style("fill", "white")
  .on("mouseover", function(d,i) {
    d3.select(this).style("fill", "#00ffd4");
  })
  .on("mouseout", function(d,i) {
    d3.select(this).style("fill", "#00ffd4");
  })
  .on("click", function(d) {
    /* 父节点变色 */
    var current = d;
    // console.log(current.data.name, 'current.name');
    var parents = [current.data.name];
    for (var depth = 0; depth < d.depth; depth++) {
      current = current.parent;
      //d3.select(this).style("fill", "#00ffd4");
      parents.push(current.data.name);
    }
    // console.log(parents, 'parents');
    nodess.each(function(d) {
      if (parents.indexOf(d.data.name) > -1) {
        d3.select(this).style("fill", "#00ffd4");
      } else {
        d3.select(this). style("fill", "white");
      }
    });
    /* 筛选 */
    let selectedNode = d3.select(this).node()
    selectedNodeName = selectedNode.getAttribute('class')
    // console.log(data,'data')
    let newData = []
    for(let i in data) {
      newData.push(data[i])
    }
    data = newData.filter(d=> {return d['Are you self-employed?'] === 1})
    console.log(data, 'success')
    // console.log(selectedNodeName,'name')
  });

var texts = node.append('text')
  .attr('dy', -10)
  .attr('dx', 40)
  // .style('text-anchor', function (d) { return d.children ? 'end' : 'start' })
  .style('text-anchor', 'end')
  .text(function (d) {
    return d.data.name
  })
  .style("fill", "#ccc")
  .style('font-size', '11px')

  // var nodes = node.append("circle")
  //   .attr("r", 5)
  //   .attr("class", function(d) {
  //     return d.name;
  //   })
    // .style("fill", "white")
    // .on("mouseover", function(d,i) {
    //   d3.select(this).style("fill", "#00ffd4");
    // })
    // .on("mouseout", function(d,i) {
    //   d3.select(this).style("fill", "white");
    // })
    // .on("click", function(d) {
    //   var current = d;
    //   console.log(current.name);
    //   var parents = [current.name];
    //   for (var depth = 0; depth < d.depth; depth++) {
    //     current = current.parent;
    //     //d3.select(this).style("fill", "#00ffd4");
    //     parents.push(current.name);
    //   }
    //   console.log(parents);

    //   nodes.each(function(d) {
    //     if (parents.indexOf(d.name) > -1) {
    //       d3.select(this).style("fill", "#00ffd4");
    //     } else {
    //       d3.select(this). style("fill", "white");
    //     }
    //   });
    // });
  
