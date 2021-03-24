import * as React from 'react';
import styles from './index.less';
import G6 from '@antv/g6';
import {GraphData, ModelConfig} from "@antv/g6/lib/types";

G6.registerNode('dependency-resource', {
  jsx: (cfg) => `
  <group>
    <rect style={{
        width: 'fit-content',
        height: 64,
        fill: '#fff',
        stroke: '#EFEFEF',
        radius: 10,
      }}>
      <text style={{fontSize: 14, fontWeight: 600, fill:'#222', marginTop: 14,marginLeft: 10,}}>${cfg.resourceName}&nbsp;</text>
      <text style={{fontSize: 12, fontWeight: 400, fill:'#666', marginTop: 16,marginLeft: 10,}}>${cfg.resourceType}｜${cfg.version}&nbsp;</text>
    </rect>
  </group>
`,
});

interface FAntvG6DependencyGraphProps extends GraphData {
  nodes: {
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  }[];
  edges: {
    source: string;
    target: string;
  }[];
  width?: number;
  height?: number;
}

let graph: any = null;

function FAntvG6DependencyGraph({nodes, edges, width = 920, height = 500}: FAntvG6DependencyGraphProps) {
  const ref = React.useRef(null);

  React.useEffect(() => {

    if (!graph) {
      graph = new G6.Graph({
        container: ref.current || '',
        width: width,
        height: height,
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        layout: {
          // type: 'mindmap',
          // type: 'compactBox',
          type: 'dagre',
          rankdir: 'LR', // 可选，默认为图的中心
          // nodesep: 20,
          // ranksep: 100,
          // align: 'DL', // 可选
          preventOverlap: true,
          controlPoints: true,
          workerEnabled: true,
          nodesep: 20,
          ranksep: 100,
          // direction: 'H',
          getHeight: () => {
            return 64;
          },
          getWidth: () => {
            return 200;
          },
          // getVGap: () => {
          //   return 10;
          // },
          // getHGap: () => {
          //   return 100;
          // },
          // getSide: () => {
          //   return 'right';
          // },
        },
        defaultNode: {
          type: 'dependency-resource',
          // width: 150,
          // height: 64,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
          // labelCfg: {
          //   style: {
          //     // fill: '#000000A6',
          //     // fontSize: 10,
          //   },
          // },
          style: {
            // stroke: '#72CC4A',
            // width: 150,
            // height: 64,
          },
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#979797',
          },
          sourceAnchor: 1,
          targetAnchor: 0,
        },
        // renderer: 'svg',
      });
    }
    graph.data({nodes, edges});
    graph.render();

    return () => {
      graph.destroy();
      graph = null;
    };

  }, [nodes, edges]);

  return (<div ref={ref}/>);
}

export default FAntvG6DependencyGraph;

interface DependencyTree {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  version: string;
  dependencies: DependencyTree[];
}

interface DependencyGraphData {
  nodes: {
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  }[];
  edges: {
    source: string;
    target: string;
  }[];
}

export function handleDependencyGraphData(data: DependencyTree): DependencyGraphData {

  const nodes: DependencyGraphData['nodes'] = [];
  const edges: DependencyGraphData['edges'] = [];
  traversal(data);

  return {
    nodes, edges
  };

  function traversal(data: DependencyTree, parentID: string = ''): any {
    const {dependencies, ...resource} = data;
    const id: string = parentID ? `${parentID}-${data.resourceId}` : data.resourceId;
    nodes.push({
      id,
      ...resource,
    });
    if (parentID) {
      edges.push({
        source: parentID,
        target: id,
      });
    }

    for (const dep of dependencies) {
      traversal(dep, id);
    }
  }
}
