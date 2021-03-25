import * as React from 'react';
import styles from './index.less';
import G6 from '@antv/g6';
import {GraphData} from "@antv/g6/lib/types";

G6.registerNode('authorization-resource', {
  jsx: (cfg) => `
  <group>
    <rect style={{
        width: 'fit-content',
        height: 64,
        fill: '#fff',
        stroke: '#EFEFEF',
        radius: 10,
      }}>
      <text style={{fontSize: 14, fontWeight: 600, fill: '#222', marginTop: 14, marginLeft: 10}}>${cfg.resourceName}&nbsp;</text>
      <text style={{fontSize: 12, fontWeight: 400, fill: '#666', marginTop: 16, marginLeft: 10}}>${cfg.resourceType}｜${cfg.version}&nbsp;</text>
    </rect>
  </group>
`,
});


G6.registerNode('authorization-contract', {
  jsx: (cfg) => `
  <group>
    <rect style={{
        width: 'fit-content',
        height: 64,
        fill: ${cfg.status === 1 ? '#E5F6EF' : '#FBF5EA'},
        stroke: ${cfg.status === 1 ? '#8FD6B8' : '#E5C78A'},
        radius: 10,
      }}>
      <text style={{fontSize: 14, fill: '#222', marginTop: 10, marginLeft: 10}}>${cfg.contractName}&nbsp;</text>
      <text style={{fontSize: 12, fill: ${cfg.status === 1 ? '#42C28C' : '#E9A923'}, marginTop: 18, marginLeft: 10}}>执行中&nbsp;</text>
    </rect>
  </group>
`,
});

interface FAntvG6AuthorizationGraphProps extends GraphData {
  nodes: Array<{
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  } | {
    id: string;
    contractId: string;
    contractName: string;
    status: 0 | 1, //
  }>;
  edges: {
    source: string;
    target: string;
  }[];
  width?: number;
  height?: number;
}

let graph: any = null;

function FAntvG6AuthorizationGraph({nodes, edges, width = 920, height = 500}: FAntvG6AuthorizationGraphProps) {
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
          type: 'authorization-contract',
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

      graph.read({
        nodes: nodes.map((n) => {
          return {
            ...n,
            type: (n as any).contractId ? 'authorization-contract' : 'authorization-resource',
          };
        }),
        edges,
      });
    } else {
      graph.changeData({
        nodes: nodes.map((n) => {
          return {
            ...n,
            type: (n as any).contractId ? 'authorization-contract' : 'authorization-resource',
          };
        }),
        edges,
      });
    }


    return () => {
      graph.destroy();
      graph = null;
    };

  }, [nodes, edges]);

  return (<div ref={ref}/>);
}

export default FAntvG6AuthorizationGraph;
