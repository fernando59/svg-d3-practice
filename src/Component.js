import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';

function ComponentSVG() {
    const [colorPicker, setColorPicker] = useState('#333')
    useEffect(() => {
        readSvg()

    }, [])

    const changeColor = () => {
        // const nodes = d3.select('.D37').selectChild()
        const nodes = d3.select('.D37').selectChildren()
        nodes.selectAll('path')
            .attr('fill', colorPicker)
        // .attr('stroke', colorPicker)
    }

    const clickNode = (e, d) => {
        console.log(e.target)
        // console.log(d)
        const parent = d3.select(e.target)
            .selectChildren()
        console.log(parent)
        parent.selectAll('path')
            .attr('fill', colorPicker)
            .attr('class','fdas')
        console.log(parent)
        // const node = e.node()
        // console.log(node)

    }
    const readSvg = async () => {
        try {
            const res = await d3.xml("/Diagramas-22.svg")
            d3.select('#svg')
                .on('click', clickNode)
                .node().append(res.documentElement)

        } catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            <div style={{ padding: '20px', overflowX: 'scroll' }}>

                <div style={{ padding: '10px' }}>
                    <button onClick={changeColor}>Change color</button>
                    <input type="color" onChange={(e) => setColorPicker(e.target.value)} />
                </div>
                <div id="svg" style={{ width: '100%', height: '1500px' }}></div>

            </div>
        </>
    )
}

export default ComponentSVG