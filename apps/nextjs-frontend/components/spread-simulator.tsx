"use client";

import { useMemo, useState } from "react";

const labels = ["Người đăng", "Lượt 1", "Lượt 2", "Lượt 3", "Lượt 4", "Lượt 5"];
const format = (value: number) => (value >= 10 ? String(Math.round(value)) : String(Math.round(value * 10) / 10).replace(".", ","));

export function SpreadSimulatorSection() {
  const [checked, setChecked] = useState(3);
  const { bars, total, onward } = useMemo(() => {
    const onward = 3 * (1 - checked / 10);
    const bars = labels.map((_, index) => index === 0 ? 1 : Math.pow(onward, index));
    return { bars, total: bars.reduce((sum, value) => sum + value, 0), onward };
  }, [checked]);
  return (
    <section className="sec" id="van-de">
      <div className="wrap prob-grid">
        <div className="prob-copy">
          <span className="eyebrow">Vấn đề</span><h2 className="h2">Tin sai đi nhanh hơn hàng thật.</h2>
          <p className="lede">Một bài đăng chỉ mất vài giây để viết, nhưng có thể khiến người mua nghi ngờ cả một loại nông sản. Người làm ra sản phẩm thường biết chuyện sau cùng, khi đơn hàng đã giảm.</p>
          <div className="def"><b>OCOP · Mỗi xã một sản phẩm</b><span>Chương trình phát triển sản phẩm đặc trưng của từng địa phương. Khi một tin sai nhắm vào sản phẩm ấy, người chịu thiệt đầu tiên là nhà vườn, hợp tác xã và cả một vùng quê.</span></div>
          <p>Hãy kéo thanh bên cạnh để xem điều gì thay đổi khi người nhận tin kiểm chứng trước khi bấm chia sẻ.</p>
        </div>
        <div className="sim" id="sim">
          <label htmlFor="verify">Trong 10 người nhận được một tin sai, bao nhiêu người kiểm chứng trước khi chia sẻ?</label>
          <div className="slider"><input type="range" id="verify" min="0" max="10" step="1" value={checked} aria-describedby="simSum" aria-valuetext={`${checked} trên 10 người kiểm chứng`} onChange={(event) => setChecked(Number(event.target.value))} /><output htmlFor="verify">{checked} trên 10 người</output></div>
          <div className="bars" role="img" aria-label="Số người nhận tin theo từng lượt chia sẻ">
            {bars.map((value, index) => { const width = value <= 0.05 ? 0 : Math.max((value / 243) * 100, 1.6); return <div className="bar-row" key={labels[index]}><span className="bl">{labels[index]}</span><span className="bt"><i style={{ width: `${width}%` }} /></span><span className="bv">{format(value)}</span></div>; })}
          </div>
          <p className="sim-sum" id="simSum" aria-live="polite">Sau 5 lượt chia sẻ, tin chạm tới khoảng {format(total)} người{checked > 0 ? " (so với 364 người khi không ai kiểm chứng). " : ". "}{onward < 1 ? "Từ mức này, mỗi lượt có ít người hơn lượt trước và tin tự tắt dần." : "Mỗi lượt vẫn có nhiều người hơn lượt trước, tin còn lan."}</p>
          <p className="note">Mô hình minh họa, không phải số liệu thực tế: mỗi người nhận tin nếu không kiểm chứng sẽ chuyển tiếp cho 3 người khác, qua 5 lượt chia sẻ.</p>
        </div>
      </div>
    </section>
  );
}
