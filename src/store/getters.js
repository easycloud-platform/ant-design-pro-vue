const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  email: state => state.user.email,
  roles: state => state.user.roles,
  userInfo: state => state.user,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n.lang,
  appTitle: state => '漓江风景名胜区综合执法司法虚拟仿真实验'
}

export default getters
