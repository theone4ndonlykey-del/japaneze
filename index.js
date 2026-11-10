async function getKyoto() {
  const response = await fetch(
    "https://en.wikipedia.org/api/rest_v1/page/summary/Kyoto"
  );

  const data = await response.json();

  console.log(data);
}

getKyoto();