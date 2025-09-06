// Tab switching
document.querySelectorAll(".tab-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-button")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Base64 Functions
function encodeBase64() {
  const text = document.getElementById("base64-input").value;
  document.getElementById("base64-output").value = btoa(text);
}

function decodeBase64() {
  const text = document.getElementById("base64-input").value;
  try {
    document.getElementById("base64-output").value = atob(text);
  } catch {
    document.getElementById("base64-output").value =
      "❌ Invalid Base64 string!";
  }
}

// Encode file to Base64 (simpan dengan MIME type)
function encodeFile() {
  const fileInput = document.getElementById("file-input").files[0];
  if (!fileInput) {
    alert("Sila pilih fail dulu!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    // result → "data:image/png;base64,AAAA..."
    const base64String = event.target.result;
    document.getElementById("base64-output").value = base64String;
  };
  reader.readAsDataURL(fileInput); // auto include MIME type
}

// Decode Base64 back to file (guna MIME type asal)
function decodeFile() {
  const base64Data = document.getElementById("base64-output").value;
  const fileName = document.getElementById("file-name").value || "output";

  if (!base64Data) {
    alert("⚠️ No Base64 data to decode!");
    return;
  }

  try {
    // Pecahkan data: "data:[mime];base64,XXXX"
    const parts = base64Data.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const data = parts[1];

    // Convert base64 → binary
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Auto tambah extension ikut MIME type
    let extension = mimeType.split("/")[1] || "bin";
    const finalFileName = fileName.includes(".")
      ? fileName
      : `${fileName}.${extension}`;

    // Buat link untuk download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = finalFileName;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    alert("❌ Invalid Base64 data!");
  }
}
