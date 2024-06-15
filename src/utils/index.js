export const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        // eslint-disable-next-line no-mixed-operators
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export const padLeft = (n, width, separator) => {
    separator = separator || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(separator) + n;
}

export const copyIntoClipboard = async (rich, plain) => {
    if (typeof ClipboardItem !== "undefined") {
      // Shiny new Clipboard API, not fully supported in Firefox.
      // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility
      const html = new Blob([rich], { type: "text/html" });
      const text = new Blob([plain], { type: "text/plain" });
      const data = new ClipboardItem({ "text/html": html, "text/plain": text });
      await navigator.clipboard.write([data]);
    } else {
      // Fallback using the deprecated `document.execCommand`.
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#browser_compatibility
      const cb = e => {
        e.clipboardData.setData("text/html", rich);
        e.clipboardData.setData("text/plain", plain);
        e.preventDefault();
      };
      document.addEventListener("copy", cb);
      document.execCommand("copy");
      document.removeEventListener("copy", cb);
    }
  }