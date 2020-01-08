//准备数据   
var root = {
  'name': 'Self-employed',
  'children': [
    {
      'name': 'Y Pre-employers 1',
      'children': [
        {'name': 'Y star6'},
        {'name': 'N star5'}
      ]
    },
    {
      'name': 'N Tech-company',
      'children': [
        {
          'name': 'Y Pre-employers 2',
          'children': [
            {'name': 'Y star2'},
            {'name': 'N star1'}
          ]
        },
        {
          'name': 'N Tech-role',
          'children': [
            {
              'name': 'Y Pre-employers 3',
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
  
//1. 根据root整理出数结构的数据
const hierarchyData = d3.hierarchy(root)
                        .sum(function(d){
                          return d.name
                        })
// console.log(hierarchyData, 'hierarchyData')
//2. 生成树状布局(数据获取器)
var tree = d3.tree()
.size([200, 350])
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
      .attr("width", 450)	//设定<svg>的宽度属性
      .attr("height", 250)
      // .style("border", "solid 1px #000")//设定<svg>的高度属性
      .attr('class', 'svg-tree')
      .append("g")
      .attr('transform','translate(50, 20)')

var horizontal = d3.linkHorizontal() //linkHorizontal生成的曲线在曲线的终点和起点处的切线是水平方向
  .x(d => d.y)
  .y(d => d.x);

var link = treeSvg.selectAll(".link")
.data(links)
.enter()
.append("path")
.style("fill", "none")
.style("stroke", "white")
.style("stroke-width", 3)
.attr('d', horizontal)
.on("click", function(d) {
    console.log(d.source.data.name, d.target.data.name);
});

var node = treeSvg.selectAll(".node")
.data(nodes)
.enter()
.append("g")
.attr("class", "node")
.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
var nodes = node.append("circle")
.attr("r", 5)
.style("fill", "white")
.style("cursor", "pointer")
.on("mouseover", function(d,i) {
  d3.select(this).style("stroke", "#00ffd4").style("stroke-width", 2);
})
.on("mouseout", function(d,i) {
  d3.select(this).style("stroke", "none");
})
.on("click", function(d) {
  var current_node = d;
  console.log(current_node.data.name);
  var parent_nodes = [current_node.data.name];
    var parent_links = [];
  for (var depth = 0; depth < d.depth; depth++) {
        var current_link = current_node.data.name;
    current_node = current_node.parent;
        current_link = current_node.data.name + " To " + current_link;
    parent_nodes.push(current_node.data.name);
        parent_links.push(current_link);
  }
  console.log(parent_nodes, parent_links);

  nodes.each(function(d) {
    if (parent_nodes.indexOf(d.data.name) > -1) {
      d3.select(this).style("fill", "#00ffd4");
    } else {
      d3.select(this). style("fill", "white");
    }
  });

    link.each(function(d) {
        if (parent_links.indexOf(d.source.data.name + " To " + d.target.data.name) > -1) {
            d3.select(this).style("stroke", "#00ffd4");
        } else {
            d3.select(this). style("stroke", "white");
        }
    });
});
  
var texts = node.append("text")
.attr("dx", function(d) { return d.children ? -8 : 8; })
.attr("dy", 15)
.style("text-anchor", "middle"/*function(d) { return d.children ? "end" : "start"; }*/)
.style("fill", "#aaa")
.style("stroke", "#aaa")
.style("stroke-width", 0.1)
.style("font-size", 10)
.text(function(d) { return d.data.name; });
