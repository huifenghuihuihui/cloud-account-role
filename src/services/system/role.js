import request from '../../utils/request';

// 请求权限信息
export async function queryPosts(params) {
  return request('/api/role/queryPosts', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 请求权限信息
export async function queryRoles(params) {
  return request('/api/role/queryRoles', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 请求权限信息
export async function queryPostCode(params) {
  return request('/api/role/queryPostCode', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 保存角色信息
export async function savePost(params) {
  return request('/api/role/savePost', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 启用停用员工信息
export async function updateStatus(params) {
  return request('/api/role/changeStatus', {
    method: 'post',
    body: params,
  });
}

