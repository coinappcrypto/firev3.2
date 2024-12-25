window.addEventListener('load', function() {
  const music = document.getElementById('background-music');
  music.play().catch(error => {
    console.log("An error occurred while playing music", error);
  });
});

(function () {
    // JSON URL'si
    const jsonUrl = "https://coinappcrypto.github.io/Apiler/data.json";

    // JSON verisini fetch ile kontrol ediyoruz
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("JSON verisi alınamadı");
            }
            return response.json(); // JSON içeriğini al
        })
        .then(data => {
            // JSON'da 'block' kelimesi var mı kontrol et
            if (data.message === "block") {
                const banMessage = document.getElementById("coinappMessage");
                banMessage.style.display = "flex"; // Görünür hale getir
            }
        })
        .catch(error => {
            console.error("Hata:", error); // Hata varsa konsola yaz
        });
})();