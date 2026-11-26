const cloud = require('@cloudbase/node-sdk');
const app = cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });

exports.main = async (event, context) => {
  let user = null;
  let err = null;
  try {
    user = await app.auth().getUserInfo();
  } catch (e) {
    err = e.message;
  }
  return {
    ok: true,
    user,
    err,
    ctxKeys: Object.keys(context || {}),
    eventKeys: Object.keys(event || {}),
  };
};
