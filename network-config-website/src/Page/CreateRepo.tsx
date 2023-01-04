import React, {useState} from 'react';
import { PostRepo } from '../API/API';
import MyNavbar from '../Utils/Navbar';
interface CreateRepositoryProps {
  onSubmit: (repository: { name: string, host: string, deviceType: string }) => void;
}

function CreateRepository(){
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [deviceType, setDeviceType] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const username = localStorage.getItem('username')
    
    if(username === null){
        window.location.replace("/login")    
    }

    const response = await PostRepo(name, username, host, deviceType)

    if(response.state === false)
    {
        alert(response.data)
        window.location.replace("/login")   
    }
    
    alert(response.data.message)

  };

  return (
    <>
    <MyNavbar></MyNavbar>
        <form onSubmit={handleSubmit}>
        <label htmlFor="name">Repository name:</label>
        <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
        />
        <br />
        <label htmlFor="host">Host:</label>
        <input
            type="text"
            id="host"
            value={host}
            onChange={(event) => setHost(event.target.value)}
            required
        />
        <br />
        <label htmlFor="deviceType">Device type:</label>
        <select
            id="deviceType"
            value={deviceType}
            onChange={(event) => setDeviceType(event.target.value)}
            required
        >
            <option value="">Select a device type</option>
            <option value="cisco_ios">Cisco</option>
            <option value="dell_os6">Dell</option>
            <option value="huawei">Huawei</option>
            <option value="zyxel_os">Zyxel</option>
        </select>
        <br />
        <button type="submit">Create repository</button>
        </form>
    </>
  );
};

export default CreateRepository;