import React, { useEffect, useState, useCallback, MouseEvent } from 'react';
import logo from '../logo.svg';
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import { useParams } from "react-router-dom";
import 'reactflow/dist/style.css';
import './Topology.css'
import { GetRepoNames } from '../API/API';

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

interface RepoTag {
  repositoryName: string,
  repositoryId: number
}

interface RepoInfo {
  repositoryDeviceType: string
  repositoryHost: string
  repositoryId: number
  repositoryName: string
  repositoryOwnerName: string
  repositoryTimestamp: Date

}

function Topology() {
    
    const [AccessPoints, setAccessPoints] = useState<Array<AccessPoint>>([{device_type : AvailableDevice.cisco, host :'1.1.1.1'}, {device_type : AvailableDevice.cisco, host :'192.168.1.239'}])
    const [Repositories, setRepositories] = useState<Array<RepoInfo>>([])

    useEffect(()=> {
        
      DownloadRepoNames()
  }, [])

  let {id} = useParams();
  
  useEffect(()=> {

    const temp = Repositories.find(repository => repository.repositoryId === Number(id));

    if(temp !== undefined)
    {
      const Point: AccessPoint = {device_type : temp.repositoryDeviceType as AvailableDevice, host : temp.repositoryHost}
      setAccessPoints([Point])
    }

  }, [Repositories])

  async function DownloadRepoNames()
  {
      const username = localStorage.getItem("username")
      const response = await GetRepoNames(username)
      
      if(response.state === false)
      {
          alert(response.data)
          window.location.replace("/login")
      }
      
      console.log(response.data)
      setRepositories(response.data)
  }

    const initialNodes: Array<Node> = AccessPoints.map((Point, index)=> {
        return {
            id: index.toString(),
            type: 'default',
            data: {
              label: (
                <>
                  <strong>{Point.host}</strong>
                </>
              )
            },
            position: { x: 250 * ( index + 1 ), y: 0 },
          }
    })

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

    useEffect(() => {
        setNodes(AccessPoints.map((Point, index)=> {
          return {
              id: index.toString(),
              type: 'default',
              data: {
                label: (
                  <>
                    <strong>{Point.host}</strong>
                  </>
                )
              },
              position: { x: 250 * ( index + 1 ), y: 0 },
            }
      }))

    }
    ,[AccessPoints])

    function onNodeClick(event: MouseEvent, node: Node){
        const Point = AccessPoints[parseInt(node.id)]
        console.log(Point)
        window.location.assign('/config/' + id + '/host/' + Point.host + '/' + Point.device_type)
    }

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
                    onNodeClick={onNodeClick}
                    fitView
                    fitViewOptions={fitViewOptions}
                    />
                </div>
            </div>
        </div>
    );
}

export default Topology;
