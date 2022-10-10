import React, { useEffect, useState, useCallback } from 'react';
import logo from '../logo.svg';
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import { useParams } from "react-router-dom";
import 'reactflow/dist/style.css';
import './Config.css'

import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Connection,
    EdgeChange,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
    FitViewOptions
  } from 'reactflow';

enum AvailableDevice {
    cisco = "cisco_ios",
    dell = "dell_os6",
    huawei = "huawei",
    zyxel = "zyxel_os"
}

interface AccessPoint{
    device_type : AvailableDevice;
    host : string;
}

function Config() {
    
    const [AccessPoints, SetAccessPoints] = useState<Array<AccessPoint>>([{device_type : AvailableDevice.cisco, host :'1.1.1.1'}, {device_type : AvailableDevice.cisco, host :'192.168.1.239'}])
    const [Repositories, setRepositories] = useState<Array<string>>(['RepoTest01', 'RepoTest02'])

    const initialNodes: Array<Node> = AccessPoints.map((Point, index)=> {
        return {
            id: index.toString(),
            type: 'default',
            data: {
              label: (
                <>
                  <strong>{Point.host}</strong>
                </>
              ),
            },
            position: { x: 250 * ( index + 1 ), y: 0 },
          }
    })

    useEffect(() => {
        console.log(nodes)
    }
    ,[])

    const initialEdges: Array<Edge> = [  { id: 'e0-1',
                    source: '0',
                    target: '1',
                    }]

    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

    const fitViewOptions: FitViewOptions = {
        padding: 0.2,
      };

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
      );

    const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
    );

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
      );

    let {id} = useParams();

    return (
        <div>
            <MyNavbar></MyNavbar>
            <div className='content'>
                <RepoList Repositories = {Repositories}></RepoList>
                <div className="Connection">
                    <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    fitViewOptions={fitViewOptions}
                    />
                </div>
            </div>
        </div>
    );
}

export default Config;
