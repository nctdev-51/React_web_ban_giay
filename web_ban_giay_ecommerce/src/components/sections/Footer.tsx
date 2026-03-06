export type FooterProps = {
  groupName?: string;
  mssv?: string;
  className?: string;
};

export function Footer({
  groupName = "Tên nhóm: Nhóm 12",
  mssv = "MSSV: 20xxxxxxxx",
  className = "",
}: FooterProps) {
  return (
    <footer className={`border-t bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Column 1 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Thông tin nhóm</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>{groupName}</li>
              <li>{mssv}</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Trường</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Đại học Công nghiệp TP. Hồ Chí Minh</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Địa chỉ</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Nguyễn Văn Bảo, P4</li>
              <li>Gò Vấp</li>
              <li>Thành phố Hồ Chí Minh</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="md:text-right">
            <h3 className="text-sm font-semibold text-slate-900">Khu vực</h3>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm text-slate-700">
              <span aria-hidden>🌐</span>
              <span>Vietnam</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-4 text-xs text-slate-500 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {groupName}</span>
          <span>{mssv}</span>
        </div>
      </div>
    </footer>
  );
}