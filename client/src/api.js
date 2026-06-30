// API helper — all calls to the Express backend
const BASE = 'https://resume-builder-320o.onrender.com/api';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'API error');
  }
  return data.data;
}

export const api = {
  getAllResumes: () => request('GET', '/resumes'),
  getResume: (id) => request('GET', `/resumes/${id}`),
  createResume: (body) => request('POST', '/resumes', body),
  updateResume: (id, body) => request('PUT', `/resumes/${id}`, body),
  deleteResume: (id) => request('DELETE', `/resumes/${id}`),
};
