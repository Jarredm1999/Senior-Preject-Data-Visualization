//If you are trying to run this code you need to run a python server.
//The server command is "python -m http.server".
//If you do not you will get an error saying "Fetch API cannot load...URL
//scheme must be http or https for CORS request".

document.addEventListener('DOMContentLoaded', function(e) {
//Storing the different types of data from the json into variables. 
    let TEST_DATA;
    let NEXT_DATA;
    let LINE_DATA;
//reading the json file.
    fetch("test.json")
    .then(response => response.json())
    .then(data => {
        console.log("1st dataset");
        console.log(data.data);
        console.log("2nd dataset");
        console.log(data.nextdata);
        console.log("3rd dataset");
        console.log(data.linedata);
        TEST_DATA = JSON.parse(JSON.stringify(data.data));
        console.log(TEST_DATA);
        NEXT_DATA = JSON.parse(JSON.stringify(data.nextdata));
        console.log(NEXT_DATA);
        LINE_DATA = JSON.parse(JSON.stringify(data.linedata));
        console.log(LINE_DATA);

//--------------------This is the code for both bar charts----------------------------------
    const MARGINS = {top: 20, bottom: 10};
    const CHART_WIDTH = 600;
    const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

    const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

//Selects the svg element in the html file and sets the width and height.
    const chartContainer = d3.select('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', (CHART_HEIGHT + MARGINS.top + MARGINS.bottom));
//Setting the values of the x and y axis to values from our dataset.
    x.domain(TEST_DATA.map((d) => d.region));
    y.domain([0, d3.max(TEST_DATA, d => d.value) + 3]);


    const chart = chartContainer.append('g');
//sets the x axis and translates it to correct position.
    chart.append('g')
         .call(d3.axisBottom(x).tickSizeOuter(0))
         .attr('transform', `translate(0, ${CHART_HEIGHT})`)
         .attr('color', '#000000');
//
        chart.selectAll('.bar')
         .data(TEST_DATA, data => data.id)
         .enter()
         .append('rect')
         .classed('bar', true)
         .attr('width', x.bandwidth())
         .attr('height', data => CHART_HEIGHT - y(data.value))
         .attr('x', (data) => x(data.region))
         .attr('y', (data) => y(data.value));
//Adding the value above each bar.
        chart.selectAll('.label')
            .data(TEST_DATA, data => data.id)
            .enter()
            .append('text')
            .text(data => data.value)
            .attr('x', data => x(data.region) + x.bandwidth() / 2)
            .attr('y', data => y(data.value) - 20)
            .attr('text-anchor', 'middle')
            .classed('label', true);
//Creating new x and y constants since we are creating another chart.
    const x2 = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const y2 = d3.scaleLinear().range([CHART_HEIGHT, 0]);
//Selecting the html element with the id "chart2" and setting the width and height attribute.
    const chartContainer2 = d3.select('#chart2')
        .append('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', (CHART_HEIGHT + MARGINS.top + MARGINS.bottom));
//Setting the domain of the x and y constants to the values from our dataset.
    x2.domain(NEXT_DATA.map((d) => d.region));
    y2.domain([0, d3.max(NEXT_DATA, d => d.value) + 3]);


    const chart2 = chartContainer2.append('g');
//Creating the axis and translating it to the correct position.
    chart2.append('g')
         .call(d3.axisBottom(x2).tickSizeOuter(0))
         .attr('transform', `translate(0, ${CHART_HEIGHT})`)
         .attr('color', '#000000');
//Select the html element with the bar class and assigns the values to the coorespoding bar.
        chart2.selectAll('.bar')
         .data(NEXT_DATA, data => data.id)
         .enter()
         .append('rect')
         .classed('bar', true)
         .attr('width', x2.bandwidth())
         .attr('height', data => CHART_HEIGHT - y2(data.value))
         .attr('x', (data) => x2(data.region))
         .attr('y', (data) => y2(data.value));
//Adding the value above each bar.
        chart2.selectAll('.label')
            .data(NEXT_DATA, data => data.id)
            .enter()
            .append('text')
            .text(data => data.value)
            .attr('x', data => x2(data.region) + x2.bandwidth() / 2)
            .attr('y', data => y2(data.value) - 20)
            .attr('text-anchor', 'middle')
            .classed('label', true);
//------------------This is the code for the pie chart--------------------------------        
//Sets the random color for each peice of the pie
    let colors = d3.scaleOrdinal(d3.schemeDark2);
//Selects the html element with the "pie" id and assigns the height, width and background
    let svg = d3.select('#pie')
                .append('svg')
                .attr('width', 600)
                .attr('height', 500)
                .style('background', 'grey');
//Parses the data into the values for each peice of the pie    
    let pieData = d3.pie().sort(null).value(function(d){return d.value})(TEST_DATA);
    console.log(pieData);
//General sizing for each segment 
    let segments = d3.arc()
                     .innerRadius(0)
                     .outerRadius(200)
                     .padAngle(.05)
                     .padRadius(50);
//Creates the sections and adds the correct color for the cooresponding value
    let sections = svg.append('g')
                     .attr('transform', 'translate(225, 250)')
                     .selectAll('path').data(pieData);
    sections.enter().append('path')
            .attr('d', segments)
            .attr('fill', function(d) {
                return colors(d.value);
            });
//Sets up the legend with the correct color, label and value            
    let legends = svg.append('g').attr('transform', 'translate(450, 100)')
                    .selectAll('legends').data(pieData);
    let legend = legends.enter().append('g').classed('legends', true)
                        .attr('transform', function(d, i) {
                            return "translate(0," + (i + 1)*30 + ")"; 
                        });
    legend.append('rect').attr('width', 20).attr('height', 20)
          .attr('fill', function(d) {
                return colors(d.value);
            });
    legend.append('text').text(function(d){return d.data.region + " {" + d.data.value + "}";})
          .attr('fill', 'black')
          .attr('x', 35)
          .attr('y', 15);
//-----------------------This is the code for the line graph--------------------------------
//Setup new margin values to accommodate for the increased size
    let margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
//Parses the time data
    let parseTime = d3.timeParse('%Y');
//Setup new x and y variables for the new chart
    let x3 = d3.scaleTime().range([0, width]);
    let y3 = d3.scaleLinear().range([height, 0]);
//Assign the valueline variable with the date and value
    let valueline = d3.line()
            .x(function(d) { return x3(d.date); })
            .y(function(d) { return y3(d.value); });
//Selects the html element with "lnchrt" as the id and sets the height, width
//and translates it to the correct position.
    let svg2 = d3.select('#lnchrt').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom + 25)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//Function to draw the graph
    function draw(data, option) {
        data = data[option];
//Parse Json data
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.value = +d.value;
        });
//Sorts the data incase the years are out of order
        data.sort(function(a, b) {
            return a["date"]-b["date"];
        });
//Sets the domain of the x and y variable the largest date and value
        x3.domain(d3.extent(data, function(d) {return d.date; }));
        y3.domain([0, d3.max(data, function(d) {
            return Math.max(d.value)
        })]);
//Setup the path the line will go on
        svg2.append('path')
            .data([data])
            .attr('class', 'line')
            .attr('d', valueline);
//Setup the x axis
        svg2.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x3));
