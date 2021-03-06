const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  adminInfo: state => state.admin.admin.content,
  adminPage: state => state.admin.admin.pageInfo,
  roleInfo: state => state.admin.role.content,
  rolePage: state => state.admin.role.pageInfo,
  permissionInfo: state => state.admin.permission.content,
  permissionPage: state => state.admin.permission.pageInfo,
  terminalInfo: state => state.baseInfo.terminal.content,
  terminalPage: state => state.baseInfo.terminal.pageInfo,
  communityInfo: state => state.baseInfo.community.content,
  communityPage: state => state.baseInfo.community.pageInfo,
  buildingInfo: state => state.baseInfo.building.content,
  buildingPage: state => state.baseInfo.building.pageInfo,
  roomInfo: state => state.baseInfo.room.content,
  roomPage: state => state.baseInfo.room.pageInfo,
  userInfo: state => state.baseInfo.user.content,
  userPage: state => state.baseInfo.user.pageInfo,
  groupInfo: state => state.baseInfo.group.content,
  groupPage: state => state.baseInfo.group.pageInfo,
  accountInfo: state => state.baseInfo.account.content,
  accountPage: state => state.baseInfo.account.pageInfo,
  sleepInfo: state => state.baseInfo.sleep.content,
  sleepPage: state => state.baseInfo.sleep.pageInfo,
  firmwareInfo: state => state.baseInfo.firmware.content,
  firmwarePage: state => state.baseInfo.firmware.pageInfo,
  advertiseInfo: state => state.baseInfo.advertise.content,
  advertisePage: state => state.baseInfo.advertise.pageInfo,
  adverplaceInfo: state => state.baseInfo.adverplace.content,
  adverplacePage: state => state.baseInfo.adverplace.pageInfo,
  propertyInfo: state => state.baseInfo.property.content,
  propertyPage: state => state.baseInfo.property.pageInfo,
  nperInfo: state => state.baseInfo.nper.content,
  nperPage: state => state.baseInfo.nper.pageInfo,
  unitInfo: state => state.baseInfo.unit.content,
  unitPage: state => state.baseInfo.unit.pageInfo
};
export default getters;
