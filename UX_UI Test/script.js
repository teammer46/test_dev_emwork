    const watthai = document.getElementById("watthai");
    const items = watthai.children;
    let autoplay = true;
    let timer;

    // ฟังก์ชันเลื่อนวนลูป
    function nextSlide() {
      watthai.appendChild(items[0]);
    }

    function prevSlide() {
      watthai.insertBefore(items[items.length - 1], items[0]);
    }

    // เริ่ม auto play
    function startAutoplay() {
      timer = setInterval(nextSlide, 2000); // ปรับเวลาได้ตามต้องการ
      autoplay = true;
      document.getElementById("toggle").textContent = "หยุด Auto Play";
    }

    function stopAutoplay() {
      clearInterval(timer);
      autoplay = false;
      document.getElementById("toggle").textContent = "เริ่ม Auto Play";
    }

    // ปุ่มควบคุม
    document.getElementById("next").addEventListener("click", () => {
      nextSlide();
      if (autoplay) stopAutoplay();
    });
    document.getElementById("prev").addEventListener("click", () => {
      prevSlide();
      if (autoplay) stopAutoplay();
    });
    document.getElementById("toggle").addEventListener("click", () => {
      autoplay ? stopAutoplay() : startAutoplay();
    });

    // ปรับจำนวนคอลัมน์
    document.getElementById("cols2").onclick = () => watthai.className = "wat columns-2";
    document.getElementById("cols3").onclick = () => watthai.className = "wat columns-3";
    document.getElementById("cols4").onclick = () => watthai.className = "wat columns-4";

    // เริ่มต้น
    startAutoplay();