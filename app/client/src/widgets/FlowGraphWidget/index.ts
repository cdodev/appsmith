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
    columns: 24,
    widgetName: "Flow Graph",
    version: 1,
    nodes: [
      {
        id: "1",
        type: "input",
        data: { label: "Input Node" },
        position: { x: 0, y: 0 },
      },

      {
        id: "2",
        data: { label: "Default Node" },
        position: { x: 100, y: 0 },
        // when you don't pass a type, the default one gets used
      },
      {
        id: "3",
        type: "output",
        data: { label: "Output Node" },
        position: { x: 200, y: 0 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        type: "default",
        source: "1",
        target: "2",
        animated: false,
      },
      {
        id: "e1-2",
        type: "straight",
        source: "2",
        target: "3",
      },
      {
        id: "e1-2",
        type: "step",
        source: "2",
        target: "3",
      },
    ],
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
