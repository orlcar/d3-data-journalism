// Declare initial parameters for chosenXAxis and chosenYAxis
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function used to set active and inactive classes for x-axis labels
function setActiveLabelX(ageLabel, povertyLabel, incomeLabel) {

	// Set classes to set bold text
	if (chosenXAxis === "age") {
		ageLabel
			.classed("active", true)
			.classed("inactive", false);
		povertyLabel
			.classed("active", false)
			.classed("inactive", true);
		incomeLabel
			.classed("active", false)
			.classed("inactive", true);
	}
	else if (chosenXAxis === "income") {
		ageLabel
			.classed("active", false)
			.classed("inactive", true);
		povertyLabel
			.classed("active", false)
			.classed("inactive", true);
		incomeLabel
			.classed("active", true)
			.classed("inactive", false);
	}
	else {
		ageLabel
			.classed("active", false)
			.classed("inactive", true);
		povertyLabel
			.classed("active", true)
			.classed("inactive", false);
		incomeLabel
			.classed("active", false)
			.classed("inactive", true);
	}
}

// Function used to set active and inactive classes for y-axis labels
function setActiveLabelY(obesityLabel, healthcareLabel, smokesLabel) {
	
	// Set classes to set bold text
	if (chosenYAxis === "obesity") {
		obesityLabel
			.classed("active", true)
			.classed("inactive", false);
		healthcareLabel
			.classed("active", false)
			.classed("inactive", true);
		smokesLabel
			.classed("active", false)
			.classed("inactive", true);
	}
	else if (chosenYAxis === "smokes") {
		obesityLabel
			.classed("active", false)
			.classed("inactive", true);
		healthcareLabel
			.classed("active", false)
			.classed("inactive", true);
		smokesLabel
			.classed("active", true)
			.classed("inactive", false);	
	}
	else {
		obesityLabel
			.classed("active", false)
			.classed("inactive", true);
		healthcareLabel
			.classed("active", true)
			.classed("inactive", false);
		smokesLabel
			.classed("active", false)
			.classed("inactive", true);
	}
}


