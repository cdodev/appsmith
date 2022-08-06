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
  Position,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";
import dagre from "dagre";
import styled from "styled-components";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 120;
const nodeHeight = 36;

export const getLayoutedElements = (
  nodes: Node<any>[],
  edges: Edge<any>[],
  direction = "TB",
) => {
  const isHorizontal = direction === "LR";

  if (nodes.length && edges.length) {
    dagreGraph.setGraph({
      rankdir: direction,
      ranker: "longest-path",
      // acyclicer: "greedy",
      nodesep: (isHorizontal ? nodeHeight : nodeWidth) + 20,
      edgesep: 50,
      ranksep: (isHorizontal ? nodeWidth : nodeHeight) / 2 + 20,
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Right;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });
    return { nodes, edges };
  } else {
    return { nodes: [], edges: [] };
  }
};

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

  const [theNodes, setNodes] = useState(nodes);
  const [theEdges, setEdges] = useState(edges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
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
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
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