//Text label for the x axis
        svg2.append("text")             
            .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Year");
//Sets up the y axis
        svg2.append('g')
            .call(d3.axisLeft(y3));
//Text label for the y axis and positions it in the correct spot        
        svg2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");      
//Plots a circle at each point
        svg2.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("r", 5)
	    .attr("cx", function(d) {
	        return x3(d.date)
	    })
	    .attr("cy", function(d) {
	        return y3(d.value)
	    });
    }
//Json request and calls the draw function. This enables us to be able to draw more then
//line on the line graph.
    d3.json('test.json').then(function(data) {
        draw(data, "linedata");
    })
    .catch(function(error) {
        console.log(error)  
    });
//--------------------------This is the code for the scatter plot---------------------------
//Parses the time data
    let parseTime2 = d3.timeParse('%Y');
//Setup new x and y variables for the new chart
    let x4 = d3.scaleTime().range([0, width]);
    let y4 = d3.scaleLinear().range([height, 0]);
//Selects the html element with "scp" as the id and sets the height, width
//and translates it to the correct position.
    let svg3 = d3.select('#scp').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom + 25)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//Function to draw the graph
    function draw2(data, option) {
        data = data[option];
//Parse Json data
        data.forEach(function(d) {
            d.date = parseTime2(d.date);
            d.value = +d.value;
        });
//Sorts the data incase the years are out of order
        data.sort(function(a, b) {
            return a["date"]-b["date"];
        });
//Sets the domain of the x and y variable the largest date and value
        x4.domain(d3.extent(data, function(d) {return d.date; }));
        y4.domain([0, d3.max(data, function(d) {
            return Math.max(d.value)
        })]);
//Setup the x axis
        svg3.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x4));
//Text label for the x axis
        svg3.append("text")             
            .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Year");
//Sets up the y axis
        svg3.append('g')
            .call(d3.axisLeft(y4));
//Text label for the y axis and positions it in the correct spot        
        svg3.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");      
//Plots a circle at each point
        let label2 = d3.select(".label");
        svg3.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("r", 5)
	    .attr("cx", function(d) {
	        return x4(d.date)
	    })
	    .attr("cy", function(d) {
	        return y4(d.value)
	    });
    }
//Json request and calls the draw function. This enables us to be able to draw more then
//line on the line graph.
    d3.json('test.json').then(function(data) {
        draw2(data, "scpdata");
    })
    .catch(function(error) {
        console.log(error)  
    });

    });
});