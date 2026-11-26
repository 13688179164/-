/**
 * 环境选择：生产站点域名固定用生产环境；
 * 其他站点（staging 预览 / 验收站）默认 staging，可用 ?env=prod 切到生产并记忆。
 */
export const PROD_ENV = 'attractive-starfish-d0bp2e865971';
export const STAGING_ENV = 'ready-puma-d4gmuy5yeca0a8f3c';

const PROD_HOSTS = [/^37l9gib3n8sziipttw9/];
const LS_KEY = 'gw.env.override';

export function resolveEnv() {
  try {
    const q = new URLSearchParams(location.search).get('env');
    if (q === 'prod' || q === 'staging') localStorage.setItem(LS_KEY, q);
    const saved = localStorage.getItem(LS_KEY);
    if (saved === 'prod') return PROD_ENV;
    if (saved === 'staging') return STAGING_ENV;
  } catch { /* noop */ }
  return PROD_HOSTS.some((re) => re.test(location.hostname)) ? PROD_ENV : STAGING_ENV;
}
