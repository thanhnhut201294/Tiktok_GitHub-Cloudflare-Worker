// Thay thế bằng URL của Cloudflare Worker sau khi triển khai
const WORKER_API_URL = 'https://tikwmcom.thanhnhut201294.workers.dev/posts'; 

async function fetchTikTokData() {
    const username = document.getElementById('username').value.trim();
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = 'Đang tải dữ liệu từ Cloudflare Worker...';

    if (!username) {
        resultsDiv.textContent = 'Vui lòng nhập Username!';
        return;
    }

    try {
        const response = await fetch(WORKER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Gửi dữ liệu cần thiết cho Worker
            body: JSON.stringify({
                unique_id: username,
                count: 50 // Ví dụ: lấy 50 video
            })
        });

        const data = await response.json();

        if (data.error) {
            resultsDiv.textContent = `Lỗi từ Worker: ${data.error}`;
        } else {
            // Hiển thị kết quả trong giao diện
            let output = 'Caption và Views:\n';
            data.videos.forEach(v => {
                output += `\n[${v.play_count || 0} Views] ${v.title || v.desc || '(Không có Caption)'}`;
            });
            resultsDiv.textContent = output;
        }

    } catch (e) {
        resultsDiv.textContent = `Lỗi kết nối hoặc xử lý: ${e.message}`;
    }
}
