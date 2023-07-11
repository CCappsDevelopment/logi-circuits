import React from "react";
import { Stage, Layer } from "react-konva";
import AndGate from "./LogicGates/AndGate.js";
import OrGate from "./LogicGates/OrGate.js";
import NotGate from "./LogicGates/NotGate.js";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.stageRef = React.createRef();
  }

  state = {
    gates: [],
  };

  componentDidMount() {
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
  }

  addGate = (type) => {
    this.setState((prevState) => ({
      gates: [
        ...prevState.gates,
        {
          type,
          key: prevState.gates.length,
          id: prevState.gates.length,
          connections: [],
        },
      ],
    }));
    console.log(this.state.gates);
  };

  clearComponents = () => {
    this.setState({
      gates: [],
    });
  };

  handleMouseMove = (e) => {
  };

  isPointInsideCircle = (px, py, circle) => {
    const { x: cx, y: cy } = circle;
    const distance = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
    return distance <= 10;
  };

  updateGate = (id, updates) => {
    this.setState((prevState) => ({
      gates: prevState.gates.map((gate) =>
        gate.id === id ? { ...gate, ...updates } : gate
      ),
    }));
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
      <>
        <GateComponent
          key={gate.key}
          id={gate.id}
          updateGate={this.updateGate}
        />
      </>
    );
  };

  render() {
    return (
      <div className="app-container">
        <Stage
          ref={this.stageRef}
          className="stage"
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Layer>
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
