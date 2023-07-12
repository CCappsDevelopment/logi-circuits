import React, { Component } from "react";
import { Stage, Layer, Line } from "react-konva";
import AndGate from "./LogicGates/AndGate.js";
import OrGate from "./LogicGates/OrGate.js";
import NotGate from "./LogicGates/NotGate.js";
import "./App.css";

class App extends Component {
  state = {
    gates: [],
    lines: [],
    mouseDown: false,
    drawingLine: false,
  };

  addGate = (type) => {
    this.setState((prevState) => ({
      gates: [
        ...prevState.gates,
        {
          type,
          key: prevState.gates.length,
          id: prevState.gates.length,
        },
      ],
    }));
  };

  updateGate = (id, updates) => {
    this.setState((prevState) => ({
      gates: prevState.gates.map((gate) =>
        gate.id === id ? { ...gate, ...updates } : gate
      ),
    }));
  };

  clearComponents = () => {
    this.setState({
      gates: [],
      lines: [],
    });
  };

  setLineStartPosition = (x, y, id) => {
    this.setState((prevState) => {
      const newLines = prevState.lines.filter((line) => line.outputId !== id);
      return {
        lines: [
          ...newLines,
          {
            start: { x, y },
            end: { x, y },
            outputId: id,
          },
        ],
        mouseDown: true,
        drawingLine: true,
      };
    });
  };

  clearLine = () => {
    this.setState({ linePosition: null });
  };

  isPointInsideCircle = (px, py, circle1={x:0,y:0}, circle2={x:0,y:0}) => {
    const { x: cx1, y: cy1 } = circle1;
    const { x: cx2, y: cy2 } = circle2;
    const distance1 = Math.sqrt((px - cx1) ** 2 + (py - cy1) ** 2);
    const distance2 = Math.sqrt((px - cx2) ** 2 + (py - cy2) ** 2);
  
    if (distance1 <= 10) {
      return 0; // input 1
    } else if (distance2 <= 10) {
      return 1; // input 2
    } else {
      return null; // not in any input
    }
  };
  

  handleMouseMove = (e) => {
    const { lines, mouseDown } = this.state;
    if (lines.length > 0 && mouseDown) {
      const mousePos = {
        x: e.evt.clientX,
        y: e.evt.clientY,
      };
      this.setState({
        lines: lines.map((line, index) =>
          index === lines.length - 1 ? { ...line, end: mousePos } : line
        ),
      });
    }
  };

  handleMouseUp = (e) => {
    if (this.state.drawingLine) {
      const { lines, gates } = this.state;
      const endPos = { x: e.evt.clientX, y: e.evt.clientY };
  
      // find the gate and the input number where the endPos is inside an input circle
      let lineEndGate;
      let inputNumber;
      for (let gate of gates) {
        inputNumber = this.isPointInsideCircle(endPos.x, endPos.y, gate.input1Position, gate.input2Position);
        if (inputNumber !== null) {
          lineEndGate = gate;
          break;
        }
      }
  
      // if there's no gate at the end position, remove the last drawn line
      // or if the input is already connected, remove the last drawn line
      if (!lineEndGate || lineEndGate.connectedInputs[inputNumber]) {
        this.setState({
          lines: lines.slice(0, lines.length - 1)
        });
      } else {
        // if the input is not already connected, connect it
        this.updateGate(lineEndGate.id, { connectedInputs: { ...lineEndGate.connectedInputs, [inputNumber]: true } });
      }
    }
  
    this.setState({ mouseDown: false, drawingLine: false });
  };  

  renderGate = (gate) => {
    let GateComponent;
    switch (gate.type) {
      case "AND":
        GateComponent = AndGate;
        break;
      case "OR":
        GateComponent = OrGate;
        break;
      case "NOT":
        GateComponent = NotGate;
        break;
      default:
        return null;
    }

    return (
      <GateComponent
        key={gate.key}
        id={gate.id}
        setLineStartPosition={this.setLineStartPosition}
        setLineEndPosition={this.setLineEndPosition}
        updateGate={this.updateGate}
        clearLine={this.clearLine}
      />
    );
  };

  render() {
    return (
      <div className="app-container">
        <Stage
          className="stage"
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
        >
          <Layer>
            {this.state.lines.map((line, index) => (
              <Line
                key={index}
                points={[line.start.x, line.start.y, line.end.x, line.end.y]}
                stroke="black"
              />
            ))}
            {this.state.gates.map(this.renderGate)}
          </Layer>
        </Stage>
        <div className="btn-container">
          <button
            className="btn-add-component"
            onClick={() => this.addGate("AND")}
          >
            AND Gate
          </button>
          <button
            className="btn-add-component"
            onClick={() => this.addGate("OR")}
          >
            OR Gate
          </button>
          <button
            className="btn-add-component"
            onClick={() => this.addGate("NOT")}
          >
            NOT Gate
          </button>
          <button className="btn-add-component" onClick={this.clearComponents}>
            Clear
          </button>
        </div>
      </div>
    );
  }
}

export default App;