import axios from "axios";
// import { saveAs } from 'file-saver';

const FileSaver = require('file-saver');

type  AvailableDevice = "cisco_ios" | "dell_os6" | "huawei" | "zyxel_os"

const Url = "http://127.0.0.1:8000/"

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

export async function GetFilePath(
    device_type: AvailableDevice,
    host: string | undefined,
    username: string,
    password: string,
    Repository: string | undefined ){

    const path = Url + "GetFilePath"

    const response = await axios.post(path, {
        AccessPoint: {
            device_type: device_type,
            host: host,
            username: username,
            password: password,
          },
          Repository: Repository
    })
    
    console.log(response)
    
    return response.data

}