import * as d3 from 'd3';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { useEffect, useRef, useState } from 'react';
import './App.css';
function App() {
  const [openModal, setOpenModal] = useState(false)
  const [tableEntity, setTableEntity] = useState({
    id: 0
  })

  const svgD3 = useRef()

  const radius = 32
  const height = 800
  const width = 800
  const drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
    const readSvg = async () => {
      try {
  
          const res = await d3.xml("./maple_illustration.svg")
          console.log(res)
      } catch (e) {
          console.log(e)
      }
  }
  useEffect(() => {
    const lines = d3.range(20).map(i => {
      //vertical
      if (i >= 10) return {
        x1: (i - 10) * 100,
        x2: (i - 10) * 100,
        y1: 0,
        y2: height,
        index: i
      }
      //horizontal
      if (i < 10) return {
        x1: width,
        x2: 0,
        y1: 100 * i,
        y2: 100 * i,
        index: i
      }
    });
    const svg = d3.select(svgD3.current)
      .attr("viewBox", [0, 0, width, height])
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'white')
      .style('border', '2px solid black')
      .attr("stroke-width", 2)
    const g = svg.append("g")
      .attr("cursor", "grab");

    const grid = svg.append("g")
    grid.selectAll('line')
      .data(lines)
      .join('line')
      .attr("y2", d => d.y2)
      .attr("y1", d => d.y1)
      .attr("x1", d => d.x1)
      .attr("x2", d => d.x2)
      .attr("stroke", "rgba(71,71,71,0.04)")
    // .style('color','#333')






    function zoomed({ transform }) {
      g.attr("transform", transform);
    }



    const circles = d3.range(10).map(i => ({
      type: 'circle',
      x: Math.random() * (width - radius * 2) + radius,
      y: Math.random() * (height - radius * 2) + radius,
      index: i
    }));

    // .append('g')

    g.selectAll('circle').data(circles)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", radius)
      .attr("fill", d => d3.schemeCategory10[d.index % 10])
      .call(drag)
      .on('click', clickRounded)

    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

  }, [])

  function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
  }

  function dragged(event, d) {
    const name = d3.select(this).raise().node().nodeName
    if (name === 'rect'){

      d3.select(this).raise().attr("x", d.x = event.x).attr("y", d.y = event.y);
    }else if(name ==='line'){
      console.log(d3.select(this).raise().attr())
      d3.select(this).raise().attr("x1", d.x = event.x1).attr("y1", d.y = event.y1).attr("x2", d.x = event.x2).attr("y2", d.y = event.y2);
    }
    else
      d3.select(this).raise().attr("cx", d.x = event.x).attr("cy", d.y = event.y);
  }

  function dragended(event, d) {
    d3.select(this).attr("stroke", null);
  }

  const clickRounded = (e, d) => {
    setOpenModal(true)
    setTableEntity({
      id: d.index,
      type: d.type
    })
  }

  const addCircle = () => {
    const circle = [
      {
        type: 'circle',
        x: Math.random() * (width - radius * 2) + radius,
        y: Math.random() * (height - radius * 2) + radius,
        index: Math.floor(Math.random() * (height - radius * 2) + radius)
      }
    ]
    const svg = d3.select(svgD3.current).select('g')
    svg.data(circle).append('circle')
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", radius)
      .attr("fill", d => d3.schemeCategory10[d.index % 10])
      .text('dd')
      // .attr('fill', '#333')
      .on('click', clickRounded)
      .call(drag)

  }

  const handleHide = () => {
    setOpenModal(false)
    setTableEntity({})
  }
  const addDetail = () => {
    setOpenModal(true)
  }
  const removeItem = () => {
    const name = tableEntity.type
    console.log(tableEntity)
    console.log(name)
    let node = null
    if (name === 'rect') {

      node = d3.select(svgD3.current).select('g').selectAll('rect').select(function (d, i) {
        return d.index == tableEntity.id ? this : null
      })
      console.log(node)
    }else if(name ==='line'){
      node = d3.select(svgD3.current).select('g').selectAll('line').select(function (d, i) {
        return d.index == tableEntity.id ? this : null
      })
    }
    else
      node = d3.select(svgD3.current).select('g').selectAll('circle').select(function (d, i) {
        return d.index == tableEntity.id ? this : null
      })
    node.remove()
    handleHide()
  }
  const addTable = () => {
    const table = [
      {
        type: 'rect',
        x: Math.random() * (width - radius * 2) + radius,
        y: Math.random() * (height - radius * 2) + radius,
        index: Math.floor(Math.random() * (height - radius * 2) + radius)
      }
    ]
    const svg = d3.select(svgD3.current).select('g')
    svg.data(table).append('rect')
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", 100)
      .attr("height", 100)
      // .attr("r", radius)
      .attr("fill", '#AC8053')
      // .attr('fill', '#333')
      .on('click', clickRounded)
      .call(drag)

  }
  const addLine = () => {
    const line= [
      {
        type: 'line',
        x1: Math.random() * (width - radius * 2) + radius,
        x2: Math.random() * (width - radius * 2) + radius,
        y1: Math.random() * (width - radius * 2) + radius,
        y2: Math.random() * (height - radius * 2) + radius,
        index: Math.floor(Math.random() * (height - radius * 2) + radius)
      }
    ]
    const svg = d3.select(svgD3.current).select('g')
    svg.data(line).append('line')
      .attr("x1", d => d.x1)
      .attr("x2", d => d.x2)
      .attr("y1", d => d.y1)
      .attr("y2", d => d.y2)
      // .attr("width", 100)
      // .attr("height", 100)
      // .attr("r", radius)
      .attr("fill", '#000')
      .attr("stroke", '#000')
      // .attr('fill', '#333')
      .on('click', clickRounded)
      .call(drag)
  }
  return (
    <>
      <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold', padding: '5px' }}>Test D3 Js</h1>
      <div style={{ padding: '10px' }}>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>

          <Button onClick={addCircle} label="Add Circle" />
          <Button onClick={addTable} label="Add Table" />
          <Button onClick={addLine} label="Add Line" className='p-button-secondary' />
        </div>

      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>

        <svg ref={svgD3}></svg>
      </div>

      <Dialog header="Table Detail" visible={openModal} style={{ width: '50vw' }} onHide={handleHide}>
        <h1>Are you sure delete {tableEntity?.id}</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <Button onClick={removeItem} label='remove' className="p-button-danger" />
      </Dialog>


    </>
  );
}

export default App;
