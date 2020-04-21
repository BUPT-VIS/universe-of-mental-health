    // 职位
    var positions = ["Back-end Developer","Front-end Developer", "Supervisor/Team Lead", "DevOps/SysAdmin", "Support", "One-person shop", "Designer", "Dev Evangelist/Advocate", "Executive Leadership", "Sales", "HR", "Other"];
    var posSVG = d3.select("#pos-svg").append("svg").attr("height", 150).attr("width", 160).attr("transform", "translate(0,0)");
   
    var position = posSVG.append("text")
      .attr("transform", "translate(80, 130)")
      .attr("dy", 7)
      .style("fill", "white")
      .style("font-size", 12)
      .style("text-anchor", "middle");

    var posCircles = posSVG.selectAll("circle")
      .data(positions).enter().append("circle")
      .attr("cx", function(d,i) { return 34*Math.cos(i*2*Math.PI/12 + 1.5*Math.PI) + 80; })
      .attr("cy", function(d,i) { return 34*Math.sin(i*2*Math.PI/12 + 1.5*Math.PI) + 64; })
      .attr("r", 3).style("fill", "white").style("opacity", 0.6)

    var benefits = ["Provide mental health benefits", "Know options for mental health care available", "Has employer discussed mental health", "Offer resources to learn more about mental health"];
    var befSVG = d3.select("#orbit-svg").append("svg").attr("height", 150).attr("width", 160).attr("transform", "translate(0,0)");
   
    var benefitCircles = befSVG.selectAll("ellipse")
    .data(benefits).enter().append("ellipse")
    .attr("cx", 80).attr("cy", 60).attr("rx", 12).attr("ry", 30)
    .style("stroke", "#595959").style("stroke-width", 1).style("stroke-dasharray", "1")
    .style("fill", "transparent")
    .attr("transform", function(d,i) {
      return "rotate(" + (45*i) + ",80 60)";
    })


    let beneCount = 0
    let posCount = 0
    setInterval(function() {
    if(beneCount < benefits.length) {
        benefitCircles.style("stroke", function(d, i) {
        if(i === beneCount) {
            document.getElementById('orbit-span').innerHTML = benefits[i]
            // benifit.text();
            return "#fff"
        } else {
            return "#595959"
        }
        })
        beneCount += 1
        if(beneCount === benefits.length) {
        beneCount = 0
        }
    }

    if(posCount < positions.length) {
        posCircles.attr("r", (d, i)=>{if(i === posCount) return 6; else return 3;}).style("opacity", (d, i)=>{if(i === posCount) return 1; else return 0.6;})
        .attr("cx", function(d,i) {if(i === posCount) return 40*Math.cos(i*2*Math.PI/12 + 1.5*Math.PI) + 80; else return 38*Math.cos(i*2*Math.PI/12 + 1.5*Math.PI) + 80; })
        .attr("cy", function(d,i) {if(i === posCount) return 40*Math.sin(i*2*Math.PI/12 + 1.5*Math.PI) + 64; else return 38*Math.sin(i*2*Math.PI/12 + 1.5*Math.PI) + 64;});
        document.getElementById('pos-span').innerHTML = positions[posCount]
        posCount += 1
        if(posCount === positions.length) {
            posCount = 0
        }
    }
    }, 2000)
    
    // 光晕
    var starSVG = d3.select("#color-legend").append("svg").attr("height", 90).attr("width", 360);
    var conditions = ["Mood Disorder", "Anxiety Disorder", "Attention Deficit Hyperactivity Disorder", "Post-traumatic Stress Disorder", "Obsessive-Compulsive Disorder", "Substance Use Disorder", "Personality Disorder", "Stress Response Syndromes", "Addictive Disorder", "Eating Disorder", "Dissociative Disorder", "Psychotic Disorder"];
    var colors = ["#eb4f27", "#f19637", "#fcea4f", "#9bfb4e", "#69e282", "#6ee5b9","#68e2fc", "#407bf7", "#425ef5", "#5d30f5", "#c333f1", "#eb3a4b"].reverse(); //

    var condition = starSVG.append("text")
      .attr("transform", "translate(100, 45)")
      .attr("dy", 7)
      .style("fill", "white")
      .style("font-size", 12);

    starSVG.selectAll("circle")
      .data(colors).enter().append("circle")
      .attr("cx", function(d, i) { return 24*Math.cos(i*2*Math.PI/12 + 1.5*Math.PI) + 46; })
      .attr("cy", function(d, i) { return 24*Math.sin(i*2*Math.PI/12 + 1.5*Math.PI) + 45; })
      .attr("r", 10).style("fill", function(d) { return d; })
      .style("opacity", 0.8)
      .on("mouseover", function(d, i) {
          d3.select(this)
          .attr("r", 12)
          .attr("cx", function() {
              return 27*Math.cos(i*2*Math.PI/12 - 0.5*Math.PI) + 46;
          })
          .attr("cy", function() {
              return 27*Math.sin(i*2*Math.PI/12 - 0.5*Math.PI) + 45;
          });
          condition.text(conditions[i]);
      })
      .on("mouseout", function(d,i) {
          d3.select(this)
          .attr("r", 10)
          .attr("cx", function() {
              return 24*Math.cos(i*2*Math.PI/12 + 1.5*Math.PI) + 46;
          })
          .attr("cy", function() {
              return 24*Math.sin(i*2*Math.PI/12 + 1.5*Math.PI) + 45;
          });
          condition.text('');
      });