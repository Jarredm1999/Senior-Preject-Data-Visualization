//If you are trying to run this code you need to run a python server. 
//If you do not you will get an error saying "Fetch API cannot load...URL
//scheme must be http or https for CORS request".

document.addEventListener('DOMContentLoaded', function(e) {
     
    let TEST_DATA;

    fetch("test.json")
    .then(response => response.json())
    .then(data => { 
        console.log(data.data)
        TEST_DATA = JSON.parse(JSON.stringify(data.data));
        console.log(TEST_DATA);

    const MARGINS = {top: 20, bottom: 10};
    const CHART_WIDTH = 600;
    const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

    let selectedData = TEST_DATA;

    const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

    const chartContainer = d3.select('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

    x.domain(TEST_DATA.map((d) => d.region));
    y.domain([0, d3.max(TEST_DATA, d => d.value) + 3]);


    const chart = chartContainer.append('g');

    chart.append('g')
         .call(d3.axisBottom(x).tickSizeOuter(0))
         .attr('transform', `translate(0, ${CHART_HEIGHT})`)
         .attr('color', '#000000');


    function renderChart() {
        chart.selectAll('.bar')
         .data(selectedData, data => data.id)
         .enter()
         .append('rect')
         .classed('bar', true)
         .attr('width', x.bandwidth())
         .attr('height', data => CHART_HEIGHT - y(data.value))
         .attr('x', (data) => x(data.region))
         .attr('y', (data) => y(data.value));

        chart.selectAll('.bar').data(selectedData, data => data.id).exit().remove();

        chart.selectAll('.label')
            .data(selectedData, data => data.id)
            .enter()
            .append('text')
            .text(data => data.value)
            .attr('x', data => x(data.region) + x.bandwidth() / 2)
            .attr('y', data => y(data.value) - 20)
            .attr('text-anchor', 'middle')
            .classed('label', true);

        chart.selectAll('.label').data(selectedData, data => data.id).exit().remove();
    }

    renderChart();

    let unselectedIds = [];

    const listItems = d3.select('#data')
                        .select('ul')
                        .selectAll('li')
                        .data(TEST_DATA)
                        .enter()
                        .append('li');
        
    listItems.append('span').text(data => data.region);
    listItems.append('input')
             .attr('type', 'checkbox')
             .attr('checked', true)
             .on('change', (data) => {
                if (unselectedIds.indexOf(data.id) === -1) {
                    unselectedIds.push(data.id);
                } else {
                    unselectedIds = unselectedIds.filter(id => id !== data.id);
                }
                selectedData = TEST_DATA.filter(
                    (d) => unselectedIds.indexOf(d.id) === -1
                );
                renderChart();
             });
     

    let colors = d3.scaleOrdinal(d3.schemeDark2);
    let svg = d3.select('#pie').append('svg')
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

    });
});