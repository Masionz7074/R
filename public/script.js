$(document).ready(function () {
  const fileList = $("#fileList");

  function loadFiles() {
    $.getJSON("/files", function (files) {
      fileList.empty();
      files.forEach(file => {
        fileList.append(`
          <li>
            <span>${file.name}</span>
            <a href="${file.url}" download>Download</a>
          </li>
        `);
      });
    });
  }

  $("#uploadForm").on("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    $.ajax({
      url: "/upload",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function () {
        loadFiles();
      },
      error: function (err) {
        alert("Upload failed: " + err.responseText);
      }
    });
  });

  loadFiles();
});
