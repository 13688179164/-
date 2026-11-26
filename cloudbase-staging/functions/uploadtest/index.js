const cloud = require('@cloudbase/node-sdk');
const app = cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
exports.main = async () => {
  const out = {};
  try {
    const r = await app.uploadFile({ cloudPath: 'tests/hello.txt', fileContent: Buffer.from('hello') });
    out.upload = r;
  } catch (e) { out.uploadError = e.message; }
  try {
    const r = await app.getTempFileURL({ fileList: ['tests/hello.txt'] });
    out.url = r;
  } catch (e) { out.urlError = e.message; }
  return out;
};
