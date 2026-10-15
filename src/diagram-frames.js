// Diagram artifacts share this origin, so their document height can be read
// without changing the generated HTML or replacing its own layout logic.
for (const frame of document.querySelectorAll(".diagram-frame")) {
  let childObserver;
  let fontSet;
  let resizeFrame = 0;
  let contentDocument;

  function measure() {
    resizeFrame = 0;
    if (!contentDocument?.body) return;

    // Archify chooses a reading width from window.innerHeight. Shrinking the
    // iframe after measuring would change that width and feed back into height.
    // Grow only when content actually overflows the current viewport.
    const viewportHeight = frame.contentWindow.innerHeight;
    const contentHeight = Math.ceil(Math.max(
      contentDocument.documentElement.scrollHeight,
      contentDocument.body.scrollHeight,
    ));
    if (contentHeight <= viewportHeight + 1) return;

    const borderHeight = frame.offsetHeight - frame.clientHeight;
    frame.style.height = `${contentHeight + borderHeight + 2}px`;
  }

  function schedule() {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(measure);
  }

  function resetHeight() {
    // Re-establish the CSS fallback when the available width changes, then
    // measure again at that width. Ordinary content updates only grow.
    frame.style.height = "";
    schedule();
  }

  frame.addEventListener("load", () => {
    childObserver?.disconnect();
    fontSet?.removeEventListener?.("loadingdone", schedule);
    contentDocument = null;
    try {
      contentDocument = frame.contentDocument;
      if (!contentDocument?.body) return;
      if (typeof ResizeObserver === "function") {
        childObserver = new ResizeObserver(schedule);
        childObserver.observe(contentDocument.body);
        const container = contentDocument.querySelector(".container");
        if (container) childObserver.observe(container);
      }
      fontSet = contentDocument.fonts;
      fontSet?.ready.then(schedule).catch(() => {});
      fontSet?.addEventListener?.("loadingdone", schedule);
      resetHeight();
    } catch {
      // A future cross-origin artifact keeps the usable CSS height and scroll.
    }
  });

  window.addEventListener("resize", resetHeight, { passive: true });
  document.fonts?.ready.then(schedule).catch(() => {});
  document.fonts?.addEventListener?.("loadingdone", schedule);
}
