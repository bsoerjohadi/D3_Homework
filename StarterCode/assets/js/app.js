// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Define dimensions of the chart area
var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import and load data
d3.csv("assets/data/data.csv").then(function(data){
    console.log(data)
// Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d){
        d.poverty = +d.poverty
        d.healthcare = +d.healthcare
    });
// Step 2: Create scale functions
// ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)+4])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)+4])
        .range([height, 0]);
// Step 3: Create axis functions
// ==============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);
// Step 4: Append Axes to the chart
// ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    chartGroup.append("g")
        .call(yAxis);
// Step 5: Create Circles
// ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("opacity", ".5")
        // .classed("stateText", true);
// Step 6: Initialize tool tip
// ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([10, 0])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });
// Step 7: Create tooltip in the chart
// ==============================
    chartGroup.call(toolTip);
// Step 8: Create event listeners to display and hide the tooltip
// ==============================
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
// Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
 }).catch(function(error) {
    console.log(error);
  });
