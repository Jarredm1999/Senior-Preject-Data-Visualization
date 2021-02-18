console.log(d3);

d3.select('div')
  .selectAll('p')
  .data([1, 2, 3])
  .enter();