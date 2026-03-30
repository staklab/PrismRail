const app = globalThis.__LLMThreadNavigator;

app.optimizer = {
  apply(records, settings) {
    if (!records.length) {
      document.documentElement.classList.remove("llmtn-heavy-thread");
      return;
    }

    const heavy = records.length >= settings.messageThreshold;
    document.documentElement.classList.toggle("llmtn-heavy-thread", heavy);

    records.forEach((record) => {
      record.node.classList.add("llmtn-message");
      this.optimizeMedia(record.node);
      if (settings.collapseCodeBlocks) {
        this.collapseCodeBlocks(record.node, settings.codeBlockHeight);
      }
    });
  },

  optimizeMedia(root) {
    root.querySelectorAll("img").forEach((image) => {
      if (!image.hasAttribute("loading")) {
        image.setAttribute("loading", "lazy");
      }
      if (!image.hasAttribute("decoding")) {
        image.setAttribute("decoding", "async");
      }
    });
  },

  collapseCodeBlocks(root, maxHeight) {
    root.querySelectorAll("pre").forEach((block) => {
      if (block.dataset.llmtnProcessed === "true") {
        return;
      }

      const height = block.scrollHeight;
      if (height <= maxHeight) {
        block.dataset.llmtnProcessed = "true";
        return;
      }

      const wrapper = app.utils.create("div", {
        className: "llmtn-code-shell llmtn-collapsed"
      });
      wrapper.style.setProperty("--llmtn-code-height", `${maxHeight}px`);
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      const toggle = app.utils.create("button", {
        className: "llmtn-code-toggle",
        type: "button"
      }, "展开代码");

      toggle.addEventListener("click", () => {
        const collapsed = wrapper.classList.toggle("llmtn-collapsed");
        toggle.textContent = collapsed ? "展开代码" : "收起代码";
      });

      wrapper.insertAdjacentElement("afterend", toggle);
      block.dataset.llmtnProcessed = "true";
    });
  }
};
