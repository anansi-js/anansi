/**
 * return a url without www, hash and querystring
 */
export const cleanupUrl = (s: string) => {
  return withoutTrailingSlash(
    s
      .replace('www.', '')
      .replace(/\?(.)*/, '')
      .replace(/#(.)*/, '')
  );
};

export const withoutTrailingSlash = (s: string) => {
  const chars = s.split('');
  if (chars.at(-1) === '/') {
    return chars.slice(0, -1).join('');
  }
  return s;
};

export const urlToDomain = (urlString: string) => {
  try {
    if (!urlString.startsWith('http')) {
      urlString = 'https://' + urlString;
    }
    const url = new URL(urlString);
    return url.hostname.replace('www.', '');
  } catch (error) {
    return '';
  }
};

export const injectUrlParams = ({
  url,
  pathParams,
  queryParams
}: {
  url: string;
  pathParams?: Record<string, any>;
  queryParams?: Record<string, any>;
}) => {
  if (pathParams && typeof pathParams === 'object') {
    const params = Object.entries(pathParams);
    params.forEach(([key, val]) => {
      url = url.replace(new RegExp(`:${key}`, 'g'), val);
    });
  }
  if (queryParams && typeof queryParams === 'object') {
    const params = Object.entries(queryParams);
    const queryString = params.map(([key, val]) => `${key}=${val}`).join('&');
    if (queryString) {
      url = url + '?' + queryString;
    }
  }
  return url;
};
