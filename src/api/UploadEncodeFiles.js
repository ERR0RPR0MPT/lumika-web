import axios from 'axios';

export function uploadEncodeFiles(files) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  return axios.post('/api/upload/encode', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
