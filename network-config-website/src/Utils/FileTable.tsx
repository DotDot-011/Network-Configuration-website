import { GetFileConfig } from '../API/API';
import React from 'react';
import Highlight from 'react-highlight';
import Modal from 'react-modal';

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
}

const FileTable: React.FC<FileTableProps> = ({ files, currentPage }) => {
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
    <table className ="table">
      <thead>
        <tr>
          <th>Filename</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {pageFiles.map((file) => (
            <tr key={file.fileName}>
              <td><a href={"/file/" + file.fileId}>{file.fileName}</a></td>
              <td>{new Date(file.fileTimestamp).toLocaleString()}</td>
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
