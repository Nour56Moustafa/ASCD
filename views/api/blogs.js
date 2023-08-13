document.addEventListener("DOMContentLoaded", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");

    const response = await axios.get(
      `http://localhost:3000/api/v1/blogs/${articleId}`
    );

    const blog = response.data.blog;
   
    // Update the elements with the retrieved blog data
    const imgElement = document.createElement("img");
    imgElement.className = "blur-up lazyload";
    imgElement.setAttribute("data-src", blog.imgUrl); // Assuming blog.imgUrl contains the full image URL
    imgElement.alt = "";

    // Append the img element to the image container
    const imageContainer = document.getElementById("imageContainer");

    imageContainer.appendChild(imgElement);
    document.getElementById("title").textContent = blog.title;
    document.getElementById("content").innerHTML = blog.content;
    document.getElementById("author-name").textContent = blog.authorID;

    // Update other elements accordingly
  } catch (error) {
    console.error("Error:", error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("comment-submit-btn")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const commentMessage =
        document.getElementById("ContactFormMessage").value;

      // Sending the data to the controller endpoint using Axios
      axios
        .post(
          "http://localhost:3000/api/v1/comments",
          {
            content: commentMessage,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});
