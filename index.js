document.addEventListener('DOMContentLoaded', function(e) {
     
    let TEST_DATA;

    fetch("test.json")
    .then(response => response.json())
    .then(data => { 
        console.log(data.data)
        TEST_DATA = JSON.parse(JSON.stringify(data.data));
        console.log(TEST_DATA);

        const xScale = d3.scaleBand()
            .domain(TEST_DATA.map((dataPoint) => dataPoint.region))
            .rangeRound([0, 250])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, 15])
            .range([200, 0]);


        const container = d3.select('svg')
            .classed('container', true);//uses an css element

        const bars = container
        .selectAll('.bar')
        .data(TEST_DATA)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', xScale.bandwidth())
        .attr('height', data => 200 - yScale(data.value))
        .attr('x', data => xScale(data.region))
        .attr('y', data => yScale(data.value));
    });
});