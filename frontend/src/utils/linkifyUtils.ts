interface LinkifyOptions {
  formatHref: (href: string, type: string) => string;
  className: string;
  attributes: Record<string, unknown>;
}

export const linkifyOptions: LinkifyOptions = {
  formatHref: function (href: string, type: string) {
    if (type === "hashtag") {
      href = "/explore/tags/" + href.substring(1);
    }
    if (type === "mention") {
      href = "/" + href.substring(1);
    }
    return href;
  },
  className: "styled-link",
  attributes: {
    target: {
      url: "_blank",
    },
  },
};
