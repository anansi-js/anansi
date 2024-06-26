import { Page } from 'puppeteer';
import { ScrapedRecord, ScraperSettings } from './types';
import {
  getFromBaseAndCustom,
  uniq,
  withoutTrailingSlash,
  getBasicAuthHeader,
  getSettingsGroupForUrl,
  getSelectorMatches,
  getSelectorMetadata,
  removeExcludedElements,
  constructRecords,
  cleanupUrl
} from './utils';
import { Logger } from './Logger';

interface PageScraperOptions {
  onStart?: () => void | Promise<void>;
  onFinish?: (args: {
    scrapedRecords: ScrapedRecord[];
    scrapedLinks: string[];
  }) => void | Promise<void>;
  onAbort?: () => void | Promise<void>;
  stopSignal?: () => boolean;
  settings: ScraperSettings;
}

export class PageScraper {
  private readonly onStart?: () => void | Promise<void>;
  private readonly onFinish?: (args: {
    scrapedRecords: ScrapedRecord[];
    scrapedLinks: string[];
  }) => void | Promise<void>;
  private readonly onAbort?: () => void | Promise<void>;
  private readonly stopSignal?: () => void;
  private readonly settings: ScraperSettings;
  private readonly logger: Logger;

  constructor(options: PageScraperOptions) {
    this.onStart = options.onStart;
    this.onFinish = options.onFinish;
    this.onAbort = options.onAbort;
    this.stopSignal = options.stopSignal;
    this.settings = options.settings;
    this.logger = Logger.getInstance({});
  }

  /**
   * scrape an HTML page for links and content for searching. When done, call the PageScraper's onFinish callback with the
   * obtained links and records
   */
  public async scrapePage({
    page,
    data: { url }
  }: {
    page: Page;
    data: { url: string };
  }) {
    try {
      const fullUrl = url;
      url = cleanupUrl(url);
      const { settingsGroup: scraperPageSettings, groupName } =
        getSettingsGroupForUrl(this.settings, url);
      if (!scraperPageSettings) {
        throw new Error('could not retrieve scraper settings');
      }
      this.logger.debug(
        `Scraper page settings (using settings group ${groupName})`,
        JSON.stringify(this.settings || {})
      );
      const {
        respectRobotsMeta = false,
        excludeSelectors,
        userAgent,
        basicAuth,
        headers,
        pageRank,
        onlyContentLevel = true
      } = getFromBaseAndCustom(scraperPageSettings, this.settings.shared, [
        'respectRobotsMeta',
        'excludeSelectors',
        'userAgent',
        'basicAuth',
        'headers',
        'pageRank',
        'onlyContentLevel'
      ]);
      const hierarchySelectors =
        scraperPageSettings.hierarchySelectors ||
        this.settings.shared?.hierarchySelectors;
      if (!hierarchySelectors) {
        throw new Error('could not retrieve hierarchy selectors');
      }
      const metadataSelectors =
        scraperPageSettings.metadataSelectors ||
        this.settings.shared?.metadataSelectors;

      this.onStart?.();
      const shouldAbort = !!this.stopSignal?.();
      this.logger.debug(`scraper task: shouldAbort==${shouldAbort}`);
      if (shouldAbort) {
        this.logger.warn(`scraper task: shouldAbort==true, aborting!`);
        this.onAbort?.();
        return;
      }
      // page
      //   .on('console', (message) => console.log(message.text()))
      //   .on('pageerror', ({ message }) => console.log(message))
      //   // .on('response', (response) =>
      //   //   console.log(`${response.status()} ${response.url()}`)
      //   // )
      //   .on('requestfailed', (request) =>
      //     console.log(`${request.failure().errorText} ${request.url()}`)
      //   );

      this.logger.debug(`Scraping URL ${url}`);
      if (userAgent) {
        await page.setUserAgent(userAgent);
      }
      if (headers) {
        await page.setExtraHTTPHeaders(headers);
      }
      if (basicAuth) {
        await page.setExtraHTTPHeaders(
          getBasicAuthHeader(basicAuth.user, basicAuth.password)
        );
      }

      await page.goto(url);

      let skipCrawling = false;
      if (respectRobotsMeta) {
        skipCrawling = await page.evaluate((robotsSelector: string) => {
          return Array.from(document.querySelectorAll(robotsSelector)).some(
            (element) => {
              return (element as any)?.content?.includes('noindex');
            }
          );
        }, "head > meta[name='robots']");
      }

      if (!skipCrawling) {
        if (excludeSelectors) {
          this.logger.debug(
            `Removing excluded selectors from DOM`,
            JSON.stringify(excludeSelectors || {})
          );
          await page.evaluate(removeExcludedElements, {
            exclude: excludeSelectors
          });
          this.logger.debug(
            `Successfully removed excluded selectors`,
            JSON.stringify(excludeSelectors || {})
          );
        }
        await page.exposeFunction('uniq', uniq);
        const { selectorMatches, selectorMatchesByLevel, title } =
          await page.evaluate(getSelectorMatches, {
            selectors: hierarchySelectors
          });
        this.logger.debug(`Page title`, title);
        this.logger.debug(
          `Page selector matches`,
          JSON.stringify(selectorMatches || {})
        );
        this.logger.debug(
          `Page selector matches by level`,
          JSON.stringify(selectorMatchesByLevel || {})
        );
        const metadata = metadataSelectors
          ? await page.evaluate(getSelectorMetadata, {
              selectors: metadataSelectors
            })
          : {};
        this.logger.debug(`Page metadata`, JSON.stringify(metadata || {}));

        const records = constructRecords({
          selectorMatches,
          selectorMatchesByLevel,
          onlyContentLevel,
          url,
          fullUrl,
          title,
          metadata,
          pageRank
        });

        const allLinks = uniq(
          (
            await page.evaluate((resultsSelector: string) => {
              return Array.from(document.querySelectorAll(resultsSelector)).map(
                (anchor) => {
                  return (anchor as HTMLAnchorElement).href;
                }
              );
            }, 'a')
          )?.map((link) => withoutTrailingSlash(link))
        );
        this.logger.debug(`Page links`, allLinks);
        if (this.onFinish) {
          this.logger.debug(`Page scraped`, JSON.stringify(records || {}));
          await this.onFinish({
            scrapedRecords: records,
            scrapedLinks: allLinks
          });
        }
      } else {
        // skip crawling this page
        this.logger.warn(
          `Page scraping skipped for ${url} (respecting "noindex" in robots meta tag - this behaviour can be changed via config. See: https://github.com/anansi-js/anansi#crawlerconfig [respectRobotsMeta])`
        );
        if (this.onFinish) {
          this.onFinish({ scrapedRecords: [], scrapedLinks: [] });
        }
      }
    } catch (error) {
      console.log(error);
      this.logger.error(`error scraping url ${url}`, error);
    }
  }
}
