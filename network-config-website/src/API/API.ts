import axios from "axios";
// import { saveAs } from 'file-saver';

const FileSaver = require('file-saver');

type  AvailableDevice = "cisco_ios" | "dell_os6" | "huawei" | "zyxel_os"

const Url = "http://127.0.0.1:7000/"

function makeid(length : number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export async function GetFile( fileId: any ) {
    const blobUrl = Url + 'file/' + fileId

    console.log(blobUrl)

    const response = await axios.get(blobUrl, {
        responseType: 'blob'  /* or responseType: 'arraybuffer'  */,  
    })

    console.log(response);

    FileSaver.saveAs(response.data, fileId);
    
}

export async function Login( username: string, password: string){

    const path = Url + "login"

    const response = await axios.post(path, {
        username: username,
        Password: password
    })
    
    console.log(response)
    
    if(response.data.state === false){
        throw Error
    }
    
    return response.data

}

export async function PostRepo( repositoryName : string,
    username : string | null,
    Host : string,
    DeviceType : string ){

    const path = Url + "createRepository"

    const config = {
        headers: {
          TOKEN: localStorage.getItem('TOKEN'),
        }
      }
      
    const response = await axios.post(path, {
        repositoryName: repositoryName,
        username: username,
        Host : Host,
        DeviceType : DeviceType
    }, config)
    
    console.log(response)
    
    return response.data

}

export async function GetRepoNames(username: string | null){

    const path = Url + "getRepositories/" + username

    const config = {
        headers: {
          TOKEN: localStorage.getItem('TOKEN'),
        }
      }

    const response = await axios.get(path, config)
    
    console.log(response)
    
    return response.data
}

export async function GetFileConfig(username: string | null, fileId: number){
    const path = Url + "getFile/" + username + "/" + fileId

    console.log(path)
    console.log(localStorage.getItem('TOKEN'))
    const config = {
        headers: {
          TOKEN: localStorage.getItem('TOKEN'),
        }
      }

    const response = await axios.get(path, config)
    
    console.log(response)
    
    return response.data
}

export async function GetFileNames(username: string | null, repository: string){

    const path = Url + "getFileNames/" + username + "/" + repository

    const config = {
        headers: {
          TOKEN: localStorage.getItem('TOKEN'),
        }
      }

    const response = await axios.get(path, config)
    
    console.log(response)
    
    return response.data
}

export async function GetConfig(
    device_type: AvailableDevice,
    host: string | undefined,
    AccessPointUsername: string,
    password: string,
    username: string | null,
    Repository: number | undefined ){

    const config = {
        headers: {
          TOKEN: localStorage.getItem('TOKEN'),
        }
      }

    const path = Url + "getConfig"

    const response = await axios.post(path, {
        AccessPoint: {
            device_type: device_type,
            host: host,
            username: AccessPointUsername,
            password: password,
          },
          username: username,
          Repository: Repository
    }, config)
    
    console.log(response)
    
    return response.data
}

export async function UpdateSnmp(  
  device_type: AvailableDevice,
  host: string | undefined,
  AccessPointUsername: string,
  password: string,
  username: string | null,
  Repository: number | undefined,
  community: string,
  port: number,
  secret:string = ""){

  const path = Url + "EnableSnmp"

  const config = {
      headers: {
        TOKEN: localStorage.getItem('TOKEN'),
      }
    }
    
  const response = await axios.post(path, {
      AccessPoint: {
        device_type: device_type,
        host : host,
        username : AccessPointUsername,
        password : password,
        port : port,
        secret: secret
      },
      username : username,
      Repository : Repository,
      community: community
  }, config)
  
  console.log(response)
  
  return response.data

}

export async function GetInfo(  
  device_type: AvailableDevice,
  host: string | undefined,
  username: string | null,
  Repository: number | undefined,
  community: string,
  port: number = 22,  
  AccessPointUsername: string = "",
  password: string = "",
  secret:string = ""){

  const path = Url + "getInformation"

  const config = {
      headers: {
        TOKEN: localStorage.getItem('TOKEN'),
      }
    }
    
  const response = await axios.post(path, {
      AccessPoint: {
        device_type: device_type,
        host : host,
        username : AccessPointUsername,
        password : password,
        port : port,
        secret: secret
      },
      username : username,
      Repository : Repository,
      community: community
  }, config)
  
  console.log(response)
  
  return response.data

}

export async function AnalyzConfig(
  username: string,
  fileConfig: string
){
  const path = Url + "AnalyzeConfig"

  console.log(fileConfig)
  const config = {
    headers: {
      TOKEN: localStorage.getItem('TOKEN'),
    }
  }

  const response = await axios.post(path, {
    username: username,
    config : fileConfig
  }, config)
  
  console.log(response)
  
  return response.data

}

export async function UploadConfig(
  filename: string,
  filedata: string,
  device_type: AvailableDevice,
  host: string | undefined,
  AccessPointUsername: string,
  password: string,
  username: string | null,
  Repository: number | undefined ){

  const path = Url + "uploadConfig"

  const config = {
    headers: {
      TOKEN: localStorage.getItem('TOKEN'),
    }
  }

  const response = await axios.post(path, {
    file: {
      name: filename,
      data: filedata,
      fileType: device_type
    },
    hostObject:{
      AccessPoint: {
          device_type: device_type,
          host: host,
          username: AccessPointUsername,
          password: password,
        },
        username: username,
        Repository: Repository
    }
  }, config)
  
  console.log(response)
  
  return response.data
}
