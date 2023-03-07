import { GetFileConfig } from '../API/API';
import React from 'react';
import Highlight from 'react-highlight';
import Modal from 'react-modal';
import "./FileTable.css"
interface CodeBlockProps {
  code: string;
}

interface File {
  fileId: number;
  fileName: string;
  fileTimestamp: Date;
}

interface FileTableProps {
  files: File[];
  currentPage: number;
  checkHandle: ((e: React.ChangeEvent<HTMLInputElement>) => void)
}

const FileTable: React.FC<FileTableProps> = ({ files, currentPage, checkHandle}) => {
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const pageFiles = files.slice(startIndex, endIndex);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [config, setConfig] = React.useState<string>("");

  React.useEffect(()=>{
    console.log(files)
  }, [selectedFile])

  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
    <table className = "table table-striped table-responsive-md btn-table">
      <thead>
        <tr>
          <th>Filename</th>
          <th>Timestamp</th>
          <th>Compare</th>
        </tr>
      </thead>
      <tbody>
        {pageFiles.map((file) => (
            <tr key={file.fileName}>
              <td><a href={"/file/" + file.fileId}>{file.fileName}</a></td>
              <td>{new Date(file.fileTimestamp).toLocaleString()}</td>
              <td><input type="checkbox" name={file.fileName} value={file.fileId} onChange={checkHandle}></input></td>
            </tr>
        ))}
      </tbody>
    </table>
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
      {selectedFile && (
        <pre>
          <Highlight className='cisco'>{config}</Highlight>
        </pre>
      )}
    </Modal>
  </>
  );
};

export default FileTable;
