import {
  urlToDomain,
  withoutTrailingSlash,
  cleanupUrl,
  injectUrlParams
} from './urls';

describe('utils/urls', () => {
  test('utils/urls/withoutTrailingSlash - should return a url without its trailing slash', () => {
    expect(withoutTrailingSlash('www.site.com/')).toEqual('www.site.com');
    expect(withoutTrailingSlash('https://site.com/')).toEqual(
      'https://site.com'
    );
    expect(withoutTrailingSlash('https://site.com///')).toEqual(
      'https://site.com//'
    );
  });

  test('utils/urls/urlToDomain - should return a domain based on given url', () => {
    expect(urlToDomain('www.site.com')).toEqual('site.com');
    expect(urlToDomain('https://site.com')).toEqual('site.com');
    expect(urlToDomain('https://www.site.com')).toEqual('site.com');
    expect(urlToDomain('https://nested.subdomain.site.com')).toEqual(
      'nested.subdomain.site.com'
    );
  });

  test('utils/urls/cleanupUrl - should return a url without www, trailing slash, hash and querystring', () => {
    expect(cleanupUrl('https://www.site.com')).toEqual('https://site.com');
    expect(cleanupUrl('https://site.com/')).toEqual('https://site.com');
    expect(cleanupUrl('https://www.site.com?foo=bar')).toEqual(
      'https://site.com'
    );
    expect(cleanupUrl('https://www.site.com/#section?foo=bar&bar=baz')).toEqual(
      'https://site.com'
    );
  });

  test('utils/urls/injectUrlParams', () => {
    expect(
      injectUrlParams({
        url: 'https://www.site.com/:id1/z/:id2',
        pathParams: { id1: 'xx', id2: 'yy' },
        queryParams: { foo: 'bar' }
      })
    ).toEqual('https://www.site.com/xx/z/yy?foo=bar');
  });
});
