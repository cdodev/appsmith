import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  FitViewOptions,
  DefaultEdgeOptions,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ConnectionLineType,
} from "react-flow-renderer";
import styled from "styled-components";

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const edgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
};

const FlowGraphContainer = styled.div<{
  borderRadius?: string;
  boxShadow?: string;
}>`
  display: flex;
  height: 100%;
  width: 100%;
  background: white;
  border-radius: ${({ borderRadius }) => borderRadius};
  box-shadow: ${({ boxShadow }) => `${boxShadow}`};
  overflow: hidden;

  & > div {
    width: 100%;
  }
`;
function FlowGraphComponent(props: FlowGraphComponentProps) {
  const {
    caption,
    edges,
    nodes,
    onNodeClick,
    showControls,
    showMiniMap,
  } = props;

  const nodeColor = (node: Node) => {
    switch (node.type) {
      case "input":
        return "red";
      case "default":
        return "#00ff00";
      case "output":
        return "rgb(0,0,255)";
      default:
        return "#eee";
    }
  };

  return (
    <FlowGraphContainer
      borderRadius={props.borderRadius}
      boxShadow={props.boxShadow}
    >
      <ReactFlow
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={edgeOptions}
        edges={edges}
        fitView
        fitViewOptions={fitViewOptions}
        nodes={nodes}
        onNodeClick={onNodeClick}
      >
        <Background gap={24} size={1} variant={BackgroundVariant.Dots} />
        {showControls && <Controls />}
        {showMiniMap && <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} />}
      </ReactFlow>
    </FlowGraphContainer>
  );
}

export interface FlowGraphComponentProps {
  caption: string;
  nodes: Node[];
  edges: Edge[];
  isVisible?: boolean;
  onNodeClick: (evt: React.MouseEvent, node: Node) => void;
  showLabels: boolean;
  showMiniMap: boolean;
  showControls: boolean;
  borderRadius?: string;
  boxShadow?: string;
}

export default FlowGraphComponent;
