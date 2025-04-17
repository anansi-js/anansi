# 🔍 Under the Hood

## 🕷️ How the Spider Works

The spider uses [Puppeteer](https://pptr.dev/) to visit each **start URL** defined in the config file. For every start URL, it queues a job that does the following:

- Opens the URL in a headless Chrome browser.
- Scrapes the rendered page and constructs **search index records** (see next section).
- Extracts all links from the page and adds them to the queue — unless the link has already been visited during the current run.
- Continues this process recursively until the queue is empty (i.e. all reachable pages from the start URLs have been visited).

---

## 🧱 Scraping and Constructing an Index Record

### 🧬 Record Structure

Each piece of content scraped from the site is turned into a record with the following structure:

```ts
{
  uniqueId: string;      // md5 hash of (URL + text match). Only the latest match per page is indexed.
  url: string;           // The source page's URL.
  content: string;       // The main content of the record (shown in search results).
  title: string;         // Title of the record.
  hierarchy: Hierarchy;  // Structured location of the content (see below).
  metadata: Metadata;    // Optional custom metadata.
  weight: {
    level: number;       // Based on hierarchy level (e.g. l0 is most important).
    pageRank: number;    // Optional additional ranking.
  }
}
```

### 📚 Hierarchy Structure

```ts
{
  l0: string;     // Most important (e.g. page title)
  l1: string;
  l2: string;
  l3: string;
  l4: string;
  content: string; // Least important (e.g. paragraph text)
}
```

The **hierarchy** affects ranking: matches at higher levels (e.g. `l0`) are considered more relevant than lower ones (`content`).

---

### ⚙️ Scraping Flow (Per Page)

Each scraping job runs inside a Puppeteer Cluster task, and follows these steps:

1. Find the scraper config that matches the current page URL (based on pattern matching).
2. Use the provided selectors to query the DOM for elements to extract.
3. Iterate through these elements in their DOM order and generate search records using the structure above.
4. While doing this, keep track of the **current hierarchy state** (see below) and include it in each new record.
5. Once a new page is loaded, reset the hierarchy.

---

## 🧭 How the Hierarchy Works

The **hierarchy** allows you to assign semantic importance to elements using up to five levels (`l0` to `l4`), plus a `content` level for regular text. For example:

```json
"hierarchySelectors": {
  "l0": "title",
  "l1": "#content h1",
  "l2": "#content h2",
  "l3": "#content h3",
  "l4": "#content h4",
  "content": "#content p"
}
```

As the spider processes elements on the page:

- It checks which hierarchy level each selector belongs to.
- It updates the **hierarchy state** with the matched text at that level.
- Every record is created using the **latest state** of the hierarchy at that point in the DOM.

This hierarchy determines **search ranking** after indexing:
- Matches in higher levels (like `l0`) are ranked above those in lower levels (like `content`).

---

### 🧪 Example: Why Hierarchy Affects Ranking

Given these two pages:

#### Page 1:
```html
<title>Upcoming events</title>
<!-- ... -->
```

#### Page 2:
```html
<title>About us</title>
<p>At coolsite.org we promote all sorts of events...</p>
```

A search for **"events"** would prioritize the record from **Page 1** (where "events" appears in the `<title>`, i.e. `l0`), over Page 2 (where it appears in a `<p>`, i.e. `content`), due to the higher weight of level `l0`.
