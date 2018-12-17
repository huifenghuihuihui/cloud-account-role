import request from '../../utils/request';

// 查询角色列表
export async function inquireRole(params) {
  return request('/api/role/queryPosts', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 修改状态-启用停用
export async function enable(params) {
  return request('/api/role/changeStatus', {
    method: 'post',
    body: params,
  });
}

// 删除角色
export async function removeRole(params) {
  return request('/api/role/deletePost', {
    method: 'post',
    body: params,
  });
}

// 新增编辑角色
export async function createRole(params) {
  return request('/api/role/savePost', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 查询权限列表树
export async function inquireTree(params) {
  return request('/api/role/queryRoles', {
    method: 'post',
    body: params,
  });
}

// 取得权重
export async function inquireCode() {
  return request(' /api/role/queryPostCode', {
    method: 'post',
  });
}
