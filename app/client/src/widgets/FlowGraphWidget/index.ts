import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "Flow Graph", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
  iconSVG: IconSVG,
  needsMeta: true, // Defines if this widget adds any meta properties
  isCanvas: false, // Defines if this widget has a canvas within in which we can drop other widgets
  searchTags: ["graph", "visuals", "visualisations"],
  defaults: {
    rows: 32,
    columns: 48,
    widgetName: "Flow Graph",
    version: 1,
    data: {
      nodes: [
        {
          id: "1",
          type: "input",
          label: "Input Node",
          position: { x: 0, y: 0 },
        },

        {
          id: "2",
          label: "Default Node",
          position: { x: 200, y: -50 },
          // when you don't pass a type, the default one gets used
        },
        {
          id: "3",
          label: "Default Node",
          position: { x: 200, y: 50 },
          // when you don't pass a type, the default one gets used
        },
        {
          id: "4",
          type: "output",
          label: "Output Node",
          position: { x: 400, y: 0 },
        },
      ],
      edges: [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          label: "input",
        },
        {
          id: "e1-3",
          source: "1",
          target: "3",
          label: "input",
        },
        {
          id: "e2-4",
          source: "2",
          target: "4",
          label: "input",
        },
        {
          id: "e3-4",
          source: "3",
          target: "4",
          label: "input",
        },
      ],
    },
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;

// Value of key: nodes is invalid: This value does not evaluate to type: { "id": "string", "label": "string", "position": "Object" }
