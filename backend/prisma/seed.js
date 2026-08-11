/**
 * Seed dữ liệu mẫu Việt Nam cho Travel Planner.
 * Chạy: npm run seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const slugify = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  const hashedPassword = await bcrypt.hash('123456', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@travelplanner.vn' },
    update: {},
    create: {
      email: 'demo@travelplanner.vn',
      password: hashedPassword,
      fullName: 'Nguyễn Văn An',
      phone: '0901234567',
      bio: 'Yêu thích khám phá những vùng đất mới của Việt Nam.',
      role: 'USER'
    }
  });

  await prisma.user.upsert({
    where: { email: 'admin@travelplanner.vn' },
    update: {},
    create: {
      email: 'admin@travelplanner.vn',
      password: hashedPassword,
      fullName: 'Quản Trị Viên',
      role: 'ADMIN'
    }
  });

  const categoryDefs = [
    { name: 'Cafe', icon: 'Coffee', colorHex: '#A16207' },
    { name: 'Quán ăn', icon: 'Utensils', colorHex: '#EA580C' },
    { name: 'Nhà hàng', icon: 'UtensilsCrossed', colorHex: '#DC2626' },
    { name: 'Địa điểm check-in', icon: 'Camera', colorHex: '#DB2777' },
    { name: 'Khu vui chơi', icon: 'FerrisWheel', colorHex: '#7C3AED' },
    { name: 'Bảo tàng', icon: 'Landmark', colorHex: '#0891B2' },
    { name: 'Công viên', icon: 'Trees', colorHex: '#16A34A' },
    { name: 'Mua sắm', icon: 'ShoppingBag', colorHex: '#2563EB' },
    { name: 'Chợ', icon: 'Store', colorHex: '#CA8A04' },
    { name: 'Địa điểm nổi bật', icon: 'Star', colorHex: '#F59E0B' }
  ];

  const categories = {};
  for (const c of categoryDefs) {
    const cat = await prisma.category.upsert({
      where: { slug: slugify(c.name) },
      update: {},
      create: { name: c.name, slug: slugify(c.name), icon: c.icon, colorHex: c.colorHex }
    });
    categories[c.name] = cat;
  }

  const provinceDefs = [
    { name: 'TP Hồ Chí Minh', region: 'Miền Nam', isFeatured: true },
    { name: 'Hà Nội', region: 'Miền Bắc', isFeatured: true },
    { name: 'Đà Nẵng', region: 'Miền Trung', isFeatured: true },
    { name: 'Đà Lạt', region: 'Miền Nam', isFeatured: true },
    { name: 'Nha Trang', region: 'Miền Nam', isFeatured: true },
    { name: 'Phú Quốc', region: 'Miền Nam', isFeatured: true },
    { name: 'Huế', region: 'Miền Trung', isFeatured: false },
    { name: 'Hội An', region: 'Miền Trung', isFeatured: true }
  ];

  const provinces = {};
  for (const p of provinceDefs) {
    const province = await prisma.province.upsert({
      where: { slug: slugify(p.name) },
      update: {},
      create: { name: p.name, slug: slugify(p.name), region: p.region, isFeatured: p.isFeatured }
    });
    provinces[p.name] = province;
  }

  const hcmDistrictDefs = ['Quận 1', 'Quận 3', 'Quận 5', 'Bình Thạnh', 'Thủ Đức'];
  const hcmDistricts = {};
  for (const d of hcmDistrictDefs) {
    const district = await prisma.district.upsert({
      where: { provinceId_slug: { provinceId: provinces['TP Hồ Chí Minh'].id, slug: slugify(d) } },
      update: {},
      create: { provinceId: provinces['TP Hồ Chí Minh'].id, name: d, slug: slugify(d) }
    });
    hcmDistricts[d] = district;
  }

  const hnDistrictDefs = ['Hoàn Kiếm', 'Ba Đình', 'Tây Hồ'];
  const hnDistricts = {};
  for (const d of hnDistrictDefs) {
    const district = await prisma.district.upsert({
      where: { provinceId_slug: { provinceId: provinces['Hà Nội'].id, slug: slugify(d) } },
      update: {},
      create: { provinceId: provinces['Hà Nội'].id, name: d, slug: slugify(d) }
    });
    hnDistricts[d] = district;
  }


const PLACE_IMAGE_URLS = {
  'Nhà thờ Đức Bà Sài Gòn': 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1200&q=85',
  'Chợ Bến Thành': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',
  'Dinh Độc Lập': 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85',
  'Phố đi bộ Nguyễn Huệ': 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85',
  'Bưu điện Trung tâm Sài Gòn': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
  'The Coffee House Signature - Nguyễn Huệ': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
  'Bánh mì Huỳnh Hoa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
  'Landmark 81 SkyView': 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85',
  'Bảo tàng Chứng tích Chiến tranh': 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=85',
  'Chợ Lớn (Chợ Bình Tây)': 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1200&q=85',
  'Hồ Gươm': 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
  'Phố cổ Hà Nội': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
  'Lăng Chủ tịch Hồ Chí Minh': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85',
  'Cầu Rồng': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
  'Bãi biển Mỹ Khê': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
  'Chợ Đà Lạt': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
  'Quảng trường Lâm Viên': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85',
  'Vinpearl Land Nha Trang': 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85',
  'Phố cổ Hội An': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
  'Bãi Sao': 'https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?auto=format&fit=crop&w=1200&q=85',
  'Đại Nội Huế': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85'
};

  const placeDefs = [
    { name: 'Nhà thờ Đức Bà Sài Gòn', province: 'TP Hồ Chí Minh', district: 'Quận 1', category: 'Địa điểm nổi bật', address: '01 Công xã Paris, Bến Nghé, Quận 1, TP.HCM', lat: 10.7797, lng: 106.699, openHours: '08:00 - 17:00', ticketPrice: 'Miễn phí', description: 'Nhà thờ Chính tòa Đức Bà Sài Gòn là công trình kiến trúc Pháp cổ kính giữa lòng thành phố, biểu tượng lâu đời của Sài Gòn.', ratingAvg: 4.6, ratingCount: 2130, isFeatured: true },
    { name: 'Chợ Bến Thành', province: 'TP Hồ Chí Minh', district: 'Quận 1', category: 'Chợ', address: 'Lê Lợi, Bến Thành, Quận 1, TP.HCM', lat: 10.7724, lng: 106.6982, openHours: '06:00 - 24:00', ticketPrice: 'Miễn phí vào cửa', description: 'Khu chợ truyền thống nổi tiếng nhất Sài Gòn, nơi mua sắm đặc sản, quà lưu niệm và thưởng thức ẩm thực đường phố.', ratingAvg: 4.3, ratingCount: 5210, isFeatured: true },
    { name: 'Dinh Độc Lập', province: 'TP Hồ Chí Minh', district: 'Quận 1', category: 'Bảo tàng', address: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, TP.HCM', lat: 10.7772, lng: 106.6953, openHours: '08:00 - 16:30', ticketPrice: '40.000đ', description: 'Di tích lịch sử quan trọng, từng là nơi làm việc của chính quyền Việt Nam Cộng hòa, nay là bảo tàng mở cửa tham quan.', ratingAvg: 4.5, ratingCount: 3450, isFeatured: true },
    { name: 'Phố đi bộ Nguyễn Huệ', province: 'TP Hồ Chí Minh', district: 'Quận 1', category: 'Địa điểm check-in', address: 'Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM', lat: 10.7745, lng: 106.7036, openHours: 'Cả ngày', ticketPrice: 'Miễn phí', description: 'Con phố đi bộ sầm uất bậc nhất Sài Gòn, lý tưởng để dạo chơi, chụp ảnh và ngắm thành phố về đêm.', ratingAvg: 4.7, ratingCount: 6023, isFeatured: true },
    { name: 'Bưu điện Trung tâm Sài Gòn', province: 'TP Hồ Chí Minh', district: 'Quận 1', category: 'Địa điểm nổi bật', address: '02 Công xã Paris, Bến Nghé, Quận 1, TP.HCM', lat: 10.7799, lng: 106.6997, openHours: '07:00 - 19:00', ticketPrice: 'Miễn phí', description: 'Công trình kiến trúc Pháp cổ điển với mái vòm ấn tượng, một trong những biểu tượng của Sài Gòn.', ratingAvg: 4.6, ratingCount: 1890, isFeatured: false },
    { name: 'The Coffee House Signature - Nguyễn Huệ', province: 'TP Hồ Chí Minh', district: 'Quận 1', category: 'Cafe', address: '86-88 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM', lat: 10.7736, lng: 106.7038, openHours: '07:00 - 23:00', ticketPrice: 'Từ 45.000đ', description: 'Quán cà phê view đẹp nhìn ra phố đi bộ Nguyễn Huệ, không gian thoáng đãng phù hợp làm việc và trò chuyện.', ratingAvg: 4.4, ratingCount: 980, isFeatured: false },
    { name: 'Bánh mì Huỳnh Hoa', province: 'TP Hồ Chí Minh', district: 'Quận 1', category: 'Quán ăn', address: '26 Lê Thị Riêng, Bến Thành, Quận 1, TP.HCM', lat: 10.7692, lng: 106.6935, openHours: '06:00 - 21:00', ticketPrice: '55.000đ - 65.000đ', description: 'Tiệm bánh mì trứ danh Sài Gòn với phần nhân đầy đặn, luôn đông khách xếp hàng.', ratingAvg: 4.5, ratingCount: 4102, isFeatured: false },
    { name: 'Landmark 81 SkyView', province: 'TP Hồ Chí Minh', district: 'Bình Thạnh', category: 'Địa điểm check-in', address: '720A Điện Biên Phủ, Vinhomes Central Park, Bình Thạnh, TP.HCM', lat: 10.7949, lng: 106.7218, openHours: '09:00 - 22:00', ticketPrice: '380.000đ', description: 'Đài quan sát cao nhất Việt Nam trên tòa nhà Landmark 81, ngắm toàn cảnh thành phố từ độ cao 461m.', ratingAvg: 4.6, ratingCount: 2760, isFeatured: true },
    { name: 'Bảo tàng Chứng tích Chiến tranh', province: 'TP Hồ Chí Minh', district: 'Quận 3', category: 'Bảo tàng', address: '28 Võ Văn Tần, Võ Thị Sáu, Quận 3, TP.HCM', lat: 10.7797, lng: 106.6919, openHours: '07:30 - 17:00', ticketPrice: '40.000đ', description: 'Bảo tàng lưu giữ nhiều hiện vật, hình ảnh về chiến tranh Việt Nam, thu hút đông đảo du khách trong và ngoài nước.', ratingAvg: 4.5, ratingCount: 3890, isFeatured: false },
    { name: 'Chợ Lớn (Chợ Bình Tây)', province: 'TP Hồ Chí Minh', district: 'Quận 5', category: 'Chợ', address: '57A Tháp Mười, Phường 2, Quận 5, TP.HCM', lat: 10.7501, lng: 106.6529, openHours: '05:00 - 19:00', ticketPrice: 'Miễn phí', description: 'Khu chợ sỉ lớn mang đậm dấu ấn kiến trúc Hoa, nơi buôn bán sầm uất của cộng đồng người Hoa tại Sài Gòn.', ratingAvg: 4.2, ratingCount: 1245, isFeatured: false },
    { name: 'Hồ Gươm', province: 'Hà Nội', district: 'Hoàn Kiếm', category: 'Địa điểm nổi bật', address: 'Hàng Trống, Hoàn Kiếm, Hà Nội', lat: 21.0285, lng: 105.8524, openHours: 'Cả ngày', ticketPrice: 'Miễn phí', description: 'Trái tim của Hà Nội với Tháp Rùa cổ kính giữa lòng hồ, biểu tượng ngàn năm văn hiến.', ratingAvg: 4.8, ratingCount: 7650, isFeatured: true },
    { name: 'Phố cổ Hà Nội', province: 'Hà Nội', district: 'Hoàn Kiếm', category: 'Địa điểm check-in', address: 'Khu phố cổ, Hoàn Kiếm, Hà Nội', lat: 21.0338, lng: 105.8497, openHours: 'Cả ngày', ticketPrice: 'Miễn phí', description: '36 phố phường với kiến trúc cổ xưa, ẩm thực đường phố phong phú, nơi lưu giữ hồn cốt Hà Nội xưa.', ratingAvg: 4.7, ratingCount: 5430, isFeatured: true },
    { name: 'Lăng Chủ tịch Hồ Chí Minh', province: 'Hà Nội', district: 'Ba Đình', category: 'Bảo tàng', address: '2 Hùng Vương, Điện Bàn, Ba Đình, Hà Nội', lat: 21.0369, lng: 105.8348, openHours: '07:30 - 10:30 (trừ Thứ 2 & Thứ 6)', ticketPrice: 'Miễn phí', description: 'Nơi an nghỉ của Chủ tịch Hồ Chí Minh, di tích lịch sử đặc biệt quan trọng của Việt Nam.', ratingAvg: 4.7, ratingCount: 4210, isFeatured: false },
    { name: 'Cầu Rồng', province: 'Đà Nẵng', district: null, category: 'Địa điểm nổi bật', address: 'Đường Nguyễn Văn Linh, Đà Nẵng', lat: 16.0611, lng: 108.2272, openHours: 'Cả ngày (phun lửa tối Thứ 7, CN)', ticketPrice: 'Miễn phí', description: 'Cây cầu hình rồng độc đáo bắc qua sông Hàn, nổi tiếng với màn phun lửa, phun nước vào cuối tuần.', ratingAvg: 4.7, ratingCount: 6890, isFeatured: true },
    { name: 'Bãi biển Mỹ Khê', province: 'Đà Nẵng', district: null, category: 'Địa điểm nổi bật', address: 'Võ Nguyên Giáp, Đà Nẵng', lat: 16.0544, lng: 108.2493, openHours: 'Cả ngày', ticketPrice: 'Miễn phí', description: 'Một trong những bãi biển đẹp nhất hành tinh theo bình chọn của Forbes, cát trắng mịn và nước biển trong xanh.', ratingAvg: 4.8, ratingCount: 8120, isFeatured: true },
    { name: 'Chợ Đà Lạt', province: 'Đà Lạt', district: null, category: 'Chợ', address: 'Nguyễn Thị Minh Khai, Phường 1, Đà Lạt', lat: 11.9418, lng: 108.4383, openHours: '06:00 - 22:00', ticketPrice: 'Miễn phí', description: 'Khu chợ đêm nổi tiếng với đặc sản, hoa quả và món ăn vặt xứ lạnh, điểm dừng chân quen thuộc của du khách.', ratingAvg: 4.4, ratingCount: 3320, isFeatured: true },
    { name: 'Quảng trường Lâm Viên', province: 'Đà Lạt', district: null, category: 'Địa điểm check-in', address: 'Trần Quốc Toản, Phường 1, Đà Lạt', lat: 11.9433, lng: 108.4421, openHours: 'Cả ngày', ticketPrice: 'Miễn phí', description: 'Quảng trường trung tâm với kiến trúc lấy cảm hứng từ hoa atiso, nơi check-in yêu thích của giới trẻ.', ratingAvg: 4.5, ratingCount: 1980, isFeatured: false },
    { name: 'Vinpearl Land Nha Trang', province: 'Nha Trang', district: null, category: 'Khu vui chơi', address: 'Đảo Hòn Tre, Nha Trang', lat: 12.2185, lng: 109.2196, openHours: '08:00 - 21:30', ticketPrice: '880.000đ', description: 'Khu vui chơi giải trí và công viên nước hàng đầu Việt Nam, kết hợp cáp treo vượt biển dài nhất thế giới.', ratingAvg: 4.6, ratingCount: 5540, isFeatured: true },
    { name: 'Phố cổ Hội An', province: 'Hội An', district: null, category: 'Địa điểm nổi bật', address: 'Phường Minh An, Hội An, Quảng Nam', lat: 15.8801, lng: 108.338, openHours: 'Cả ngày', ticketPrice: '120.000đ', description: 'Di sản văn hóa thế giới UNESCO với những dãy nhà cổ vàng rực, đèn lồng rực rỡ mỗi tối.', ratingAvg: 4.9, ratingCount: 9210, isFeatured: true },
    { name: 'Bãi Sao', province: 'Phú Quốc', district: null, category: 'Địa điểm nổi bật', address: 'An Thới, Phú Quốc, Kiên Giang', lat: 10.0273, lng: 104.0034, openHours: 'Cả ngày', ticketPrice: 'Miễn phí', description: 'Bãi biển cát trắng mịn như bột, nước biển trong xanh, một trong những bãi biển đẹp nhất Phú Quốc.', ratingAvg: 4.8, ratingCount: 4670, isFeatured: true },
    { name: 'Đại Nội Huế', province: 'Huế', district: null, category: 'Bảo tàng', address: 'Phường Thuận Hòa, Huế', lat: 16.4698, lng: 107.5796, openHours: '07:00 - 17:30', ticketPrice: '200.000đ', description: 'Quần thể di tích Cố đô Huế, di sản văn hóa thế giới UNESCO với kiến trúc cung đình triều Nguyễn.', ratingAvg: 4.7, ratingCount: 3980, isFeatured: true }
  ];

  const createdPlaces = {};
  for (const p of placeDefs) {
    const place = await prisma.place.upsert({
      where: { provinceId_slug: { provinceId: provinces[p.province].id, slug: slugify(p.name) } },
      update: {
        coverImageUrl: PLACE_IMAGE_URLS[p.name] ?? null
      },
      create: {
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        address: p.address,
        provinceId: provinces[p.province].id,
        districtId: p.district ? (hcmDistricts[p.district]?.id ?? hnDistricts[p.district]?.id ?? null) : null,
        categoryId: categories[p.category].id,
        latitude: p.lat,
        longitude: p.lng,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`,
        openHours: p.openHours,
        ticketPrice: p.ticketPrice,
        ratingAvg: p.ratingAvg,
        ratingCount: p.ratingCount,
        isFeatured: p.isFeatured,
        coverImageUrl: PLACE_IMAGE_URLS[p.name] ?? null
      }
    });
    createdPlaces[p.name] = place;

    if (PLACE_IMAGE_URLS[p.name]) {
      const existingImage = await prisma.placeImage.findFirst({
        where: { placeId: place.id, url: PLACE_IMAGE_URLS[p.name] }
      });
      if (!existingImage) {
        await prisma.placeImage.create({
          data: { placeId: place.id, url: PLACE_IMAGE_URLS[p.name], sortOrder: 0 }
        });
      }
    }
  }

  const trip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Sài Gòn 3 ngày 2 đêm',
      description: 'Chuyến khám phá Sài Gòn cùng gia đình, tập trung các điểm nổi bật Quận 1.',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-12'),
      companions: JSON.stringify(['Nguyễn Thị Bình', 'Nguyễn Văn Cường']),
      budget: 5000000,
      transportation: 'Máy bay',
      status: 'PREPARING',
      coverImageUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85',
      days: {
        create: [
          { dayNumber: 1, date: new Date('2026-08-10') },
          { dayNumber: 2, date: new Date('2026-08-11') },
          { dayNumber: 3, date: new Date('2026-08-12') }
        ]
      }
    },
    include: { days: true }
  });

  const day1 = trip.days.find((d) => d.dayNumber === 1);

  await prisma.tripSchedule.createMany({
    data: [
      { tripDayId: day1.id, title: 'Ăn sáng', startTime: '08:00', sortOrder: 1 },
      { tripDayId: day1.id, placeId: createdPlaces['Nhà thờ Đức Bà Sài Gòn'].id, title: 'Tham quan Nhà thờ Đức Bà', startTime: '09:00', travelTimeMinutes: 15, sortOrder: 2 },
      { tripDayId: day1.id, placeId: createdPlaces['Chợ Bến Thành'].id, title: 'Mua sắm tại Chợ Bến Thành', startTime: '11:00', travelTimeMinutes: 10, sortOrder: 3 },
      { tripDayId: day1.id, placeId: createdPlaces['Dinh Độc Lập'].id, title: 'Tham quan Dinh Độc Lập', startTime: '14:00', travelTimeMinutes: 12, sortOrder: 4 },
      { tripDayId: day1.id, placeId: createdPlaces['Phố đi bộ Nguyễn Huệ'].id, title: 'Dạo phố đi bộ Nguyễn Huệ', startTime: '18:00', travelTimeMinutes: 20, sortOrder: 5 }
    ]
  });

  await prisma.journal.create({
    data: {
      tripId: trip.id,
      tripDayId: day1.id,
      userId: demoUser.id,
      date: new Date('2026-08-10'),
      content: 'Ngày đầu tiên ở Sài Gòn thật tuyệt vời! Thời tiết nắng đẹp, mọi người đều rất vui.',
      mood: 'Hạnh phúc',
      weather: 'SUNNY',
      rating: 5,
      places: { create: [{ placeId: createdPlaces['Nhà thờ Đức Bà Sài Gòn'].id }] }
    }
  });

  await prisma.expense.createMany({
    data: [
      { tripId: trip.id, userId: demoUser.id, category: 'FOOD', amount: 350000, description: 'Ăn sáng và trưa', date: new Date('2026-08-10') },
      { tripId: trip.id, userId: demoUser.id, category: 'TICKET', amount: 40000, description: 'Vé Dinh Độc Lập', date: new Date('2026-08-10') },
      { tripId: trip.id, userId: demoUser.id, category: 'TRANSPORT', amount: 200000, description: 'Grab di chuyển trong ngày', date: new Date('2026-08-10') },
      { tripId: trip.id, userId: demoUser.id, category: 'HOTEL', amount: 1200000, description: 'Khách sạn 2 đêm', date: new Date('2026-08-10') }
    ]
  });

  await prisma.favorite.createMany({
    data: [
      { userId: demoUser.id, placeId: createdPlaces['Cầu Rồng'].id, status: 'WANT_TO_GO' },
      { userId: demoUser.id, placeId: createdPlaces['Phố cổ Hội An'].id, status: 'WANT_TO_GO' },
      { userId: demoUser.id, placeId: createdPlaces['Nhà thờ Đức Bà Sài Gòn'].id, status: 'VISITED' }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seed dữ liệu hoàn tất!');
  console.log(`   - ${Object.keys(provinces).length} tỉnh/thành, ${placeDefs.length} địa điểm`);
  console.log('   - Tài khoản demo: demo@travelplanner.vn / 123456');
  console.log('   - Tài khoản admin: admin@travelplanner.vn / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
