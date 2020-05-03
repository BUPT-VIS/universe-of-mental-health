 function drawPlanet(dataSet, width) {
        /* 开始分隔, 分割后的数据用来直接data()绑定,排序的转折点 */
        // console.log("luna",width,dataSet);
        var sampleNum;
        if (width == 350) {
          sampleNum = 4;
          // console.log("4")
        } else {
          sampleNum = int(width/90); //这里的数量根据显示器宽度修改
          // console.log(sampleNum)
          //document.getElementById("left-side").style.display = "none";
        }
        var len = dataSet.length
        var rowLen = len/sampleNum
        /*求年龄最大值 最小值*/
        var ageList = dataSet.map(function(d) {
          let age = Number(d['What is your age?'])
          if(age > 0 && age < 100) {
            return age
          }
        })
        var rowDataSet = sliceArray(dataSet, sampleNum);
        //var width = 350
        var height = 70*(rowLen+15)
        d3.select('#svgContainer').select("svg").remove();
        var svg = d3.select('#svgContainer').append('svg').attr('id','svgWrapper').attr('width', width).attr('height', height);
        /* 通过循环row数组达到每行绘制的效果 */
        rowDataSet.forEach((item, i) => {
        let row = svg.append('g').attr('rowKey', i).attr('transform', function() {
          return 'translate(60, '+ (i*110+90) +')'
        })
        let g = row.selectAll('.element').data(item).enter().append('g').attr('class','element')
        .attr('transform', function(d, i) {
          return 'translate(' + (i*90-30) +','+ 0 +'), rotate(0)'
          // return 'translate(' + posData[i]['x'] +','+ posData[i]['y'] +'), rotate(0)'
        })
        .on("mouseover", function(d, i) {
          // showPopup(d)
          // console.log('000')
        })

        let light_radius = 22
        let single_angle = Math.PI/13
        let pos_radius = light_radius - 9
        let opacity_value = .7
            // Detect the appropriate vendor prefix.
        var prefix = "-webkit-transform" in document.body.style ? "-webkit-"
        : "-moz-transform" in document.body.style ? "-moz-"
        : "";
        var conditionsList = ['Mood Disorder (Depression, Bipolar Disorder, etc)', 'Anxiety Disorder (Generalized, Social, Phobia, etc)', 'Attention Deficit Hyperactivity Disorder',
         'Post-traumatic Stress Disorder' ,'Obsessive-Compulsive Disorder', 'Substance Use Disorder', 
         'Personality Disorder (Borderline, Antisocial, Paranoid, etc)', 'Stress Response Syndromes', 'Addictive Disorder',
         'Eating Disorder (Anorexia, Bulimia, etc)', 'Dissociative Disorder', 'Psychotic Disorder (Schizophrenia, Schizoaffective, etc)',
         'Other']

         let condition_colors = ['#eb3a4b', '#c333f1', '#5d30f5', 
         '#425ef5', '#407bf7', '#68e2fc',
         '#6ee5b9', '#69e282', '#9bfb4e',
         '#fcea4f', '#f19637', '#eb4f27','#ffffff']
         
         function filterSplit(str, gap) {
            let realArr = []
            let arr = split(str, gap)
            if(arr[0] !== "") {
              realArr = arr
            }
            return realArr
         }

         /*  再次绘制光晕*/
         g.selectAll('.halo').data(function(d) {
           //循环元素，每一次获取到元素的conditions,
           //每绘制一个光晕，判断它在当前花瓣应该在的位置
          let conditions = filterSplit(d['If so, what condition(s) were you diagnosed with?'], '|')
          let angleForXY = angleSelfAdaption(conditions, pos_radius, 0)
          let halos = []
          for(let i = 0; i < conditions.length; i++) {
            let currentColorForConditionsIndex = conditionsList.indexOf(conditions[i])
            currentColorForConditionsIndex= currentColorForConditionsIndex !== -1 ? currentColorForConditionsIndex : 12
            let conColor = condition_colors[currentColorForConditionsIndex]
            let haloObj = {
              'cx': angleForXY[i].x,
              'cy': angleForXY[i].y,
              'color': conColor
            }
            halos.push(haloObj)
          }
          //  console.log(d)
           //根据conditions返回绘制光晕数据的数组，动态的长度
           return halos
         }).enter().append('circle')
         .attr('class','halo')
         .attr('r', light_radius)
         .attr('cy', d=>d.cy)
         .attr('cx', d=>d.cx)
         .attr('fill',d=>d.color)
         .attr('fill-opacity', opacity_value)
         .style("filter", "url(#motionFilter)")

        var sizeScale = d3.scaleLinear().domain([d3.min(ageList), d3.max(ageList)]).range([0, 300]);
        var transformScale = d3.scaleLinear().domain([d3.min(ageList), d3.max(ageList)]).range([.5, 1.8]);
        var defs = svg.append("defs");

        //Initialize the filter
        defs.append("filter")
            .attr("id", "motionFilter") //Give it a unique ID
            //Increase the width of the filter region to remove blur "boundary"
            .attr("width", "300%")
            //Put center of the "width" back in the middle of the element
            .attr("x", "-100%")
            .append("feGaussianBlur") //Append a filter technique
            .attr("class", "blurValues") //Needed to select later on
            .attr("in", "SourceGraphic") //Apply blur on the applied element
            //Do a blur of 8 standard deviations in the horizontal
            //direction and 0 in vertical
            .attr("stdDeviation", "5 5");
      
        //公司环境1：benefits
        g.append("ellipse")
        .attr("rx", function(d) {
          let benefits = d['Does your employer provide mental health benefits as part of healthcare coverage?']
          if( benefits === 'Yes') {
            return 25
          }  else {
            return 0
          }
        })
        .attr("ry", 10)
        .attr('stroke', '#fff')
        .attr('fill', 'transparent')
        .attr('stroke-width', 1)
        .attr("transform", "rotate(90)")
        .attr('stroke-dasharray', 1)

        //公司环境2：options
        g.append("ellipse")
        .attr("rx", function(d) {
          let options = d['Do you know the options for mental health care available under your employer-provided coverage?']
          if( options === 'Yes') {
            return 25
          } else {
            return 0
          }
        })
        .attr("ry", 10)
        .attr('stroke','#fff')
        .attr('fill', 'transparent')
        .attr('stroke-width', 1)
        .attr("transform", "rotate(-45)")
        .attr('stroke-dasharray', 1)

         //公司环境3：discussion
         g.append("ellipse")
        .attr("rx", function(d) {
          let discussion = d['Has your employer ever formally discussed mental health (for example, as part of a wellness campaign or other official communication)?']
          if( discussion === 'Yes') {
            return 25
          } else {
            return 0
          }
        })
        .attr("ry", 10)
        .attr('stroke','#fff')
        .attr('stroke-width', 1)
        .attr('fill', 'transparent')
        .attr("transform", "rotate(0)")
        .attr('stroke-dasharray',1)

        //公司环境4：seek_help
        g.append("ellipse")
        .attr("rx", function(d) {
          let seek_help = d['Does your employer offer resources to learn more about mental health concerns and options for seeking help?']
          // console.log(seek_help,'seek_help')
          if( seek_help === 'Yes') {
            return 25
          } else {
            return 0
          }
        })
        .attr("ry", 10)
        .attr('stroke','#fff')
        .attr('fill', 'transparent')
        .attr('stroke-width', 1)
        .attr("transform", "rotate(45)")
        .attr('stroke-dasharray', 1)

        
        //公司环境5(老板)：medical_coverage
        g.append("ellipse")
        .attr("rx", function(d) {
          let medical_coverage = d['Do you have medical coverage (private insurance or state-provided) which includes treatment of mental health issues?']
          // console.log(medical_coverage,'medical_coverage')
          if(medical_coverage == 1) {
            return 25
          } else {
            return 0
          }
        })
        .attr("ry", 10)
        .attr('stroke','#fff')
        .attr('fill', 'transparent')
        .attr('stroke-width', 1)
        .attr("transform", "rotate(-45)")
        // .attr('stroke-dasharray', 1)

        //公司环境6(老板)：online_resources
        g.append("ellipse")
        .attr("rx", function(d) {
          let online_resources = d['Do you know local or online resources to seek help for a mental health disorder?']
          if(online_resources == 'I know some') {
            return 25
          } else {
            return 0
          }
        })
        .attr("ry", 10)
        .attr('stroke','#fff')
        .attr('fill', 'transparent')
        .attr('stroke-width', 1)
        .attr("transform", "rotate(45)")
        // .attr('stroke-dasharray', 1)

        /**** 倾诉程度 ****/
        //倾诉对象: coworkers
        g.append("circle")
          // .attr('r', 10)
          .attr('r',function(d) {
            let coworkers = d['Would you feel comfortable discussing a mental health disorder with your coworkers?']
            if( coworkers === 'Yes') {
              return 15
            } else {
              return 0
            }
          })
          .attr('fill', '#fff')
          .attr('fill-opacity', .2)
          .attr('stroke-width', .5)
          // .attr('stroke-dasharray', 1)

        //倾诉对象: supervisor
        g.append("circle")
          // .attr('r', 15)
          .attr("transform", 'rotate(45)')
          .attr("r", function(d) {
            let supervisor = d['Would you feel comfortable discussing a mental health disorder with your direct supervisor(s)?']
            if( supervisor === 'Yes') {
              return 20
            } else {
              return 0
            }
          })
          .attr('fill', '#fff')
          .attr('fill-opacity', .18)
          .attr('stroke-width', .5)
          // .attr('stroke-dasharray', 1)

        //倾诉对象: employer
        g.append("circle")
          .attr("transform", 'rotate(-45)')
          .attr("r", function(d) {
            let employer = d['Do you think that discussing a mental health disorder with your employer would have negative consequences?']
            if( employer === 'Yes') {
              return 25
            } else {
              return 0
            }
          })
          .attr('fill', '#fff')
          .attr('fill-opacity', .12)
          .attr('stroke-width', .5)
          // .attr('stroke-dasharray', 1)

        /****  映射职业啦:卫星  ****/
        let satellite_self_radius = 1
        let satellite_radius = 27
        let single_satellite_angle = Math.PI/12
        let pos_list = ['Back-end Developer', 'Front-end Developer', 'Supervisor/Team Lead', 
        'DevOps/SysAdmin', 'Support', 'One-person shop', 
        'Designer', 'Dev Evangelist/Advocate', 'Executive Leadership',
        'Sales', 'HR', 'Other']

        g.selectAll('.satellite').data(function(d) {
           //循环元素，每一次获取到元素的positions,
           //每绘制一个光晕，判断它在当前花瓣应该在的位置
          let positions = filterSplit(d['Which of the following best describes your work position?'], '|')
          let angleForXY = angleSelfAdaption(pos_list, satellite_radius, -Math.PI)
          let satellites = []
          for(let i = 0; i < positions.length; i++) {
            let currentColorForPositionsIndex = pos_list.indexOf(positions[i])
            currentColorForPositionsIndex= currentColorForPositionsIndex !== -1 ? currentColorForPositionsIndex : 11
            // let conColor = condition_colors[currentColorForConditionsIndex]
            let satellitesObj = {
              'cx': angleForXY[currentColorForPositionsIndex].x,
              'cy': angleForXY[currentColorForPositionsIndex].y,
            }
            satellites.push(satellitesObj)
          }
          //  console.log(d)
           //根据conditions返回绘制光晕数据的数组，动态的长度
           return satellites
         }).enter().append('circle')
         .attr('class','satellite')
         .attr('r', satellite_self_radius)
         .attr('cy', d=>d.cy)
         .attr('cx', d=>d.cx)
         .attr('fill', '#fff')

        //绘制菱形
        g.append('path')
        .attr('d', d3.symbol().type(d3.symbolSquare).size(function(d) {
          let age = Number(d['What is your age?'])
          if(age > 0 && age < 100) {
            return sizeScale(age)
          } else {
            return 0
          }
        }))
        .attr('fill',function(d) {
          if(d['What is your gender?'] === 'Male') {
            return '#fff'
          }  else {
            return 'transparent'
          }
        })
        .attr('transform', 'rotate(45)')
        .attr('class', 'planet-opacity')
        .style(prefix + "animation-duration", function(d) {
          let question_str = d['Do you think that team members/co-workers would view you more negatively if they knew you suffered from a mental health issue?']
          if( question_str === 'Yes, they do') {
            return '1s'
          } else if (question_str === 'Yes, I think they would') {
            return '2s'
           }else if (question_str === "Maybe") {
            return '3s'
           }else if (question_str === "No, I don't think they would") {
            return '4s'
           }else if (question_str === "No, they do not") {
            return '5s'
           } else {
             return '0s'
           }
        })

        //绘制圆形
        g.append('path')
        .attr('d', d3.symbol().type(d3.symbolCircle).size(function(d) {
          let age = Number(d['What is your age?'])
          if(age > 0 && age < 100) {
            return sizeScale(age)
          } else {
            return 0
          }
        }))
        .attr('fill',function(d) {
          if(d['What is your gender?'] === 'Female') {
            return '#fff'
          }  else {
            return 'transparent'
          }
        })
        .attr('class', 'planet-opacity')
        .style(prefix + "animation-duration", function(d) {
          let question_str = d['Do you think that team members/co-workers would view you more negatively if they knew you suffered from a mental health issue?']
          if( question_str === 'Yes, they do') {
            return '1s'
          } else if (question_str === 'Yes, I think they would') {
            return '2s'
           }else if (question_str === "Maybe") {
            return '3s'
           }else if (question_str === "No, I don't think they would") {
            return '4s'
           }else if (question_str === "No, they do not") {
            return '5s'
           } else {
             return '0s'
           }
        })

        //绘制三角形
        g.append('path')
        .attr('d', d3.symbol().type(d3.symbolTriangle).size(function(d) {
          let age = Number(d['What is your age?'])
          if(d['What is your gender?'] !== 'Female' && d['What is your gender?'] !== 'Male' && age > 0 && age < 100) {
            return sizeScale(Number(d['What is your age?']))
          } else {
            return 0
          }
        }))
        .attr('fill','#fff')
        .attr('class', 'planet-opacity')
        .style(prefix + "animation-duration", function(d) {
          let question_str = d['Do you think that team members/co-workers would view you more negatively if they knew you suffered from a mental health issue?']
          if( question_str === 'Yes, they do') {
            return '1s'
          } else if (question_str === 'Yes, I think they would') {
            return '2s'
           }else if (question_str === "Maybe") {
            return '3s'
           }else if (question_str === "No, I don't think they would") {
            return '4s'
           }else if (question_str === "No, they do not") {
            return '5s'
           } else {
             return '0s'
           }
        })

        g.on('click', function(d) {
          // console.log(d)
          showPopup(d)
          let popupBox = document.getElementById("popupBox")
          let popupBoxBound = d3.select('#popupBox').node().getBoundingClientRect()
          let mousex = mouseX
          let mousey = mouseY
          if(popupBoxBound.width + mousex < tempWindowWidth && popupBoxBound.height + mousey < tempWindowHeight) {
            //右下角
             popupBox.style.left =mousex +10 + "px";
             popupBox.style.top = mousey + 10 + "px";
          }else if(popupBoxBound.width + mousex > tempWindowWidth && popupBoxBound.height + mousey < tempWindowHeight) {
            //左下角
            popupBox.style.left =mousex - popupBoxBound.width  + "px";
            popupBox.style.top = mousey + 10 + "px";
          } else if(popupBoxBound.width + mousex > tempWindowWidth && popupBoxBound.height + mousey > tempWindowHeight) {
            //左上角
            popupBox.style.left =mousex - popupBoxBound.width  + "px";
            popupBox.style.top = mousey - popupBoxBound.height + "px";
          }
        })
        .on('mouseover', function(d) {

        })
        // .on('mouseout', function(d) {
        //   document.getElementById("popupBox").style.display = "none";
        // })

      })
    }