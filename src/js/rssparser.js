const getArticlesFrom = (channel) => {
  const items = [...channel.querySelectorAll('item')];
  return items.map((item) => {
    const titleEl = item.querySelector('title');
    const descriptionEl = item.querySelector('description');
    const linkEl = item.querySelector('link');
    const pubDateEl = item.querySelector('pubDate');
    const guidEl = item.querySelector('guid');

    return {
      title: titleEl.textContent,
      description: descriptionEl.textContent,
      link: linkEl.textContent,
      pubDate: Date.parse(pubDateEl.textContent),
      guid: guidEl.textContent,
    };
  });
};

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channel = doc.querySelector('channel');
  const titleEl = channel.querySelector('title');
  const descriptionEl = channel.querySelector('description');
  const articles = getArticlesFrom(channel);

  return {
    title: titleEl.textContent,
    description: descriptionEl.textContent,
    articles,
  };
};
