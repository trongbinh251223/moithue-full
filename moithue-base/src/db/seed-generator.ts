import { webcrypto } from 'node:crypto';
import { drizzle } from 'drizzle-orm/d1';
import {
  users,
  posts,
  comments,
  sessions,
  passwordResets,
  properties,
  savedProperties,
  contactSubmissions,
} from './schema';
import { ROLE_IDS } from './constants';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { hashPassword } from '../lib/password';

const g = globalThis as typeof globalThis & { crypto?: typeof webcrypto };
if (!g.crypto) {
  Object.assign(g, { crypto: webcrypto });
}

const replaceParams = (sql: string, params: unknown[]): string => {
  return sql.replace(/\?/g, () => {
    const value = params.shift();
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (value === null || value === undefined) return 'null';
    return String(value);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = drizzle({} as any); // chỉ dùng .toSQL(), không kết nối D1

const sqlStatements: string[] = [];

[contactSubmissions, savedProperties, comments, posts, properties, passwordResets, sessions, users].forEach(
  (table) => {
  const { sql } = db.delete(table).toSQL();
  sqlStatements.push(sql);
});

const processInsert = (query: { toSQL: () => { sql: string; params: unknown[] } }) => {
  const { sql, params } = query.toSQL();
  return replaceParams(sql, [...params]);
};

const j = (urls: string[]) => JSON.stringify(urls);

async function main() {
  const adminHash = await hashPassword('Admin1234');
  const userHash = await hashPassword('User1234');
  const now = new Date().toISOString();

  const aliceId = '11111111-1111-4111-8111-111111111111';
  const bobId = '22222222-2222-4222-8222-222222222222';
  const postIds = [
    '33333333-3333-4333-8333-333333333333',
    '44444444-4444-4444-8444-444444444444',
    '55555555-5555-4555-8555-555555555555',
    'bd222222-2222-4222-a222-222222222201',
    'bd222222-2222-4222-a222-222222222202',
    'bd222222-2222-4222-a222-222222222203',
  ];

  sqlStatements.push(
    `DELETE FROM roles WHERE id NOT IN ('${ROLE_IDS.user}','${ROLE_IDS.admin}')`,
  );
  sqlStatements.push(`INSERT OR IGNORE INTO roles (id, slug, name, created_at) VALUES 
    ('${ROLE_IDS.user}', 'user', 'User', '${now}'),
    ('${ROLE_IDS.admin}', 'admin', 'Administrator', '${now}')`);

  const sampleUsers = [
    {
      id: aliceId,
      name: 'Alice Admin',
      email: 'alice.admin@example.com',
      phone: '0901000111',
      passwordHash: adminHash,
      roleId: ROLE_IDS.admin,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: bobId,
      name: 'Bob User',
      email: 'bob.user@example.com',
      phone: '0902000222',
      passwordHash: userHash,
      roleId: ROLE_IDS.user,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const samplePosts = [
    {
      id: postIds[0],
      userId: aliceId,
      title: 'Kinh nghiệm thuê nhà nguyên căn giá rẻ tại Hà Nội',
      content:
        '<p>Việc tìm thuê một căn nhà nguyên căn giá rẻ nhưng vẫn đảm bảo chất lượng sống tại Hà Nội luôn là bài toán khó với nhiều người.</p><h3>1. Xác định rõ nhu cầu và ngân sách</h3><p>Hãy xác định ngân sách và khu vực trước khi đi xem nhà.</p>',
      excerpt: 'Những lưu ý quan trọng khi tìm thuê nhà nguyên căn để tránh bị lừa đảo và tìm được căn nhà ưng ý.',
      coverImage:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
      category: 'Kinh nghiệm thuê',
      slug: 'kinh-nghiem-thue-nha-ha-noi',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: postIds[1],
      userId: bobId,
      title: 'Cách bố trí phòng trọ hợp phong thủy thu hút tài lộc',
      content:
        '<p>Hướng dẫn cách sắp xếp đồ đạc trong phòng trọ nhỏ sao cho hợp phong thủy, mang lại may mắn.</p>',
      excerpt: 'Hướng dẫn cách sắp xếp đồ đạc trong phòng trọ nhỏ sao cho hợp phong thủy, mang lại may mắn.',
      coverImage:
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
      category: 'Phong thủy',
      slug: 'phong-thuy-phong-tro',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: postIds[2],
      userId: aliceId,
      title: 'Hợp đồng thuê nhà: Những điều khoản cần đặc biệt chú ý',
      content:
        '<p>Phân tích chi tiết các điều khoản trong hợp đồng thuê nhà để bảo vệ quyền lợi của người đi thuê.</p>',
      excerpt: 'Phân tích chi tiết các điều khoản trong hợp đồng thuê nhà để bảo vệ quyền lợi của người đi thuê.',
      coverImage:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200',
      category: 'Pháp lý',
      slug: 'hop-dong-thue-nha',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: postIds[3],
      userId: bobId,
      title: 'Thị trường cho thuê căn hộ chung cư tăng nhiệt',
      content: '<p>Cập nhật tình hình thị trường cho thuê căn hộ chung cư tại các thành phố lớn trong quý 2/2024.</p>',
      excerpt: 'Cập nhật tình hình thị trường cho thuê căn hộ chung cư tại các thành phố lớn trong quý 2/2024.',
      coverImage:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      category: 'Tin tức',
      slug: 'thi-truong-can-ho-2024',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: postIds[4],
      userId: aliceId,
      title: 'Mẹo trang trí phòng trọ siêu đẹp với chi phí thấp',
      content: '<p>Gợi ý các món đồ decor giá rẻ giúp biến hóa căn phòng trọ nhàm chán trở nên lung linh.</p>',
      excerpt: 'Gợi ý các món đồ decor giá rẻ giúp biến hóa căn phòng trọ nhàm chán trở nên lung linh.',
      coverImage:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
      category: 'Kinh nghiệm thuê',
      slug: 'meo-trang-tri-phong-tro',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: postIds[5],
      userId: bobId,
      title: 'Quy định mới về đăng ký tạm trú cho người thuê nhà',
      content: '<p>Cập nhật những thay đổi mới nhất về thủ tục đăng ký tạm trú mà người đi thuê cần biết.</p>',
      excerpt: 'Cập nhật những thay đổi mới nhất về thủ tục đăng ký tạm trú mà người đi thuê cần biết.',
      coverImage:
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200',
      category: 'Pháp lý',
      slug: 'dang-ky-tam-tru',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const sampleComments = [
    {
      id: '66666666-6666-4666-8666-666666666666',
      userId: bobId,
      postId: postIds[0],
      content: 'Bài viết rất hữu ích, cảm ơn bạn đã chia sẻ!',
      createdAt: now,
    },
    {
      id: '77777777-7777-4777-8777-777777777777',
      userId: aliceId,
      postId: postIds[0],
      content: 'Mình đang tìm thuê ở Cầu Giấy, có tips gì thêm không?',
      createdAt: now,
    },
  ];

  const sampleProperties = [
    {
      id: 'bd111111-1111-4111-a111-111111111101',
      userId: bobId,
      title: 'Cho thuê BT Vườn Đào 55 triệu, 165m2, 6PN 4WC view đẹp tại Tây Hồ',
      propertyType: 'Nhà biệt thự',
      project: 'Vườn Đào',
      bedrooms: 6,
      bathrooms: 4,
      floors: 3,
      areaValue: 165,
      priceValue: 55,
      depositText: '55 triệu',
      location: 'Phường Phú Thượng (P. Phú Thượng mới)',
      locationExtra: 'Tây Hồ',
      description:
        'Biệt thự view đẹp, đầy đủ tiện nghi. Phù hợp hộ gia đình hoặc kinh doanh. Liên hệ trực tiếp chủ nhà.',
      contactPhone: '0901111222',
      imagesJson: j([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      ]),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'bd111111-1111-4111-a111-111111111102',
      userId: aliceId,
      title: 'Cho thuê căn hộ cao cấp Vinhomes Central Park, 2PN 2WC full nội thất',
      propertyType: 'Căn hộ chung cư',
      project: 'Vinhomes Central Park',
      bedrooms: 2,
      bathrooms: 2,
      floors: 18,
      areaValue: 80,
      priceValue: 25,
      depositText: '50 triệu',
      location: 'Phường 22, Quận Bình Thạnh',
      locationExtra: 'TP.HCM',
      description: 'Căn hộ full nội thất, view sông, an ninh 24/7.',
      contactPhone: '0903333444',
      imagesJson: j([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      ]),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'bd111111-1111-4111-a111-111111111103',
      userId: bobId,
      title: 'Cho thuê nhà nguyên căn mặt tiền đường Nguyễn Đình Chiểu, Quận 3',
      propertyType: 'Nhà mặt phố',
      project: null,
      bedrooms: 4,
      bathrooms: 4,
      floors: 4,
      areaValue: 120,
      priceValue: 40,
      depositText: '80 triệu',
      location: 'Phường 6, Quận 3',
      locationExtra: 'TP.HCM',
      description: 'Nhà mặt tiền kinh doanh tốt, kết cấu vững chắc.',
      contactPhone: '0905555666',
      imagesJson: j([
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      ]),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'bd111111-1111-4111-a111-111111111104',
      userId: aliceId,
      title: 'Phòng trọ khép kín, an ninh tốt gần Đại học Quốc Gia',
      propertyType: 'Phòng trọ',
      project: null,
      bedrooms: 1,
      bathrooms: 1,
      floors: 5,
      areaValue: 25,
      priceValue: 3.5,
      depositText: '3.5 triệu',
      location: 'Phường Dịch Vọng Hậu, Cầu Giấy',
      locationExtra: 'Hà Nội',
      description: 'Phòng trọ mới, khép kín, gần trường.',
      contactPhone: '0907777888',
      imagesJson: j([
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
      ]),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'bd111111-1111-4111-a111-111111111105',
      userId: bobId,
      title: 'Biệt thự mini siêu đẹp khu đô thị Sala, đầy đủ tiện nghi',
      propertyType: 'Nhà biệt thự',
      project: 'KĐT Sala',
      bedrooms: 4,
      bathrooms: 5,
      floors: 3,
      areaValue: 200,
      priceValue: 80,
      depositText: '160 triệu',
      location: 'KĐT Sala, Quận 2',
      locationExtra: 'TP.HCM',
      description: 'Biệt thự mini nội thất cao cấp, hồ bơi riêng.',
      contactPhone: '0909999000',
      imagesJson: j([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      ]),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'bd111111-1111-4111-a111-111111111106',
      userId: aliceId,
      title: 'Căn hộ mini giá rẻ cho sinh viên, người đi làm',
      propertyType: 'Căn hộ mini',
      project: null,
      bedrooms: 1,
      bathrooms: 1,
      floors: 8,
      areaValue: 35,
      priceValue: 6,
      depositText: '6 triệu',
      location: 'Quận Đống Đa, Hà Nội',
      locationExtra: '',
      description: 'Căn hộ mini đủ đồ, gần metro.',
      contactPhone: '0910000111',
      imagesJson: j([
        'https://images.unsplash.com/photo-1502672260266-1c1e525044c7?auto=format&fit=crop&q=80&w=1200',
      ]),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const sampleSaved = [
    { userId: bobId, propertyId: 'bd111111-1111-4111-a111-111111111101' as const, createdAt: now },
    { userId: bobId, propertyId: 'bd111111-1111-4111-a111-111111111102' as const, createdAt: now },
  ];

  sqlStatements.push(processInsert(db.insert(users).values(sampleUsers)));
  sqlStatements.push(processInsert(db.insert(posts).values(samplePosts)));
  sqlStatements.push(processInsert(db.insert(comments).values(sampleComments)));
  sqlStatements.push(processInsert(db.insert(properties).values(sampleProperties)));
  sqlStatements.push(processInsert(db.insert(savedProperties).values(sampleSaved)));

  const seedSQL = sqlStatements.join(';\n') + ';\n';
  const migrationDir = join(__dirname, 'migrations');
  const seedFile = join(migrationDir, 'seed.sql');
  writeFileSync(seedFile, seedSQL);
  console.log('Seed SQL written to', seedFile);
  console.log('Demo: alice.admin@example.com / Admin1234 | bob.user@example.com / User1234');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
