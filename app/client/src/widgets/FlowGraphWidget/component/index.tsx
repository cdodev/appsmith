import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  FitViewOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "react-flow-renderer";
import styled from "styled-components";

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
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
  const { caption, edges, nodes, onNodeClick, showLabels } = props;

  const [theNodes, setNodes] = useState<Node[]>(nodes);
  const [theEdges, setEdges] = useState<Edge[]>(edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <FlowGraphContainer
      borderRadius={props.borderRadius}
      boxShadow={props.boxShadow}
    >
      <ReactFlow
        edges={edges}
        fitView
        fitViewOptions={fitViewOptions}
        nodes={nodes}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
      />
    </FlowGraphContainer>
  );
}

export interface FlowGraphComponentProps {
  caption: string;
  nodes: Node[];
  edges: Edge[];
  isVisible: boolean;
  onNodeClick: (evt: any) => void;
  showLabels: boolean;
  borderRadius?: string;
  boxShadow?: string;
}

export default FlowGraphComponent;
