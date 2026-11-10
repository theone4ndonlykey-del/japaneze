
const cityContainer = document.getElementById("city-container");

async function getCity() {

    try {

        // 1. Mengambil data dari Wikimedia API
        const response = await fetch(
            "https://en.wikipedia.org/api/rest_v1/page/summary/Kyoto"
        );

        // 2. Memeriksa response API
        if (!response.ok) {
            throw new Error("Gagal mengambil data kota");
        }

        // 3. Mengubah response menjadi JSON
        const data = await response.json();

        console.log("Data berhasil diambil:", data);

        // Memastikan data artikel tersedia
        if (!data.title || !data.extract) {
            throw new Error("Data kota tidak lengkap");
        }

        // 4. Membuat card
        const card = document.createElement("div");
        card.classList.add("city-card");

        // 5. Membuat bagian gambar
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("city-image");

        const image = document.createElement("img");

        // Mengambil URL gambar
        const imageUrl = data.thumbnail?.source;

        if (imageUrl) {

            image.src = imageUrl;
            image.alt = `Pemandangan ${data.title}`;

            // Jika gambar gagal dimuat
            image.onerror = () => {
                imageWrapper.textContent = "Gambar tidak tersedia";
            };

            imageWrapper.appendChild(image);

        } else {

            imageWrapper.textContent = "Gambar tidak tersedia";

        }

        // 6. Membuat bagian informasi
        const info = document.createElement("div");
        info.classList.add("city-info");

        // Nama kota
        const title = document.createElement("h2");
        title.textContent = data.title;

        // Subtitle
        const subtitle = document.createElement("h3");
        subtitle.textContent =
            data.description || "Explore the beauty of Japan";

        // Deskripsi kota
        const description = document.createElement("p");
        description.textContent = data.extract;

        // 7. Membuat tags
        const tags = document.createElement("div");
        tags.classList.add("city-tags");

        const locations = [
            "Kinkaku-ji",
            "Fushimi Inari",
            "Gion",
            "Arashiyama"
        ];

        locations.forEach((location) => {

            const tag = document.createElement("span");

            tag.textContent = location;

            tags.appendChild(tag);

        });

        // 8. Membuat link sumber Wikipedia
        const source = document.createElement("a");

        const wikipediaLink = data.content_urls?.desktop?.page;

        if (wikipediaLink) {

            source.href = wikipediaLink;
            source.target = "_blank";
            source.rel = "noopener noreferrer";
            source.textContent = "Baca selengkapnya →";

        }

        // 9. Memasukkan informasi ke dalam card
        info.append(
            title,
            subtitle,
            description,
            tags
        );

        if (wikipediaLink) {
            info.appendChild(source);
        }

        // 10. Menggabungkan gambar dan informasi
        card.append(
            imageWrapper,
            info
        );

        // 11. Memasukkan card ke HTML
        cityContainer.replaceChildren(card);

    } catch (error) {

        console.error("Error:", error);

        cityContainer.textContent =
            "Gagal memuat data kota. Silakan coba lagi.";

    }

}

// Menjalankan fungsi
getCity();

const otherCitiesContainer = document.getElementById(
    "other-cities-container"
);

// DAFTAR KOTA YANG AKAN DIAMBIL DARI API
const otherCities = [
    "Tokyo",
    "Osaka",
    "Nara",
    "Hiroshima",
    "Sapporo"
];



async function getOtherCities() {

    try {

       
        const results = await Promise.allSettled(

            otherCities.map(async (cityName) => {

                const response = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
                );

                if (!response.ok) {
                    throw new Error(`Gagal mengambil ${cityName}`);
                }

                const data = await response.json();

                return data;

            })

        );

       
        otherCitiesContainer.innerHTML = "";

      
        results.forEach((result) => {

            if (result.status === "fulfilled") {

                const data = result.value;

             
                const card = document.createElement("div");
                card.classList.add("small-city-card");

                
                const imageWrapper = document.createElement("div");
                imageWrapper.classList.add("small-city-image");

                const image = document.createElement("img");

                if (data.thumbnail?.source) {

                    image.src = data.thumbnail.source;
                    image.alt = `Pemandangan ${data.title}`;
                    image.loading = "lazy";

                    image.onerror = () => {
                        imageWrapper.textContent =
                            "Gambar tidak tersedia";
                    };

                    imageWrapper.appendChild(image);

                } else {

                    imageWrapper.textContent =
                        "Gambar tidak tersedia";

                }

               
                const info = document.createElement("div");
                info.classList.add("small-city-info");

               
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
                    source.textContent = "Baca selengkapnya →";

                }

               
                info.append(title, description);

                if (pageUrl) {
                    info.appendChild(source);
                }

              
                card.append(imageWrapper, info);

             
                otherCitiesContainer.appendChild(card);

            } else {

                console.error("Ada kota yang gagal dimuat:", result.reason);

            }

        });

       
        if (otherCitiesContainer.children.length === 0) {

            otherCitiesContainer.textContent =
                "Maaf, data kota belum berhasil dimuat.";

        }

    } catch (error) {

        console.error("Error:", error);

        otherCitiesContainer.textContent =
            "Gagal mengambil data kota.";

    }

}



getOtherCities()
