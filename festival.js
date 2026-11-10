const featuredContainer = document.getElementById("featured-festival");
const festivalContainer = document.getElementById("festival-container");

// Festival utama
const featuredFestival = "Gion Matsuri";

// Festival tambahan
const otherFestivals = [
  "Awa Odori",
  "Aomori Nebuta Festival",
  "Sapporo Snow Festival",
  "Takayama Festival",
  "Kanda Matsuri"
];


// FUNCTION UNTUK MENGAMBIL DATA API
async function fetchFestival(festivalName) {

  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(festivalName)}`
  );

  if (!response.ok) {
    throw new Error(`Gagal mengambil data ${festivalName}`);
  }

  return await response.json();
}


// FESTIVAL UTAMA
async function getFeaturedFestival() {

  try {
    const data = await fetchFestival(featuredFestival);

    if (!data.title || !data.extract) {
      throw new Error("Data festival tidak lengkap");
    }

    // Card utama
    const card = document.createElement("div");
    card.classList.add("featured-festival-card");

    // Gambar
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("featured-festival-image");

    if (data.thumbnail?.source) {

      const image = document.createElement("img");

      image.src = data.thumbnail.source;
      image.alt = data.title;
      image.loading = "eager";

      imageWrapper.appendChild(image);

    } else {
      imageWrapper.textContent = "Gambar tidak tersedia";
    }

    // Informasi
    const info = document.createElement("div");
    info.classList.add("featured-festival-info");

    const label = document.createElement("span");
    label.classList.add("festival-label");
    label.textContent = "FEATURED FESTIVAL";

    const title = document.createElement("h2");
    title.textContent = data.title;

    const subtitle = document.createElement("h3");
    subtitle.textContent =
      data.description || "A traditional festival in Japan";

    const description = document.createElement("p");
    description.textContent = data.extract;

    // Link Wikipedia
    const source = document.createElement("a");
    const pageUrl = data.content_urls?.desktop?.page;

    if (pageUrl) {
      source.href = pageUrl;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "Explore Festival →";
    }

    info.append(label, title, subtitle, description);

    if (pageUrl) {
      info.appendChild(source);
    }

    card.append(imageWrapper, info);

    featuredContainer.replaceChildren(card);

  } catch (error) {

    console.error("Featured festival error:", error);

    featuredContainer.textContent =
      "Gagal memuat festival utama.";
  }
}


// FESTIVAL TAMBAHAN
async function getOtherFestivals() {

  const results = await Promise.allSettled(
    otherFestivals.map((festival) => fetchFestival(festival))
  );

  festivalContainer.replaceChildren();

  results.forEach((result) => {

    if (result.status === "fulfilled") {

      const data = result.value;

      // Card
      const card = document.createElement("div");
      card.classList.add("other-festival-card");

      // Gambar
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("other-festival-image");

      if (data.thumbnail?.source) {

        const image = document.createElement("img");

        image.src = data.thumbnail.source;
        image.alt = data.title;
        image.loading = "lazy";

        imageWrapper.appendChild(image);

      } else {
        imageWrapper.textContent = "Gambar tidak tersedia";
      }

      // Informasi
      const info = document.createElement("div");
      info.classList.add("other-festival-info");

      const title = document.createElement("h3");
      title.textContent = data.title;

      const description = document.createElement("p");
      description.textContent = data.extract;

      const source = document.createElement("a");
      const pageUrl = data.content_urls?.desktop?.page;

      if (pageUrl) {
        source.href = pageUrl;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.textContent = "Read more →";
      }

      info.append(title, description);

      if (pageUrl) {
        info.appendChild(source);
      }

      card.append(imageWrapper, info);

      festivalContainer.appendChild(card);

    } else {

      console.error("Festival gagal dimuat:", result.reason);

    }

  });

  if (festivalContainer.children.length === 0) {
    festivalContainer.textContent =
      "Festival belum berhasil dimuat.";
  }
}


// JALANKAN FUNCTION
getFeaturedFestival();
getOtherFestivals();