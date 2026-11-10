const cultureContainer = document.getElementById("culture-container");

const cultures = [
  "Japanese tea ceremony",
  "Kimono",
  "Ikebana",
  "Japanese calligraphy",
  "Sumo"
];

async function getCultures() {
  try {
    const results = await Promise.allSettled(
      cultures.map(async (cultureName) => {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cultureName)}`
        );

        if (!response.ok) {
          throw new Error(`Gagal mengambil ${cultureName}`);
        }

        return await response.json();
      })
    );

    cultureContainer.replaceChildren();

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const data = result.value;

        const card = document.createElement("div");
        card.classList.add("culture-card");

        // Bagian gambar
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("culture-image");

        if (data.thumbnail?.source) {
          const image = document.createElement("img");

          image.src = data.thumbnail.source;
          image.alt = `Budaya ${data.title}`;
          image.loading = "lazy";

          image.onerror = () => {
            imageWrapper.textContent = "Gambar tidak tersedia";
          };

          imageWrapper.appendChild(image);
        } else {
          imageWrapper.textContent = "Gambar tidak tersedia";
        }

        // Bagian informasi
        const info = document.createElement("div");
        info.classList.add("culture-info");

        const title = document.createElement("h2");
        title.textContent = data.title;

        const description = document.createElement("p");
        description.textContent = data.extract;

        const source = document.createElement("a");
        const pageUrl = data.content_urls?.desktop?.page;

        if (pageUrl) {
          source.href = pageUrl;
          source.target = "_blank";
          source.rel = "noopener noreferrer";
          source.textContent = "Baca selengkapnya →";
        }

        info.append(title, description);

        if (pageUrl) {
          info.appendChild(source);
        }

        card.append(imageWrapper, info);
        cultureContainer.appendChild(card);
      } else {
        console.error("Gagal mengambil salah satu budaya:", result.reason);
      }
    });

    if (cultureContainer.children.length === 0) {
      cultureContainer.textContent = "Data budaya belum berhasil dimuat.";
    }

  } catch (error) {
    console.error("Error:", error);
    cultureContainer.textContent = "Gagal mengambil data budaya.";
  }
}

getCultures();