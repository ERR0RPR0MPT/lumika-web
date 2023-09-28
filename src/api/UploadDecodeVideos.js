import axios from 'axios';

export function uploadDecodeFiles(files, fileNameInput) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('directory', file);
  });
  formData.append('folderName', fileNameInput);

  return axios.post('/api/upload/decode', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
