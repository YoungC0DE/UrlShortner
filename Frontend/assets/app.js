(function () {
  var meta = document.querySelector('meta[name="api-base"]');
  var API_BASE =
    (meta && meta.getAttribute("content")) || "https://ulnk.com.br";

  var form = document.getElementById("form");
  var urlInput = document.getElementById("url");
  var submitBtn = document.getElementById("submit");
  var resultEl = document.getElementById("result");

  function showResult(state, html) {
    resultEl.hidden = false;
    resultEl.dataset.state = state;
    resultEl.innerHTML = html;
  }

  function hideResult() {
    resultEl.hidden = true;
    resultEl.removeAttribute("data-state");
    resultEl.innerHTML = "";
  }

  async function parseErrorMessage(res) {
    try {
      var data = await res.json();
      if (data.message && typeof data.message === "string") return data.message;
      if (data.error && typeof data.error === "string") return data.error;
    } catch (_) {}
    return "Request failed (" + res.status + ").";
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideResult();

    var raw = urlInput.value.trim();
    if (!raw) {
      showResult(
        "error",
        '<p class="result-msg">Enter a URL.</p>'
      );
      return;
    }

    submitBtn.disabled = true;

    try {
      var res = await fetch(API_BASE.replace(/\/$/, "") + "/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      });

      if (!res.ok) {
        var errText = await parseErrorMessage(res);
        showResult("error", '<p class="result-msg">' + escapeHtml(errText) + "</p>");
        return;
      }

      var data = await res.json();
      var shortUrl = data.short_url || "";

      var successHtml =
        '<p class="result-short">' + escapeHtml(shortUrl) + "</p>" +
        '<p class="result-hint">Short link ready — copy it below.</p>' +
        '<button type="button" class="btn btn-copy" id="copyBtn">Copy</button>';

      showResult("success", successHtml);

      document.getElementById("copyBtn").addEventListener("click", function () {
        copyToClipboard(shortUrl, this);
      });
    } catch (_) {
      showResult(
        "error",
        '<p class="result-msg">Could not reach the API at <code>' +
          escapeHtml(API_BASE) +
          "</code>. Try again in a moment.</p>"
      );
    } finally {
      submitBtn.disabled = false;
    }
  });

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function copyToClipboard(text, btn) {
    function markCopied() {
      if (btn) btn.textContent = "Copied!";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(markCopied)
        .catch(function () {
          fallbackCopy(text);
          markCopied();
        });
    } else {
      fallbackCopy(text);
      markCopied();
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (_) {}
    document.body.removeChild(ta);
  }
})();
