document.addEventListener("DOMContentLoaded", async () => {
  // Companies
  try {
    const response = await axios.get("http://localhost:3000/api/v1/companies");
    const companies = response.data.companies;

    const html = companies.map(
      (company) => `<div class="card">
      <img src="images/photo_2023-04-12_03-28-49.jpg" alt="">
      <div class="card-content" dir="rtl">
          <h3 style="font-size: 25px; text-align:right !important; " dir="rtl">
              ${company.name}
          </h3>
          <p style="font-size: 18px; text-align:right !important; ">
            ${company.desc}
          </p>
          <a href="../co-profile/company profile.html?id=${company._id}" class="button" style="color: black; font-size: 18px; text-align:right; ">
             المزيد من التفاصيل
              <span class="material-symbols-outlined">
                  <box-icon name="right-arrow-alt" style="color: white;"></box-icon>
              </span>
          </a>
      </div>
  </div>
`
    );
    
    const companiesRow = document.getElementById("companies-wrapper");
    companiesRow.innerHTML = html;
  } catch (error) {
    console.error("Error:", error);
  }
});
