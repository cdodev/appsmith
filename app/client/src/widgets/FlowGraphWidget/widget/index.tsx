import React, { lazy, Suspense } from "react";
import ReactFlow, {
  Node,
  Edge,
  XYPosition,
  Position,
} from "react-flow-renderer";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import Skeleton from "components/utils/Skeleton";
import { retryPromise } from "utils/AppsmithUtils";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import FlowGraphComponent, {
  FlowGraphComponentProps,
  getLayoutedElements,
} from "../component";
import * as log from "loglevel";
import { StringLiteral } from "typescript";

const Component: React.ComponentType<typeof FlowGraphComponent> = lazy(() =>
  retryPromise(() =>
    import(/* webpackChunkName: "mapCharts" */ "../component"),
  ),
);

class FlowGraphWidget extends BaseWidget<FlowGraphWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "General",
        children: [
          {
            helpText: "Sets the title",
            placeholderText: "Enter title",
            propertyName: "graphTitle",
            label: "Title",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "Graph Data",
        children: [
          {
            helpText: "Populates the graph with nodes",
            propertyName: "data",
            label: "Graph Nodes",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.OBJECT,
              params: {
                required: true,
                allowedKeys: [
                  {
                    name: "nodes",

                    type: ValidationTypes.ARRAY,
                    params: {
                      // unique: true,
                      children: {
                        type: ValidationTypes.OBJECT,
                        params: {
                          required: true,
                          // allowedKeys: [
                          //   {
                          //     name: "id",
                          //     type: ValidationTypes.TEXT,
                          //     params: {
                          //       // unique: true,
                          //       required: true,
                          //     },
                          //   },
                          //   {
                          //     name: "label",
                          //     type: ValidationTypes.TEXT,
                          //     params: {
                          //       required: true,
                          //     },
                          //   },

                          //   {
                          //     name: "parentNode",
                          //     type: ValidationTypes.TEXT,
                          //     params: {
                          //       required: false,
                          //     },
                          //   },
                          // {
                          //   name: "position",
                          //   type: ValidationTypes.OBJECT,
                          //   params: {
                          //     required: true,

                          //     params: {
                          //       required: true,
                          //       allowedKeys: [
                          //         {
                          //           name: "x",
                          //           type: ValidationTypes.NUMBER,
                          //           params: {
                          //             required: true,
                          //           },
                          //         },
                          //         {
                          //           name: "y",
                          //           type: ValidationTypes.NUMBER,
                          //           params: {
                          //             required: true,
                          //           },
                          //         },
                          //       ],
                          //     },
                          //   },
                          // },
                          // ],
                        },
                      },
                    },
                  },
                  {
                    name: "edges",

                    type: ValidationTypes.ARRAY,
                    params: {
                      unique: true,
                      children: {
                        type: ValidationTypes.OBJECT,
                        //   params: {
                        //     required: true,
                        //     allowedKeys: [
                        //       {
                        //         name: "id",
                        //         type: ValidationTypes.TEXT,
                        //         params: {
                        //           // unique: true,
                        //           required: true,
                        //         },
                        //       },
                        //       {
                        //         name: "label",
                        //         type: ValidationTypes.TEXT,
                        //         params: {
                        //           required: false,
                        //         },
                        //       },
                        //       {
                        //         name: "source",
                        //         // TODO: type for this
                        //         type: ValidationTypes.TEXT,
                        //         params: {
                        //           required: true,
                        //         },
                        //       },
                        //       {
                        //         name: "target",
                        //         // TODO: type for this
                        //         type: ValidationTypes.TEXT,
                        //         params: {
                        //           required: true,
                        //         },
                        //       },
                        //     ],
                        //   },
                      },
                    },
                  },
                ],
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          // {
          //   propertyName: "showLabels",
          //   label: "Show Labels",
          //   helpText: "Sets whether entity labels will be shown or hidden",
          //   controlType: "SWITCH",
          //   isJSConvertible: true,
          //   isBindProperty: true,
          //   isTriggerProperty: false,
          //   validation: { type: ValidationTypes.BOOLEAN },
          // },
        ],
      },

      {
        sectionName: "View Options",
        children: [
          {
            propertyName: "showMiniMap",
            label: "Show MiniMap",
            helpText: "Sets whether to display the mini map",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "showControls",
            label: "Show Controls",
            helpText: "Sets whether to display the view controls",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "Actions",
        children: [
          {
            helpText: "Triggers an action when a node is clicked",
            propertyName: "onNodeClick",
            label: "onNodeClick",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedNode: undefined,
    };
  }

  static getWidgetType(): WidgetType {
    return "FLOW_GRAPH_WIDGET";
  }

  handleNodeClick = (evt: React.MouseEvent, node: Node) => {
    const { onNodeClick } = this.props;
    log.debug("Node Click", { node, evt });
    this.props.updateWidgetMetaProperty("selectedNode", node.id, {
      triggerPropertyName: "onNodeClick",
      dynamicString: onNodeClick,
      event: {
        type: EventType.ON_NODE_CLICK,
      },
    });
  };

  getPageView() {
    const {
      data,
      isVisible,
      mapTitle,
      showControls,
      showLabels,
      showMiniMap,
    } = this.props;
    const { edges, nodes } = getLayoutedElements(
      data.nodes?.map(configNodeToNode),
      data.edges?.map(configEdgeToEdge),
      "LR",
    );
    log.debug(nodes);
    log.debug("EDGES", edges);

    return (
      <Suspense fallback={<Skeleton />}>
        <FlowGraphComponent
          borderRadius={this.props.borderRadius}
          boxShadow={this.props.boxShadow}
          caption={mapTitle}
          edges={edges}
          isVisible={isVisible}
          nodes={nodes}
          onNodeClick={this.handleNodeClick}
          showControls={showControls}
          showLabels={showLabels}
          showMiniMap={showMiniMap}
        />
      </Suspense>
    );
  }
}

interface ConfigNode {
  id: string;
  nodeType: string;
  label: string;
  parentNode?: string;
  position: XYPosition;
}

const configNodeToNode = ({
  id,
  label,
  nodeType,
  parentNode,
  position,
}: ConfigNode): Node => {
  const style = nodeType == "group" ? { width: 175, height: 150 } : {};
  return {
    id,
    type: nodeType,
    data: { label },
    position,
    parentNode,
    // extent: "parent",
    // expandParent: true,
    // style,
    draggable: true,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };
};

interface ConfigEdge {
  id: string;
  source: string;
  target: string;
  edgeType: string;
  label?: string;
}

interface GraphConfig {
  nodes: ConfigNode[];
  edges: ConfigEdge[];
}
const configEdgeToEdge = ({
  edgeType,
  id,
  label,
  source,
  target,
}: ConfigEdge): Edge => {
  return {
    id,
    source,
    label,
    target,
    // hidden: edgeType == "hidden",
    animated: true,
  };
};

export interface FlowGraphWidgetProps extends WidgetProps {
  graphTitle?: string;
  showLabels: boolean;
  showControls: boolean;
  showMiniMap: boolean;
  borderRadius?: string;
  boxShadow?: string;
  onNodeClick?: string;
  isVisible?: boolean;
  data: GraphConfig;
}

export default FlowGraphWidget;