// Function used to generate a responsive chart
function responsiveChart() {

	// If the SVG area is not empty when the browser loads,
	// remove it and replace it with a resized version of the chart
	var svgArea = d3.select("body").select("svg");

	// Clear SVG area if it is not empty
	if (!svgArea.empty()) {
		svgArea.remove();
	}

	// Create SVG width and circle radius based on browser window width
	// and SVG height based on browser window height
	var svgWidth = window.innerWidth - 100;
	var svgHeight = window.innerHeight - 80;
	var radius = svgWidth/100;

	// Define margins
	var margin = {
		top: 20,
		right: 40,
		bottom: 80,
		left: 100
	};

	// Create width and height based on margins
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;

	// Create an SVG wrapper, append an SVG group that will hold the chart,
	// and shift the latter by left and top margins.
	var svg = d3
		.select("#scatter")
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	// Append SVG group
	var chartGroup = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

	// Function used for updating x-scale variable upon clicking on x-axis label
	function xScale(healthData, chosenXAxis) {
		// Create scales
		var xLinearScale = d3.scaleLinear()
			.domain([d3.min(healthData, d => d[chosenXAxis]) * 0.9,
				d3.max(healthData, d => d[chosenXAxis])
			])
			.range([0, width]);

		return xLinearScale;
	}

	// Function used for updating y-scale variable upon clicking on y-axis label
	function yScale(healthData, chosenYAxis) {
		// Create scales
		var yLinearScale = d3.scaleLinear()
			.domain([0, d3.max(healthData, d => d[chosenYAxis]) * 1.1])
			.range([height, 0]);

		return yLinearScale;
	}

	// Function used for updating xAxis variable upon clicking on x-axis label
	function renderXAxis(newXScale, xAxis) {

		var bottomAxis = d3.axisBottom(newXScale);
		
		if (svgWidth <= 500) { 
			bottomAxis.ticks(5);
			}
		else {
			bottomAxis.ticks(10);
		}
		
		xAxis.transition()
			.duration(1000)
			.call(bottomAxis);

		return xAxis;
	}

	// Function used for updating yAxis variable upon clicking on y-axis label
	function renderYAxis(newYScale, yAxis) {

		var leftAxis = d3.axisLeft(newYScale);

		if (svgWidth <= 500) { 
			leftAxis.ticks(5);
			}
		else {
			leftAxis.ticks(10);
		}
		
		yAxis.transition()
			.duration(1000)
			.call(leftAxis);

		return yAxis;
	}

	// Function used for updating circles group with a transition to new circles
	function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

		circlesGroup.transition()
			.duration(1000)
			.attr("cx", d => newXScale(d[chosenXAxis]))
			.attr("cy", d => newYScale(d[chosenYAxis]));

		return circlesGroup;
	}

	// Function used for updating state text group with a transition to new circles
	function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

		textGroup.transition()
			.duration(1000)
			.attr("dx", d => newXScale(d[chosenXAxis]))
			.attr("dy", d => newYScale(d[chosenYAxis]));

		return textGroup;
	}

	// Function used for updating circles group with new tooltip
	function updateToolTip(chosenXAxis, circlesGroup, chosenYAxis) {

		if (chosenXAxis === "poverty") {
			var labelX = "In Poverty:";
			var labelXMiddle = "";
			var labelXEnd = "%";
		}
		else if (chosenXAxis === "income") {
			var labelX = "Household Income (Median):";
			var labelXMiddle = "$";
			var labelXEnd = "";
		}
		else {
			var labelX = "Age (Median):";
			var labelXMiddle = "";
			var labelXEnd = "";
		}

		if (chosenYAxis === "healthcare") {
			var labelY = "Lacks Healthcare:";
			var labelYEnd = "%";
		}
		else if (chosenYAxis === "obesity") {
			var labelY = "Obesity:";
			var labelYEnd = "%";
		}
		else {
			var labelY = "Smokes:";
			var labelYEnd = "%";
		}

		var toolTip = d3.tip()
			.attr("class", "d3-tip")
			.offset([80, -60])
			.html(function(d) {
				return (`${d.state}<br>${labelY} ${d[chosenYAxis]}${labelYEnd}
				<br>${labelX} ${labelXMiddle}${d[chosenXAxis]}${labelXEnd}`);
			});

		circlesGroup.call(toolTip);

		circlesGroup.on("mouseover", function(data) {
			toolTip.show(data);
		})
			// On-mouseout event
			.on("mouseout", function(data, index) {
				toolTip.hide(data);
			});

		return circlesGroup;
	}

	// Retrieve data from the CSV file and generate chart
	d3.csv("assets/data/data.csv", function(err, healthData) {

		if (err) throw err;
		  
		// Parse data
		healthData.forEach(function(data) {
			data.healthcare = +data.healthcare;
			data.obesity = +data.obesity;
			data.smokes = +data.smokes;
			data.poverty = +data.poverty;
			data.age = +data.age;
			data.income = +data.income;
		});

		// Create xLinearScale
		var xLinearScale = xScale(healthData, chosenXAxis);

		// Create yLinearScale
		var yLinearScale = yScale(healthData, chosenYAxis);

		// Create initial bottom axis and left axis using the LinearScales
		var bottomAxis = d3.axisBottom(xLinearScale);
		var leftAxis = d3.axisLeft(yLinearScale);

		// Function used to create responsive tick count for bottomAxis and leftAxis
		function tickCount() {
			if (svgWidth <= 500) { 
				bottomAxis.ticks(5);
				leftAxis.ticks(5);
				}
			else {
				bottomAxis.ticks(10);
				leftAxis.ticks(10);
			}
		}
		
		// Call tick count function to create axis ticks
		tickCount();

		// Append x-axis
		var xAxis = chartGroup.append("g")
			.classed("x-axis", true)
			.attr("transform", `translate(0, ${height})`)
			.call(bottomAxis);

		// Append y-axis
		var yAxis = chartGroup.append("g")
			.classed("y-axis", true)
			.call(leftAxis);

		// Append initial circles
		var circlesGroup = chartGroup.append("g").selectAll("stateCircle")
			.data(healthData)
			.enter()
			.append("circle")
			.classed("stateCircle", true)
			.attr("cx", d => xLinearScale(d[chosenXAxis]))
			.attr("cy", d => yLinearScale(d[chosenYAxis]))
			.attr("r", radius)
			.attr("opacity", ".5");

		// Append state text abbreviations to the middle of the circles
		var textGroup = chartGroup.append("g").selectAll("stateText")
			.data(healthData)
			.enter()
			.append("text")
			.classed("stateText", true)
			.attr("dx", d => xLinearScale(d[chosenXAxis]))
			.attr("dy", d => yLinearScale(d[chosenYAxis]))
			.text(d => d.abbr)
			.attr("y", 3);


		// Create labelsGroupX for the three x-axis labels and generate x-axis labels
		var labelsGroupX = chartGroup.append("g")
			.attr("transform", `translate(${width / 2}, ${height + 20})`);

		var povertyLabel = labelsGroupX.append("text")
			.attr("class", "aText")
			.attr("x", 0)
			.attr("y", 20)
			.attr("value", "poverty") // Value to grab for event listener
			.text("In Poverty (%)");

		var ageLabel = labelsGroupX.append("text")
			.attr("class", "aText")
			.attr("x", 0)
			.attr("y", 40)
			.attr("value", "age") // Value to grab for event listener
			.text("Age (Median)");

		var incomeLabel = labelsGroupX.append("text")
			.attr("class", "aText")
			.attr("x", 0)
			.attr("y", 60)
			.attr("value", "income") // Value to grab for event listener
			.text("Household Income (Median)");

		// Set the active x-axis labels
		setActiveLabelX(ageLabel, povertyLabel, incomeLabel);

		// Create labelsGroupY for the three y-axis labels and genearate y-axis labels
		var labelsGroupY = chartGroup.append("g")
			.attr("transform", "rotate(-90)");

		var healthcareLabel = labelsGroupY.append("text")
			.attr("class", "aText")
			.attr("y", 0 - margin.left)
			.attr("x", 0 - (height / 2))
			.attr("dy", "1em")
			.attr("value", "healthcare") // value to grab for event listener
			.text("Lacks Healthcare (%)");

		var obesityLabel = labelsGroupY.append("text")
			.attr("class", "aText")
			.attr("y", 20 - margin.left)
			.attr("x", 0 - (height / 2))
			.attr("dy", "1em")
			.attr("value", "obesity") // value to grab for event listener
			.text("Obesity (%)");
			
		var smokesLabel = labelsGroupY.append("text")
			.attr("class", "aText")
			.attr("y", 40 - margin.left)
			.attr("x", 0 - (height / 2))
			.attr("dy", "1em")
			.attr("value", "smokes") // value to grab for event listener
			.text("Smokes (%)");

		// Set the active y-axis labels
		setActiveLabelY(obesityLabel, healthcareLabel, smokesLabel);

		// Create tooltips
		circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

		// X-axis labels event listener
		labelsGroupX.selectAll("text")
			.on("click", function() {
				// Get value of selection
				var value = d3.select(this).attr("value");

				if (value !== chosenXAxis) {

					// Replace chosenXAxis with value
					chosenXAxis = value;

					// Update xScale with new data
					xLinearScale = xScale(healthData, chosenXAxis);

					// Update x-axis with transition
					xAxis = renderXAxis(xLinearScale, xAxis);

					// Update circles and state abbreviation labels with new x values
					circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
					textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

					// Update tooltips with new info
					circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

					// Update x-axis label classes to change bold text
					setActiveLabelX(ageLabel, povertyLabel, incomeLabel);
				}
			});

		// Y-axis labels event listener
		labelsGroupY.selectAll("text")
			.on("click", function() {
				// Get value of selection
				var value = d3.select(this).attr("value");

				if (value !== chosenYAxis) {

					// Replaces chosenYAxis with value
					chosenYAxis = value;

					// Update yScale for new data
					yLinearScale = yScale(healthData, chosenYAxis);

					// Update y-axis with transition
					yAxis = renderYAxis(yLinearScale, yAxis);

					// Update circles and state abbreviation labels with new y values
					circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
					textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

					// Update tooltips with new info
					circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

					// Update y-axis label classes to change bold text
					setActiveLabelY(obesityLabel, healthcareLabel, smokesLabel);					
				}
			});	
	});
}

// Call responsiveChart() when the browser loads
responsiveChart();

// Call responsiveChart() when the browser window is resized
d3.select(window).on("resize", responsiveChart);