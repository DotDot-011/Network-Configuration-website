import React, { useEffect, useState, useCallback, MouseEvent } from 'react';
import logo from '../logo.svg';
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import { useParams } from "react-router-dom";
import 'reactflow/dist/style.css';
import './Topology.css'
import { GetRepoNames, UpdateSnmp, GetInfo } from '../API/API';

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
import { Button, Form, Row, Col} from 'react-bootstrap';
import EnableSnmnpModal from '../Utils/EnableSnmpModal';
import Highlight from 'react-highlight';

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
  IsSnmpEnable: boolean
  SnmpCommunity: string

}

interface HostInfo{
  uptime: number
  location: string
  description: string
}

function Topology() {

  let {id} = useParams();

  const [AccessPoints, setAccessPoints] = useState<Array<AccessPoint>>([{device_type : AvailableDevice.cisco, host :'1.1.1.1'}, {device_type : AvailableDevice.cisco, host :'192.168.1.239'}])
  const [Repositories, setRepositories] = useState<Array<RepoInfo>>([])
  const [isSnmpEnable, setIsSnmpEnable] = useState<boolean>(false)
  const [selectedRepository, setSelectedRepository] = useState<RepoInfo>()
  const [isEnableSnmpPressed, setIsEnableSnmpPressed] = useState<boolean>(false)
  const [community, setCommunity] = useState<string>("")
  const [deviceUsername, setDeviceUsername] = useState<string>("")
  const [devicePassword, setDevicePassword] = useState<string>("")
  const [devicePort, setDevicePort] = useState<string>("22")
  const [hostInfo, setHostInfo] = useState<HostInfo>()
  const [timeString, setTimeString] = useState<string>("")
  const [time, setTime] = useState<number>(0)
  
  useEffect(()=> {
      
    DownloadRepoNames()

    const interval = setInterval(() => {
      setTime((prevCounter) => prevCounter + 1000);
    }, 1000);

    return () => clearInterval(interval);
    
  }, [])
  
  useEffect(() => {
    if(time !== undefined)
    {
      const distance = time
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      // Display the result in the element with id="demo"
      setTimeString(days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ")
    }

  }, [time])

  useEffect(()=> {
    if(selectedRepository?.IsSnmpEnable)
    {
      console.log(selectedRepository)
      DownloadHostInfo()
    }
    
  }, [selectedRepository])

  useEffect(()=> {

    const temp = Repositories.find(repository => repository.repositoryId === Number(id));

    if(temp !== undefined)
    {
      const Point: AccessPoint = {device_type : temp.repositoryDeviceType as AvailableDevice, host : temp.repositoryHost}
      setAccessPoints([Point])
      setIsSnmpEnable(temp.IsSnmpEnable)
      setSelectedRepository(temp)
    }

  }, [Repositories])

  useEffect(()=>{
    if(hostInfo !== undefined){
      console.log(hostInfo)
      setTime(hostInfo.uptime)
    }
  }, [hostInfo])

  async function DownloadHostInfo(){
    if(selectedRepository !== undefined)
    {
      const response = await GetInfo(
        selectedRepository?.repositoryDeviceType as AvailableDevice,
        selectedRepository?.repositoryHost,
        localStorage.getItem("username"),
        selectedRepository?.repositoryId,
        selectedRepository?.SnmpCommunity)
      
      setHostInfo(response.data)
    }
  }

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

    function EnableSnmp()
    {
      if(selectedRepository === undefined)
      {
        console.log("Error")
        return
      }
      
      setIsEnableSnmpPressed(true)
    }

    async function handleConfirm(){
      if(deviceUsername === ""){
        alert("Please Enter Username")
        return
      }

      if(community === ""){
        alert("Please Enter Community")
        return
      }

      const response = await UpdateSnmp(
        selectedRepository?.repositoryDeviceType as AvailableDevice,
        selectedRepository?.repositoryHost,
        deviceUsername,
        devicePassword,
        localStorage.getItem("username"),
        selectedRepository?.repositoryId,
        community,
        Number(devicePort)
        ) 
      if(response.data === "update successful")
      {
        setIsEnableSnmpPressed(false)
        DownloadRepoNames()
      }
    }

    return (
        <div>
            <MyNavbar></MyNavbar>
            <div id="wrapper">
                <RepoList Repositories = {Repositories}></RepoList>
                <div id="page-content-wrapper">
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
                    />{isSnmpEnable ? <>
                    <ul id='Description'>

                      <li>Uptime</li>
                        <ul>
                          <li id='time'>{timeString}</li>
                        </ul>

                      <li>Location</li>
                        <ul>
                          <li>{hostInfo?.location}</li>
                        </ul>

                      <li>Description</li>
                        <ul>
                          <li>{hostInfo?.description}</li>
                        </ul>

                    </ul>
                    {/* <Highlight className='JSON'>{JSON.stringify(hostInfo, null, 4)}</Highlight> */}
                    </>: <Button id='EnableButton' onClick={EnableSnmp}>Enable SNMP </Button>}
                </div>
                <EnableSnmnpModal 
                  host={selectedRepository?.repositoryHost} 
                  community = {community} 
                  isShow = {isEnableSnmpPressed}
                  handleClose = {()=>{setIsEnableSnmpPressed(false)}}
                  handleCommunityChange = {(event)=>{setCommunity(event.target.value)}}
                  handleConfirm = {handleConfirm}
                  device = {selectedRepository?.repositoryDeviceType as AvailableDevice}
                  handleUsernameChange = {(event)=>{setDeviceUsername(event.target.value)}}
                  handlePasswordChange = {(event)=>{setDevicePassword(event.target.value)}}
                  handlePortChange = {(event)=>{setDevicePort(event.target.value)}}
                  ></EnableSnmnpModal>
            </div>
            </div>
        </div>
    );
}

export default Topology;
