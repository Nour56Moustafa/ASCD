document.addEventListener("DOMContentLoaded", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get("id");

    const response = await axios.get(
      `http://localhost:3000/api/v1/companies/${companyId}`
    );

    const company = response.data.company;

    // Update the elements with the retrieved blog data
    const html = `<div class="px-4 pt-0 pb-4 cover">
          <div class="media align-items-end profile-head">
              <div class="profile mr-3">
                  <img src="images/5.jpg" alt="..." width="150" class="rounded mb-2 img-thumbnail">

              </div>
              <div class="media-body mb-5 text-white">
                  <h4 class="mt-0 mb-0" style="font-size:25px; color:white;">${
                    company.name
                  }</h4>
                  <p class="small mb-4" style="padding-bottom: 10px;">
                      <i class="fas fa-map-marker-alt mr-2" style="font-size:15px"></i>${
                        company.branches[0] || ""
                      }
                  </p>
              </div>
          </div>
      </div>
      <div class="bg-light p-4 d-flex justify-content-end text-center" dir="rtl">
          <ul class="list-inline mb-0">
              <li class="list-inline-item">

                  <small class="text-muted"> <i class="fa-brands fa-twitter" aria-hidden="true" style="width: 30px !important; font-size: 20px; cursor: pointer;"></i></small>
              </li>
              <li class="list-inline-item">

                  <small class="text-muted"> <i class="fa-brands fa-facebook" aria-hidden="true" style="width: 30px !important; font-size: 20px; cursor: pointer;"></i></small>
              </li>
              <li class="list-inline-item">

                  <small class="text-muted"> <i class="fa-brands fa-google" aria-hidden="true" style="width: 30px !important; font-size: 20px; cursor: pointer;"></i></small>
              </li>
          </ul>
      </div>

      <div class="px-4 py-3" dir="rtl">
          <h4 class="mb-0" style="text-align:right; font-size:25px">نبذة</h4>
          <div class="p-4 rounded shadow-sm bg-light">
              <p class="font-italic mb-0" style="text-align:right; font-size:20px">
                ${company.desc}
              </p>
            </div>
      </div>
      <div class="px-4 py-3" dir="rtl">
          <h4 class="mb-0" style="text-align:right; font-size:25px">أفرع الشركة</h4>
          <div class="p-4 rounded shadow-sm bg-light">
          ${company.branches.map(
            (branch) => `
          <p
          class="font-italic mb-0 "
          style="text-align:right; font-size:18px "
        >
          ${branch}
        </p>`
          )}
          </div>
      </div>
      <div class="px-4 py-3" dir="rtl">
          <h4 class="mb-0" style="text-align:right; font-size:25px">حساباتنا الالكترونية</h4>
          <div class="p-4 rounded shadow-sm bg-light">
          ${company.accounts.map(
            (account) => `
            <p
              class="font-italic mb-0"
              style="text-align:right; font-size:18px"
            >
              ${account}
            </p>
          `
          )}
          </div>
      </div>
      `;

    const companyProfile = document.getElementById("co-profile-widget");
    companyProfile.innerHTML = html;
  } catch (error) {
    console.error("Error:", error);
  }
});
