export function SiteHeader() {
  return (
    <header className="top">
      <div className="wrap bar">
        <a className="brand" href="#top" aria-label="RightWISE, về đầu trang">
          <svg className="mark" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="18" cy="18" r="13" />
            <path d="m12 18.5 4.4 4.5L24.5 13" />
            <path d="m28 28 9 9" />
          </svg>
          <span className="word">Right<b>WISE</b></span>
        </a>
        <nav className="nav" aria-label="Điều hướng chính">
          <a href="#kiem-tra-anh">Kiểm tra ảnh</a>
          <a href="#van-de">Vấn đề</a>
          <a href="#tru-cot">Trụ cột</a>
          <a href="#quy-trinh">WISE</a>
          <a href="#thu-thach">Phòng kiểm chứng</a>
          <a href="#lop-hoc">Lớp học</a>
        </nav>
        <a className="btn btn-primary btn-sm" href="#kiem-tra-anh">Chụp ảnh</a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <h2>Trust Facts,<br /><em>Choose Wisely.</em></h2>
        <div className="vals">
          <span>Critical Thinking</span><span>Digital Literacy</span><span>Informed Choice</span>
        </div>
        <small>
          RightWISE · Think Critically. Verify Confidently. Các tình huống trong trang là mô phỏng phục vụ giáo dục. Tên sản phẩm, tên trang và địa danh đều là hư cấu, không nhắc đến cá nhân hay tổ chức có thật. Mô hình lan truyền tin chỉ mang tính minh họa.
        </small>
      </div>
    </footer>
  );
}
