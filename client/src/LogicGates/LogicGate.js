import React, { Component } from "react";
import { Rect, Circle, Text, Group } from "react-konva";

class LogicGate extends Component {
  componentWidth = 125;
  componentHeight = 60;
  state = {
    x: window.innerWidth / 2 - this.componentWidth / 2,
    y: window.innerHeight / 2 - this.componentHeight / 2,
    isCircleClicked: false,
    connectedInputs: [false, false],
    input1Color: "#FD69C1",
    input2Color: "#FD69C1",
    outputColor: "#BC85F2",
  };

  handleDragMove = (e) => {
    if (!this.state.isCircleClicked) {
      let newX = e.target.x();
      let newY = e.target.y();
      this.setState({
        x: newX,
        y: newY,
        input1Position: { x: newX, y: newY + this.componentHeight / 4 },
        input2Position: { x: newX, y: newY + (this.componentHeight * 3) / 4 },
      });
    }
  };

  handleDragEnd = (e) => {
    if (!this.state.isCircleClicked) {
      let newX = e.target.x();
      let newY = e.target.y();

      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX > window.innerWidth - this.componentWidth)
        newX = window.innerWidth - this.componentWidth;
      if (newY > window.innerHeight - this.componentHeight)
        newY = window.innerHeight - this.componentHeight;

      this.setState({
        x: newX,
        y: newY,
        input1Position: { x: newX, y: newY + this.componentHeight / 4 },
        input2Position: { x: newX, y: newY + (this.componentHeight * 3) / 4 },
      });
    }
  };

  handleInputMouseDown = (inputNode) => {
    this.setState({ isCircleClicked: true });
    if (inputNode === 0) {
      this.setState({ input1Color: "#BC85F2" });
    } else {
      this.setState({ input2Color: "#BC85F2" });
    }

    window.addEventListener("mouseup", {
      handleEvent: this.handleInputMouseUp.bind(this, inputNode),
    });
  };

  handleInputMouseUp = (inputNode) => {
    this.setState({ isCircleClicked: false });
    if (inputNode === 0) {
      this.setState({ input1Color: "#FD69C1" });
    } else {
      this.setState({ input2Color: "#FD69C1" });
    }
    window.removeEventListener("mouseup", {
      handleEvent: this.handleInputMouseUp.bind(this, inputNode),
    });
  };

  handleOutputMouseDown = (e) => {
    this.setState({ isCircleClicked: true, outputColor: "#FD69C1" });
    const { x, y } = e.target.getAbsolutePosition();
    this.props.setLineStartPosition(x, y, this.props.id);
  
    window.removeEventListener("mouseup", this.handleOutputMouseUp);
    window.addEventListener("mouseup", this.handleOutputMouseUp);
  };

  handleOutputMouseUp = (e) => {
    this.setState({ isCircleClicked: false, outputColor: "#BC85F2" });
    console.log(this.state);
    window.removeEventListener("mouseup", this.handleOutputMouseUp);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.x !== prevState.x || this.state.y !== prevState.y) {
      this.props.updateGate(this.props.id, {
        x: this.state.x, 
        y: this.state.y,
        input1Position: {
          x: this.state.x,
          y: this.state.y + this.componentHeight / 4,
        },
        input2Position: {
          x: this.state.x,
          y: this.state.y + (this.componentHeight * 3) / 4,
        },
        connectedInputs: this.state.connectedInputs,
      });
    }
  }
  

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleOutputMouseUp);
  }

  render() {
    return (
      <>
        <Group
          x={this.state.x}
          y={this.state.y}
          draggable={!this.state.isCircleClicked}
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
        >
          <Rect
            width={this.componentWidth}
            height={this.componentHeight}
            fill={this.props.color}
            stroke="#000000"
            strokeWidth={2}
            shadowOffsetX={5}
            shadowOffsetY={5}
            shadowColor={"black"}
          />
          <Text
            y={this.componentHeight / 2 - 10}
            text={this.props.text}
            fontSize={20}
            width={this.componentWidth}
            align="center"
          />
          <Circle
            name={`input1-${this.props.id}`}
            x={0}
            y={this.componentHeight / 4}
            radius={10}
            fill={this.state.input1Color}
            stroke="#000000"
            strokeWidth={2}
            onMouseDown={() => {
              this.handleInputMouseDown(0);
            }}
            onMouseUp={() => {
              this.handleInputMouseUp(0);
            }}
          />
          <Circle
            name={`input2-${this.props.id}`}
            x={0}
            y={(this.componentHeight * 3) / 4}
            radius={10}
            fill={this.state.input2Color}
            stroke="#000000"
            strokeWidth={2}
            onMouseDown={() => {
              this.handleInputMouseDown(1);
            }}
            onMouseUp={() => {
              this.handleInputMouseUp(1);
            }}
          />
          <Circle
            ref={this.outputRef}
            x={this.componentWidth}
            y={this.componentHeight / 2}
            radius={10}
            fill={this.state.outputColor}
            stroke="#000000"
            strokeWidth={2}
            onMouseDown={(e) => this.handleOutputMouseDown(e)}
          />
        </Group>
      </>
    );
  }
}

export default LogicGate;