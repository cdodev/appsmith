import React, { lazy, Suspense } from "react";
import ReactFlow, { Node, Edge } from "react-flow-renderer";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import Skeleton from "components/utils/Skeleton";
import { retryPromise } from "utils/AppsmithUtils";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

const FlowGraphComponent = lazy(() =>
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
            helpText: "Populates the graph with nodes and edges",
            propertyName: "nodes",
            label: "Nodes",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                unique: true,
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
                    allowedKeys: [
                      {
                        name: "id",
                        type: ValidationTypes.TEXT,
                        params: {
                          unique: true,
                          required: true,
                        },
                      },
                      {
                        name: "label",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                        },
                      },

                      {
                        name: "position",
                        type: ValidationTypes.OBJECT,
                        params: {
                          required: true,

                          params: {
                            required: true,
                            allowedKeys: [
                              {
                                name: "x",
                                type: ValidationTypes.NUMBER,
                                params: {
                                  required: true,
                                },
                              },
                              {
                                name: "y",
                                type: ValidationTypes.NUMBER,
                                params: {
                                  required: true,
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            propertyName: "showLabels",
            label: "Show Labels",
            helpText: "Sets whether entity labels will be shown or hidden",
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
      selectedDataPoint: undefined,
    };
  }

  static getWidgetType(): WidgetType {
    return "FLOW_GRAPH_WIDGET";
  }

  handleNodeClick = (evt: any) => {
    const { onNodeClick } = this.props;

    this.props.updateWidgetMetaProperty("selectedNode", evt.data, {
      triggerPropertyName: "onNodeClick",
      dynamicString: onNodeClick,
      event: {
        type: EventType.ON_NODE_CLICK,
      },
    });
  };

  getPageView() {
    const {
      colorRange,
      data,
      isVisible,
      mapTitle,
      mapType,
      showLabels,
    } = this.props;

    return (
      <Suspense fallback={<Skeleton />}>
        <FlowGraphComponent
          borderRadius={this.props.borderRadius}
          boxShadow={this.props.boxShadow}
          caption={mapTitle}
          colorRange={colorRange}
          data={data}
          isVisible={isVisible}
          onDataPointClick={this.handleNodeClick}
          showLabels={showLabels}
          type={mapType}
        />
      </Suspense>
    );
  }
}

export interface FlowGraphWidgetProps extends WidgetProps {
  graphTitle?: string;
  showLabels: boolean;
  borderRadius?: string;
  boxShadow?: string;
  onNodeClick?: string;
  nodes: Array<Node>;
  edges: Array<Edge>;
}

export default FlowGraphWidget;
