import PageShell from '@/components/layout/PageShell';

export default function Privacy() {
  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-4xl w-full mx-auto px-4 sm:px-8">
      <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-black text-on-surface mb-4">Chính sách bảo mật</h1>
        <p className="text-on-surface-variant mb-10">Cập nhật lần cuối: 15 tháng 4, 2024</p>

        <div className="prose prose-slate max-w-none text-on-surface-variant space-y-8">
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">1. Mục đích thu thập thông tin cá nhân</h2>
            <p className="leading-relaxed">Moi Thue thu thập thông tin cá nhân của người dùng nhằm mục đích:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Cung cấp các dịch vụ tìm kiếm và đăng tin bất động sản.</li>
              <li>Xác thực danh tính người dùng để đảm bảo môi trường giao dịch an toàn.</li>
              <li>Liên hệ hỗ trợ, giải đáp thắc mắc và xử lý khiếu nại.</li>
              <li>Cải thiện trải nghiệm người dùng và nâng cấp hệ thống.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">2. Phạm vi thu thập thông tin</h2>
            <p className="leading-relaxed">Các thông tin chúng tôi thu thập bao gồm nhưng không giới hạn:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Họ và tên, địa chỉ email, số điện thoại khi đăng ký tài khoản.</li>
              <li>Thông tin về bất động sản khi người dùng đăng tin (địa chỉ, hình ảnh, giá cả).</li>
              <li>Dữ liệu hành vi sử dụng website (cookies, địa chỉ IP, loại trình duyệt) để phân tích và tối ưu hóa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">3. Thời gian lưu trữ thông tin</h2>
            <p className="leading-relaxed">
              Dữ liệu cá nhân của người dùng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ từ phía người dùng hoặc
              khi tài khoản không hoạt động trong một khoảng thời gian dài theo quy định của Moi Thue. Trong mọi
              trường hợp, thông tin cá nhân sẽ được bảo mật trên máy chủ của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">4. Chia sẻ thông tin</h2>
            <p className="leading-relaxed">
              Chúng tôi cam kết không bán, trao đổi hay chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào
              vì mục đích thương mại. Thông tin chỉ được chia sẻ trong các trường hợp:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Có sự đồng ý rõ ràng từ phía người dùng.</li>
              <li>Theo yêu cầu của cơ quan pháp luật có thẩm quyền.</li>
              <li>
                Chia sẻ với các đối tác cung cấp dịch vụ (như dịch vụ gửi email, SMS) với điều kiện họ phải tuân thủ
                nghiêm ngặt chính sách bảo mật này.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">5. Quyền lợi của người dùng</h2>
            <p className="leading-relaxed">
              Người dùng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách
              đăng nhập vào tài khoản và chỉnh sửa thông tin cá nhân hoặc yêu cầu Moi Thue thực hiện việc này.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">6. Thông tin liên hệ</h2>
            <p className="leading-relaxed">
              Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi
              qua:
            </p>
            <ul className="list-none mt-2 space-y-2 font-medium text-on-surface">
              <li>Email: privacy@moithue.com</li>
              <li>Hotline: 1900 1234</li>
              <li>Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</li>
            </ul>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
