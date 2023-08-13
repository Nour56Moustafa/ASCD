document.addEventListener("DOMContentLoaded", async () => {
  // Blogs
  try {
    const response = await axios.get("http://localhost:3000/api/v1/blogs");
    const blogs = response.data.blogs;
    const html = blogs.map(
      (blog) => `
             <div class="col-12 col-sm-12 col-md-6 col-lg-6">
             <div class="wrap-blog">
                 <a href="" class="article__grid-image">
                     <img src="assets/images/blog/2.jpg" alt="" title=${blog.title} class="blur-up lazyloaded" />
                 </a>
                 <div class="article__grid-meta article__grid-meta--has-image" dir="rtl">
                     <div class="wrap-blog-inner" dir="rtl">
                         <h2 class="h3 article__title">
                             <a href="">${blog.title}</a>
                         </h2>
                         <span class="article__date">02/5/2023</span>
                         <div class="rte article__grid-excerpt">
                         ${blog.content}    
                         </div>
                         <a href="" style="color:#346bba;">${blog.title} </a>
                         <div class="wishlist-btn">
                             <a class="wishlist add-to-wishlist" href="wishlist.html">
                                 <i class="icon anm anm-heart-l"></i>
                             </a>
                         </div>
                         <ul class="list--inline article__meta-buttons">
                             <li><a href="../blog/blog-article.html?id=${blog._id}">أقرأ المزيد</a></li>
                         </ul>
                     </div>
                 </div>
             </div>
         </div>`
    );

    const articlesRow = document.getElementById("articles-row");
    articlesRow.innerHTML = html;
  } catch (error) {
    console.error("Error:", error);
  }

  // ** Companies
  try {
    const response = await axios.get("http://localhost:3000/api/v1/companies");
    const companies = response.data.companies;
    const html = companies.map(
      (company, index) => `
        <div class="collection-grid-item slick-slide slick-active">
          <a href="../co-profile/company profile.html?id=${company._id}" class="collection-grid-item__link" tabindex=${index}>
              <img data-src="assets/images/collection/photo_2023-04-12_03-28-46.jpg" src="assets/images/collection/photo_2023-04-12_03-28-46.jpg" alt="" class="blur-up lazyload" />
              <div class="collection-grid-item__title-wrapper">
                  <h3 class="collection-grid-item__title btn btn--secondary no-border">${company.name}</h3>
              </div>
          </a>
       </div>`
    );

    const companiesRow = document.getElementById("companies-row");
    companiesRow.innerHTML = html;
  } catch (error) {
    console.error("Error:", error);
  }

  // ** Events
  if (document.getElementById("quotes-slider-wrapper")) {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/events");
      const events = response.data.events;
      const html = events.map(
        (event) => `
        <div class="quotes-slide">
            <div class="section-header text-center">
            <h1 class="h1">${event.name}</h1>
            <h2 class="h2">${event.instructor}</h2>
            <h2 class="h2"><span>${event.date}</span> <span>${event.time}</span> </h2>
              <h2 class="h2"><span>المدة :${event.duration}</span> <span>،الموقع: ${event.location}</span></h2>
              </div>
              <blockquote class="quotes-slider__text text-center">
              <div class="rte-setting">
              <p>
              ${event.desc}
                     </p>
                     </div>
                     <a href="../reservation/reservation.html" class="btn">قم بالحجز للمؤتمر</a>
                     </blockquote>
                     </div>
                     `
      );

      const eventRow = document.getElementById("quotes-slider-wrapper");
      eventRow.innerHTML = html;
    } catch (error) {
      console.error("Error:", error);
    }
  }
});
