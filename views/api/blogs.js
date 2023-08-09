document.addEventListener('DOMContentLoaded', async() => {
    try {
        const blogIdElement = document.querySelector('.article[data-blog-id]');
        const blogId = blogIdElement.getAttribute('data-blog-id');


        const response = await axios.get(`http://localhost:3000/api/v1/blogs/${blogId}`);

        const blog = response.data.blog;

        // Update the elements with the retrieved blog data
        const imgElement = document.createElement('img');
        imgElement.className = 'blur-up lazyload';
        imgElement.setAttribute('data-src', blog.imgUrl); // Assuming blog.imgUrl contains the full image URL
        imgElement.alt = '';


        // Append the img element to the image container
        const imageContainer = document.getElementById('imageContainer');

        imageContainer.appendChild(imgElement);
        document.getElementById('title').textContent = blog.title;
        document.getElementById('content').innerHTML = blog.content;
        document.getElementById('author').textContent = blog.authorID;

        // Update other elements accordingly

    } catch (error) {
        console.error('Error:', error);
        console.log("fdfdsf")
    }
});