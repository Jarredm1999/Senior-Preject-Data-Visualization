//If you are trying to run this code you need to run a python server. 
//If you do not you will get an error saying "Fetch API cannot load...URL
//scheme must be http or https for CORS request".

document.addEventListener('DOMContentLoaded', function(e) {
     
    let TEST_DATA;
    let NEXT_DATA;
    let LINE_DATA;

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

    const MARGINS = {top: 20, bottom: 10};
    const CHART_WIDTH = 600;
    const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

    const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

    const chartContainer = d3.select('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', (CHART_HEIGHT + MARGINS.top + MARGINS.bottom));

    x.domain(TEST_DATA.map((d) => d.region));
    y.domain([0, d3.max(TEST_DATA, d => d.value) + 3]);


    const chart = chartContainer.append('g');

    chart.append('g')
         .call(d3.axisBottom(x).tickSizeOuter(0))
         .attr('transform', `translate(0, ${CHART_HEIGHT})`)
         .attr('color', '#000000');

        chart.selectAll('.bar')
         .data(TEST_DATA, data => data.id)
         .enter()
         .append('rect')
         .classed('bar', true)
         .attr('width', x.bandwidth())
         .attr('height', data => CHART_HEIGHT - y(data.value))
         .attr('x', (data) => x(data.region))
         .attr('y', (data) => y(data.value));

        chart.selectAll('.label')
            .data(TEST_DATA, data => data.id)
            .enter()
            .append('text')
            .text(data => data.value)
            .attr('x', data => x(data.region) + x.bandwidth() / 2)
            .attr('y', data => y(data.value) - 20)
            .attr('text-anchor', 'middle')
            .classed('label', true);

    const x2 = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const y2 = d3.scaleLinear().range([CHART_HEIGHT, 0]);

    const chartContainer2 = d3.select('#chart2')
        .append('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', (CHART_HEIGHT + MARGINS.top + MARGINS.bottom));

    x2.domain(NEXT_DATA.map((d) => d.region));
    y2.domain([0, d3.max(NEXT_DATA, d => d.value) + 3]);


    const chart2 = chartContainer2.append('g');

    chart2.append('g')
         .call(d3.axisBottom(x2).tickSizeOuter(0))
         .attr('transform', `translate(0, ${CHART_HEIGHT})`)
         .attr('color', '#000000');

        chart2.selectAll('.bar')
         .data(NEXT_DATA, data => data.id)
         .enter()
         .append('rect')
         .classed('bar', true)
         .attr('width', x2.bandwidth())
         .attr('height', data => CHART_HEIGHT - y2(data.value))
         .attr('x', (data) => x2(data.region))
         .attr('y', (data) => y2(data.value));

        chart2.selectAll('.label')
            .data(NEXT_DATA, data => data.id)
            .enter()
            .append('text')
            .text(data => data.value)
            .attr('x', data => x2(data.region) + x2.bandwidth() / 2)
            .attr('y', data => y2(data.value) - 20)
            .attr('text-anchor', 'middle')
            .classed('label', true);
        
    
    let colors = d3.scaleOrdinal(d3.schemeDark2);
    let svg = d3.select('#pie')
                .append('svg')
                .attr('width', 600)
                .attr('height', 500)
                .style('background', 'grey');
    
    let pieData = d3.pie().sort(null).value(function(d){return d.value})(TEST_DATA);
    console.log(pieData);
    let segments = d3.arc()
                     .innerRadius(0)
                     .outerRadius(200)
                     .padAngle(.05)
                     .padRadius(50);
    let sections = svg.append('g')
                     .attr('transform', 'translate(225, 250)')
                     .selectAll('path').data(pieData);
    sections.enter().append('path')
            .attr('d', segments)
            .attr('fill', function(d) {
                return colors(d.value);
            });

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
    
    let margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let parseTime = d3.timeParse('%Y');

    let x3 = d3.scaleTime().range([0, width]);
    let y3 = d3.scaleLinear().range([height, 0]);

    let valueline = d3.line()
            .x(function(d) { return x3(d.date); })
            .y(function(d) { return y3(d.value); });

    let svg2 = d3.select('#lnchrt').append('svg')
            .attr('width', width + margin.left + margin.right + 400)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + 275 + "," + margin.top + ")");

    let label = d3.select('.label');

    function draw(data, option) {
        data = data[option];

        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.value = +d.value;
        });

        data.sort(function(a, b) {
            return a["date"]-b["date"];
        });

        x3.domain(d3.extent(data, function(d) {return d.date; }));
        y3.domain([0, d3.max(data, function(d) {
            return Math.max(d.value)
        })]);

        svg2.append('path')
            .data([data])
            .attr('class', 'line')
            .attr('d', valueline);

        svg2.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x3));
        
        svg2.append('g')
            .call(d3.axisLeft(y3));
        
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

    d3.json('test.json').then(function(data) {
        draw(data, "linedata");
    })
    .catch(function(error) {
        console.log(error)  
    });

    
    });
});