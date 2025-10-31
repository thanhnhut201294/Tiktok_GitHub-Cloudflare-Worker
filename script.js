// KHÔNG CHỈNH SỬA DÒNG NÀY. Đảm bảo nó được bao quanh bởi dấu nháy đơn ('')
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
        // Trực tiếp gọi fetch với URL đã khai báo.
        const response = await fetch(WORKER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unique_id: username,
                count: 50 // Giữ nguyên payload
            })
        });

        // Kiểm tra lỗi HTTP (ví dụ: 404, 500)
        if (!response.ok) {
            const errorText = await response.text();
            resultsDiv.textContent = `Lỗi HTTP ${response.status}: ${response.statusText}. Worker có thể bị lỗi cú pháp hoặc đã hết hạn. Phản hồi: ${errorText}`;
            return;
        }

        const data = await response.json();

        // Kiểm tra lỗi từ Worker (nếu có)
        if (data.error) {
            resultsDiv.textContent = `Lỗi từ Worker: ${data.error}`;
        } else {
            let output = `✅ Đã nhận ${data.videos.length} video:\n`;
            data.videos.forEach(v => {
                output += `\n[${v.play_count || 0} Views] ${v.title || '(Không có Caption)'}`;
            });
            resultsDiv.textContent = output;
        }

    } catch (e) {
        // Nếu lỗi 'Failed to parse URL' vẫn xảy ra, nó là lỗi cú pháp thuần túy.
        resultsDiv.textContent = `Lỗi kết nối hoặc xử lý (Client-side): ${e.message}`;
    }
}
