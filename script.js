document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusMessage = document.getElementById("statusMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = form.getAttribute("action");
    if (!url || url.includes("YOUR_FORM_ID")) {
      statusMessage.className = "status-message error";
      statusMessage.textContent = "尚未設定 Formspree 表單 ID，請先在 HTML 內設定正確網址！";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "發送中...";
    statusMessage.className = "status-message";
    statusMessage.style.display = "none";

    const formData = new FormData(form);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        statusMessage.className = "status-message success";
        statusMessage.textContent = "訊息已成功送出！我會盡快回覆您。";
        form.reset();
      } else {
        const errorData = await response.json();
        statusMessage.className = "status-message error";
        statusMessage.textContent = errorData?.errors?.[0]?.message || "發送失敗，請稍後再試或直接以 Email 聯絡。";
      }
    } catch (err) {
      statusMessage.className = "status-message error";
      statusMessage.textContent = "網路傳輸發生錯誤，請稍後再試。";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "發送訊息";
    }
  });
});