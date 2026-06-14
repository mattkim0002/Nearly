-- ============================================
-- Nearly: Seed Data
-- ============================================

-- ==================
-- Categories
-- ==================
insert into public.categories (id, name, slug, description, icon) values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Photography', 'photography', 'Professional photography services for portraits, events, products, and more.', 'camera'),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Woodworking', 'woodworking', 'Handcrafted furniture, custom pieces, and artisan woodwork.', 'hammer'),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Ceramics', 'ceramics', 'Handmade pottery, sculptural ceramics, and custom dishware.', 'cup-soda'),
  ('a1b2c3d4-0001-4000-8000-000000000004', 'Illustration', 'illustration', 'Custom illustrations, brand art, murals, and digital design.', 'pen-tool'),
  ('a1b2c3d4-0001-4000-8000-000000000005', 'Interior Design', 'interior-design', 'Space planning, styling, and full-room design services.', 'lamp');

-- ==================
-- Profiles (Pros)
-- ==================
insert into public.profiles (id, email, full_name, avatar_url, bio, location, is_pro) values
  ('b2c3d4e5-0001-4000-8000-000000000001', 'elena.marchetti@example.com', 'Elena Marchetti',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
   'Documentary and portrait photographer with 8 years of experience. I love capturing authentic moments and telling visual stories.',
   'Portland, OR', true),

  ('b2c3d4e5-0001-4000-8000-000000000002', 'james.okonkwo@example.com', 'James Okonkwo',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
   'Furniture maker and woodworker specializing in mid-century modern designs. Every piece is handmade in my Portland workshop.',
   'Portland, OR', true),

  ('b2c3d4e5-0001-4000-8000-000000000003', 'sophia.chen@example.com', 'Sophia Chen',
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
   'Ceramic artist creating functional and sculptural pieces inspired by nature. My work blends Japanese and Scandinavian aesthetics.',
   'Seattle, WA', true),

  ('b2c3d4e5-0001-4000-8000-000000000004', 'marcus.bell@example.com', 'Marcus Bell',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
   'Freelance illustrator and muralist. I work with brands, publishers, and homeowners to create bold, colorful art.',
   'Austin, TX', true),

  ('b2c3d4e5-0001-4000-8000-000000000005', 'nina.alvarez@example.com', 'Nina Alvarez',
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
   'Interior designer focused on sustainable, lived-in spaces. I help clients create homes that feel both intentional and relaxed.',
   'Denver, CO', true),

  ('b2c3d4e5-0001-4000-8000-000000000006', 'ryan.park@example.com', 'Ryan Park',
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
   'Product and food photographer based in LA. Clean compositions, natural light, editorial feel.',
   'Los Angeles, CA', true),

  ('b2c3d4e5-0001-4000-8000-000000000007', 'amara.johnson@example.com', 'Amara Johnson',
   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
   'Woodworker and maker. I build custom cutting boards, shelving, and small furniture with reclaimed wood.',
   'Nashville, TN', true),

  ('b2c3d4e5-0001-4000-8000-000000000008', 'liam.fitzgerald@example.com', 'Liam Fitzgerald',
   'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
   'Ceramic artist and teacher. I make wheel-thrown mugs, bowls, and vases, all fired in my backyard wood kiln.',
   'Asheville, NC', true),

  ('b2c3d4e5-0001-4000-8000-000000000009', 'zoe.nguyen@example.com', 'Zoe Nguyen',
   'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
   'Digital illustrator specializing in children''s books and editorial work. Whimsical, warm, detail-rich.',
   'San Francisco, CA', true),

  ('b2c3d4e5-0001-4000-8000-000000000010', 'daniel.reeves@example.com', 'Daniel Reeves',
   'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200',
   'Interior designer with 12 years of experience in residential and hospitality projects. Modern with warmth.',
   'Chicago, IL', true);

-- ==================
-- Services
-- ==================

-- Photography (Elena Marchetti & Ryan Park)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000001',
   'Portrait Photography Session',
   'A 90-minute portrait session at an outdoor location of your choice. Includes 20 edited digital images and a private online gallery. Perfect for individuals, couples, or small families.',
   'a1b2c3d4-0001-4000-8000-000000000001', 250, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000001',
   'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800',
   array['https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000002',
   'Event Photography',
   'Full-day event coverage for weddings, parties, and corporate gatherings. Two photographers, same-day preview images, and a full edited gallery within two weeks.',
   'a1b2c3d4-0001-4000-8000-000000000001', 1200, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000001',
   'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
   array['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000003',
   'Product Photography',
   'Studio product photography for e-commerce and marketing. Clean white-background shots or styled lifestyle setups. Priced per product.',
   'a1b2c3d4-0001-4000-8000-000000000001', 75, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000006',
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
   array['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000004',
   'Food & Restaurant Photography',
   'On-location food and interior photography for restaurants and cafes. Menu shots, ambiance photos, and social media content. Half-day or full-day packages.',
   'a1b2c3d4-0001-4000-8000-000000000001', 500, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000006',
   'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800',
   array['https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800']);

-- Woodworking (James Okonkwo & Amara Johnson)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000005',
   'Custom Dining Table',
   'Handcrafted hardwood dining table built to your specifications. Choose wood species, dimensions, and finish. Seats 4–8. Includes delivery and setup within the metro area.',
   'a1b2c3d4-0001-4000-8000-000000000002', 2800, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000002',
   'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800',
   array['https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000006',
   'Mid-Century Modern Bookshelf',
   'A walnut and brass bookshelf inspired by 1960s Scandinavian design. Three standard sizes available or fully custom dimensions.',
   'a1b2c3d4-0001-4000-8000-000000000002', 1400, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000002',
   'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800',
   array['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000007',
   'Custom Cutting Board Collection',
   'End-grain cutting boards made from sustainably sourced hardwoods. Available in three sizes or as a set. Beautiful enough to display, tough enough for daily use.',
   'a1b2c3d4-0001-4000-8000-000000000002', 85, 'starting_from', 'Nashville, TN',
   'b2c3d4e5-0001-4000-8000-000000000007',
   'https://images.unsplash.com/photo-1583063855677-13ba58984537?w=800',
   array['https://images.unsplash.com/photo-1583063855677-13ba58984537?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000008',
   'Reclaimed Wood Floating Shelves',
   'Wall-mounted floating shelves built from reclaimed barn wood. Each piece has unique character and grain. Sold individually or as a set of three.',
   'a1b2c3d4-0001-4000-8000-000000000002', 120, 'starting_from', 'Nashville, TN',
   'b2c3d4e5-0001-4000-8000-000000000007',
   'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800',
   array['https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800']);

-- Ceramics (Sophia Chen & Liam Fitzgerald)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000009',
   'Custom Dinnerware Set',
   'A hand-thrown stoneware dinnerware set for 4. Includes dinner plates, salad plates, bowls, and mugs. Choose from six glaze palettes inspired by the Pacific Northwest.',
   'a1b2c3d4-0001-4000-8000-000000000003', 320, 'starting_from', 'Seattle, WA',
   'b2c3d4e5-0001-4000-8000-000000000003',
   'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
   array['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000010',
   'Sculptural Vase Collection',
   'Organic, asymmetrical vases in matte finishes. Each piece is one-of-a-kind. Available in small, medium, and large sizes.',
   'a1b2c3d4-0001-4000-8000-000000000003', 95, 'starting_from', 'Seattle, WA',
   'b2c3d4e5-0001-4000-8000-000000000003',
   'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
   array['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000011',
   'Handmade Mug Set',
   'Set of four wheel-thrown mugs fired in a wood kiln for unique ash glazing. Each mug holds 12oz and is microwave and dishwasher safe.',
   'a1b2c3d4-0001-4000-8000-000000000003', 110, 'starting_from', 'Asheville, NC',
   'b2c3d4e5-0001-4000-8000-000000000008',
   'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
   array['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000012',
   'Custom Ceramic Planters',
   'Hand-built planters in geometric and organic shapes. Drainage holes included. Perfect for indoor plants. Commission a set to match your space.',
   'a1b2c3d4-0001-4000-8000-000000000003', 65, 'starting_from', 'Asheville, NC',
   'b2c3d4e5-0001-4000-8000-000000000008',
   'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
   array['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800']);

-- Illustration (Marcus Bell & Zoe Nguyen)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000013',
   'Custom Mural Painting',
   'Large-scale interior or exterior mural designed and painted on-site. Includes concept sketches, color palette development, and up to 3 revisions before painting begins.',
   'a1b2c3d4-0001-4000-8000-000000000004', 2000, 'quote', 'Austin, TX',
   'b2c3d4e5-0001-4000-8000-000000000004',
   'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
   array['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000014',
   'Brand Illustration Package',
   'A set of 10 custom illustrations for your brand — website headers, social posts, and marketing materials. Bold, colorful style with two rounds of revisions.',
   'a1b2c3d4-0001-4000-8000-000000000004', 1500, 'starting_from', 'Austin, TX',
   'b2c3d4e5-0001-4000-8000-000000000004',
   'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
   array['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000015',
   'Children''s Book Illustration',
   'Full illustration package for a children''s picture book (up to 32 pages). Includes character design, sketches, and final color artwork. Digital delivery.',
   'a1b2c3d4-0001-4000-8000-000000000004', 3500, 'quote', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000009',
   'https://images.unsplash.com/photo-1515041219749-89347f83291a?w=800',
   array['https://images.unsplash.com/photo-1515041219749-89347f83291a?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000016',
   'Editorial Illustration',
   'Custom illustrations for magazines, blogs, and online publications. Whimsical, detail-rich style. Delivered as high-res digital files.',
   'a1b2c3d4-0001-4000-8000-000000000004', 400, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000009',
   'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
   array['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800']);

-- Interior Design (Nina Alvarez & Daniel Reeves)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000017',
   'Full Room Design',
   'Complete design for one room — from floor plan and furniture selection to textiles and styling. Includes a mood board, shopping list, and installation guide. Virtual or in-person.',
   'a1b2c3d4-0001-4000-8000-000000000005', 1800, 'starting_from', 'Denver, CO',
   'b2c3d4e5-0001-4000-8000-000000000005',
   'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
   array['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000018',
   'Design Consultation',
   'A 2-hour in-home or virtual consultation. Walk through your space, discuss goals, and receive a written action plan with specific product recommendations.',
   'a1b2c3d4-0001-4000-8000-000000000005', 300, 'starting_from', 'Denver, CO',
   'b2c3d4e5-0001-4000-8000-000000000005',
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
   array['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000019',
   'Whole-Home Interior Design',
   'End-to-end design for your entire home. Includes space planning, custom furniture sourcing, contractor coordination, and final styling. Ideal for renovations or new builds.',
   'a1b2c3d4-0001-4000-8000-000000000005', 8000, 'quote', 'Chicago, IL',
   'b2c3d4e5-0001-4000-8000-000000000010',
   'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
   array['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000020',
   'Hospitality Design Concept',
   'Design concept for restaurants, hotels, and boutique retail. Includes mood boards, material palettes, furniture plans, and lighting design. Collaborative process with 3 presentation rounds.',
   'a1b2c3d4-0001-4000-8000-000000000005', 5000, 'quote', 'Chicago, IL',
   'b2c3d4e5-0001-4000-8000-000000000010',
   'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
   array['https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800']);

-- ==================
-- Additional Profiles (Pros)
-- ==================
insert into public.profiles (id, email, full_name, avatar_url, bio, location, is_pro) values
  ('b2c3d4e5-0001-4000-8000-000000000011', 'mia.torres@example.com', 'Mia Torres',
   'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
   'Fine art and travel photographer with a focus on natural landscapes and cultural stories.',
   'New York, NY', true),

  ('b2c3d4e5-0001-4000-8000-000000000012', 'ethan.wright@example.com', 'Ethan Wright',
   'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=200',
   'Furniture designer and woodworker combining traditional joinery with modern aesthetics.',
   'Brooklyn, NY', true),

  ('b2c3d4e5-0001-4000-8000-000000000013', 'hana.kim@example.com', 'Hana Kim',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
   'Ceramic artist specializing in minimalist tableware and decorative objects inspired by Korean traditions.',
   'Los Angeles, CA', true),

  ('b2c3d4e5-0001-4000-8000-000000000014', 'oliver.grant@example.com', 'Oliver Grant',
   'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200',
   'Illustrator and animator creating playful, bold visuals for brands, games, and publishing.',
   'Brooklyn, NY', true),

  ('b2c3d4e5-0001-4000-8000-000000000015', 'clara.santos@example.com', 'Clara Santos',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
   'Interior designer specializing in small spaces, apartment living, and eco-friendly materials.',
   'San Francisco, CA', true);

-- ==================
-- Additional Services (16 per category)
-- ==================

-- Photography (12 more → 16 total)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000021',
   'Engagement Photography',
   'Celebrate your love story with a 2-hour engagement session at a scenic location. Includes 30 edited images and a couples'' style guide.',
   'a1b2c3d4-0001-4000-8000-000000000001', 350, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000001',
   'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
   array['https://images.unsplash.com/photo-1519741497674-611481863552?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000022',
   'Real Estate Photography',
   'Professional interior and exterior photography for property listings. Wide-angle shots, twilight exteriors, and virtual tour-ready images.',
   'a1b2c3d4-0001-4000-8000-000000000001', 200, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000001',
   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
   array['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000023',
   'Headshot Photography',
   'Professional headshots for LinkedIn, corporate bios, and acting portfolios. Studio or natural light setup with wardrobe guidance.',
   'a1b2c3d4-0001-4000-8000-000000000001', 150, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000001',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
   array['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000024',
   'Newborn Photography',
   'Gentle, posed newborn sessions in a warm home studio. Includes wraps, props, and 25 retouched images. Best for babies under 14 days.',
   'a1b2c3d4-0001-4000-8000-000000000001', 400, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000006',
   'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
   array['https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000025',
   'Fashion Photography',
   'Editorial and lookbook photography for fashion brands. On-location or studio with styling direction and high-end retouching.',
   'a1b2c3d4-0001-4000-8000-000000000001', 800, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000006',
   'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
   array['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000026',
   'Architectural Photography',
   'Capturing the design and detail of buildings, interiors, and spaces. Ideal for architects, designers, and developers.',
   'a1b2c3d4-0001-4000-8000-000000000001', 600, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000006',
   'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
   array['https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000027',
   'Pet Photography',
   'Fun, playful pet portrait sessions at parks or in your home. Includes 15 edited images and optional prints.',
   'a1b2c3d4-0001-4000-8000-000000000001', 180, 'starting_from', 'New York, NY',
   'b2c3d4e5-0001-4000-8000-000000000011',
   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
   array['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000028',
   'Concert & Live Music Photography',
   'Dynamic live music photography for bands, venues, and festivals. Fast delivery for social media and press use.',
   'a1b2c3d4-0001-4000-8000-000000000001', 300, 'starting_from', 'New York, NY',
   'b2c3d4e5-0001-4000-8000-000000000011',
   'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
   array['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000029',
   'Brand Lifestyle Photography',
   'Authentic lifestyle imagery for your brand''s website, social media, and campaigns. Captures your team, products, and culture.',
   'a1b2c3d4-0001-4000-8000-000000000001', 700, 'starting_from', 'New York, NY',
   'b2c3d4e5-0001-4000-8000-000000000011',
   'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
   array['https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000030',
   'Sports Photography',
   'Action sports photography for teams, athletes, and events. High-speed capture with same-day highlight delivery.',
   'a1b2c3d4-0001-4000-8000-000000000001', 450, 'starting_from', 'New York, NY',
   'b2c3d4e5-0001-4000-8000-000000000011',
   'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
   array['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000031',
   'Wedding Photography Package',
   'Complete wedding day coverage from getting ready to the last dance. Two photographers, engagement session included, and a premium album.',
   'a1b2c3d4-0001-4000-8000-000000000001', 3500, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000001',
   'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
   array['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000032',
   'Aerial Drone Photography',
   'Stunning aerial shots for real estate, events, and landscapes. FAA-certified pilot with 4K drone and cinematic editing.',
   'a1b2c3d4-0001-4000-8000-000000000001', 350, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000006',
   'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
   array['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800']);

-- Woodworking (12 more → 16 total)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000033',
   'Custom Coffee Table',
   'Handcrafted hardwood coffee table with clean lines and premium joinery. Choose from walnut, oak, or maple. Custom dimensions available.',
   'a1b2c3d4-0001-4000-8000-000000000002', 950, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000002',
   'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
   array['https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000034',
   'Handcrafted Bed Frame',
   'Solid wood bed frame with integrated headboard. Minimalist design with exposed joinery detail. Available in queen and king sizes.',
   'a1b2c3d4-0001-4000-8000-000000000002', 2200, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000002',
   'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
   array['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000035',
   'Standing Desk',
   'Custom standing desk with hand-finished hardwood top and steel legs. Manual or motorized height adjustment available.',
   'a1b2c3d4-0001-4000-8000-000000000002', 1100, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000002',
   'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
   array['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000036',
   'Custom Kitchen Island',
   'Freestanding kitchen island with butcher block top and open shelving. Built to your kitchen''s exact dimensions.',
   'a1b2c3d4-0001-4000-8000-000000000002', 1800, 'starting_from', 'Nashville, TN',
   'b2c3d4e5-0001-4000-8000-000000000007',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
   array['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000037',
   'Entryway Coat Rack',
   'Wall-mounted coat rack with shelf, made from reclaimed wood and hand-forged hooks. Available in multiple finishes.',
   'a1b2c3d4-0001-4000-8000-000000000002', 180, 'starting_from', 'Nashville, TN',
   'b2c3d4e5-0001-4000-8000-000000000007',
   'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
   array['https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000038',
   'Wine Rack Cabinet',
   'Freestanding wine storage cabinet holding up to 24 bottles. Solid hardwood with brass hardware and stemware hanging rack.',
   'a1b2c3d4-0001-4000-8000-000000000002', 650, 'starting_from', 'Nashville, TN',
   'b2c3d4e5-0001-4000-8000-000000000007',
   'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800',
   array['https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000039',
   'Handmade Wooden Toys',
   'Set of safe, non-toxic wooden toys for children. Crafted from maple and finished with food-safe oils. Custom shapes available.',
   'a1b2c3d4-0001-4000-8000-000000000002', 60, 'starting_from', 'Brooklyn, NY',
   'b2c3d4e5-0001-4000-8000-000000000012',
   'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800',
   array['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000040',
   'Adirondack Chair Set',
   'Classic Adirondack chairs built from cedar for outdoor durability. Sold as a pair with optional matching side table.',
   'a1b2c3d4-0001-4000-8000-000000000002', 420, 'starting_from', 'Brooklyn, NY',
   'b2c3d4e5-0001-4000-8000-000000000012',
   'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
   array['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000041',
   'Live Edge Console Table',
   'Natural live-edge slab console table with hand-forged steel hairpin legs. Each piece showcases unique wood grain patterns.',
   'a1b2c3d4-0001-4000-8000-000000000002', 780, 'starting_from', 'Brooklyn, NY',
   'b2c3d4e5-0001-4000-8000-000000000012',
   'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
   array['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000042',
   'Wooden Jewelry Box',
   'Handcrafted keepsake box with velvet-lined compartments and a hinged lid. Made from figured maple with walnut accents.',
   'a1b2c3d4-0001-4000-8000-000000000002', 145, 'starting_from', 'Brooklyn, NY',
   'b2c3d4e5-0001-4000-8000-000000000012',
   'https://images.unsplash.com/photo-1584811644165-33db3b146db5?w=800',
   array['https://images.unsplash.com/photo-1584811644165-33db3b146db5?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000043',
   'Custom Wooden Sign',
   'Hand-carved or routed wooden signs for homes, businesses, and events. Choose from cedar, walnut, or white oak with custom lettering.',
   'a1b2c3d4-0001-4000-8000-000000000002', 200, 'starting_from', 'Portland, OR',
   'b2c3d4e5-0001-4000-8000-000000000002',
   'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800',
   array['https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000044',
   'Custom Wooden Planters',
   'Raised garden planters and window boxes built from rot-resistant cedar. Perfect for herbs, vegetables, and flowers.',
   'a1b2c3d4-0001-4000-8000-000000000002', 160, 'starting_from', 'Nashville, TN',
   'b2c3d4e5-0001-4000-8000-000000000007',
   'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
   array['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800']);

-- Ceramics (12 more → 16 total)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000045',
   'Ceramic Wall Art Installation',
   'Custom wall-mounted ceramic art pieces. Abstract or nature-inspired forms in your choice of glaze palette. Includes installation hardware.',
   'a1b2c3d4-0001-4000-8000-000000000003', 450, 'starting_from', 'Seattle, WA',
   'b2c3d4e5-0001-4000-8000-000000000003',
   'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
   array['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000046',
   'Custom Tile Backsplash',
   'Handmade ceramic tiles for kitchen or bathroom backsplash. Unique glazes and patterns. Priced per square foot.',
   'a1b2c3d4-0001-4000-8000-000000000003', 35, 'starting_from', 'Seattle, WA',
   'b2c3d4e5-0001-4000-8000-000000000003',
   'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
   array['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000047',
   'Ceramic Lamp Base',
   'Hand-thrown ceramic lamp base with custom glaze. Pair with your own shade or choose from our curated selection.',
   'a1b2c3d4-0001-4000-8000-000000000003', 175, 'starting_from', 'Seattle, WA',
   'b2c3d4e5-0001-4000-8000-000000000003',
   'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
   array['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000048',
   'Raku Pottery Bowl',
   'Dramatic raku-fired bowls with metallic and crackle glaze effects. Each piece is a one-of-a-kind art object.',
   'a1b2c3d4-0001-4000-8000-000000000003', 85, 'starting_from', 'Asheville, NC',
   'b2c3d4e5-0001-4000-8000-000000000008',
   'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
   array['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000049',
   'Ceramic Soap Dish Set',
   'Set of three handmade soap dishes with drainage ridges. Available in earth-toned or coastal glaze palettes.',
   'a1b2c3d4-0001-4000-8000-000000000003', 45, 'starting_from', 'Asheville, NC',
   'b2c3d4e5-0001-4000-8000-000000000008',
   'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=800',
   array['https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000050',
   'Custom Pet Bowl',
   'Personalized ceramic pet bowls with your pet''s name. Food-safe glaze in a variety of colors. Available in small, medium, and large.',
   'a1b2c3d4-0001-4000-8000-000000000003', 40, 'starting_from', 'Asheville, NC',
   'b2c3d4e5-0001-4000-8000-000000000008',
   'https://images.unsplash.com/photo-1541188495357-ad2dc89487f4?w=800',
   array['https://images.unsplash.com/photo-1541188495357-ad2dc89487f4?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000051',
   'Ceramic Candle Holders',
   'Set of three minimalist ceramic candle holders in graduated heights. Matte white, black, or sage green.',
   'a1b2c3d4-0001-4000-8000-000000000003', 55, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000013',
   'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
   array['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000052',
   'Stoneware Serving Platter',
   'Large hand-thrown serving platter with textured rim detail. Perfect centerpiece for entertaining. Food and dishwasher safe.',
   'a1b2c3d4-0001-4000-8000-000000000003', 90, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000013',
   'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
   array['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000053',
   'Ceramic Espresso Cup Set',
   'Set of four delicate espresso cups with matching saucers. Inspired by Japanese tea ceremony aesthetics.',
   'a1b2c3d4-0001-4000-8000-000000000003', 75, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000013',
   'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800',
   array['https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000054',
   'Ceramic Bird Feeder',
   'Hanging ceramic bird feeder with natural wood perch. Weather-resistant glaze in moss green or slate blue.',
   'a1b2c3d4-0001-4000-8000-000000000003', 50, 'starting_from', 'Los Angeles, CA',
   'b2c3d4e5-0001-4000-8000-000000000013',
   'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=800',
   array['https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000055',
   'Memorial Ceramic Urn',
   'Handcrafted ceramic urn with custom glaze and optional personalized inscription. Dignified and beautiful keepsake.',
   'a1b2c3d4-0001-4000-8000-000000000003', 280, 'quote', 'Seattle, WA',
   'b2c3d4e5-0001-4000-8000-000000000003',
   'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800',
   array['https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000056',
   'Ceramic Ring Dish Set',
   'Delicate ring dishes with gold-leaf accents. Perfect for a vanity or nightstand. Sold individually or as a set of three.',
   'a1b2c3d4-0001-4000-8000-000000000003', 30, 'starting_from', 'Asheville, NC',
   'b2c3d4e5-0001-4000-8000-000000000008',
   'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
   array['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800']);

-- Illustration (12 more → 16 total)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000057',
   'Logo & Brand Identity Design',
   'Custom logo design with full brand identity kit. Includes variations, color palette, typography guide, and brand usage guidelines.',
   'a1b2c3d4-0001-4000-8000-000000000004', 1200, 'starting_from', 'Austin, TX',
   'b2c3d4e5-0001-4000-8000-000000000004',
   'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
   array['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000058',
   'Custom Pet Portrait',
   'Hand-illustrated pet portrait in a whimsical, colorful style. Digital or printed on archival paper. Perfect gift for pet lovers.',
   'a1b2c3d4-0001-4000-8000-000000000004', 200, 'starting_from', 'Austin, TX',
   'b2c3d4e5-0001-4000-8000-000000000004',
   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
   array['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000059',
   'Wedding Invitation Suite',
   'Custom-illustrated wedding invitation set including save-the-dates, invitations, RSVP cards, and day-of signage.',
   'a1b2c3d4-0001-4000-8000-000000000004', 800, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000009',
   'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
   array['https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000060',
   'Tattoo Design',
   'Custom tattoo design with unlimited sketch revisions. Styles range from fine line to bold traditional. Digital delivery.',
   'a1b2c3d4-0001-4000-8000-000000000004', 250, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000009',
   'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
   array['https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000061',
   'Comic Strip Commission',
   'Custom comic strip or panel art for personal gifts, social media, or publications. Includes character design and inking.',
   'a1b2c3d4-0001-4000-8000-000000000004', 350, 'starting_from', 'Brooklyn, NY',
   'b2c3d4e5-0001-4000-8000-000000000014',
   'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800',
   array['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000062',
   'Album Cover Art',
   'Original illustrated album or single cover art. Bold, eye-catching designs tailored to your music''s vibe and genre.',
   'a1b2c3d4-0001-4000-8000-000000000004', 500, 'starting_from', 'Brooklyn, NY',
   'b2c3d4e5-0001-4000-8000-000000000014',
   'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
   array['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000063',
   'Illustrated Map',
   'Hand-drawn illustrated map for weddings, tourism, real estate, or editorial use. Whimsical and informative.',
   'a1b2c3d4-0001-4000-8000-000000000004', 600, 'starting_from', 'Brooklyn, NY',
   'b2c3d4e5-0001-4000-8000-000000000014',
   'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800',
   array['https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000064',
   'Pattern Design for Textiles',
   'Custom repeating patterns for fabric, wallpaper, and packaging. Delivered as production-ready digital files.',
   'a1b2c3d4-0001-4000-8000-000000000004', 450, 'starting_from', 'Brooklyn, NY',
   'b2c3d4e5-0001-4000-8000-000000000014',
   'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800',
   array['https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000065',
   'Character Design',
   'Original character design for games, animation, or branding. Includes turnaround sheet, expression studies, and color variations.',
   'a1b2c3d4-0001-4000-8000-000000000004', 700, 'starting_from', 'Austin, TX',
   'b2c3d4e5-0001-4000-8000-000000000004',
   'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=800',
   array['https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000066',
   'Infographic Design',
   'Data-driven illustrated infographics for reports, presentations, and social media. Clear, engaging visual storytelling.',
   'a1b2c3d4-0001-4000-8000-000000000004', 300, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000009',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
   array['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000067',
   'Botanical Illustration',
   'Detailed, scientifically accurate botanical illustrations for prints, packaging, or publications. Watercolor or digital medium.',
   'a1b2c3d4-0001-4000-8000-000000000004', 350, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000009',
   'https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=800',
   array['https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000068',
   'Custom Tarot Card Design',
   'Full or partial custom tarot deck illustration. Rich, symbolic artwork tailored to your theme. Priced per card or full deck.',
   'a1b2c3d4-0001-4000-8000-000000000004', 150, 'starting_from', 'Austin, TX',
   'b2c3d4e5-0001-4000-8000-000000000004',
   'https://images.unsplash.com/photo-1600429991827-5224817554f8?w=800',
   array['https://images.unsplash.com/photo-1600429991827-5224817554f8?w=800']);

-- Interior Design (12 more → 16 total)
insert into public.services (id, title, description, category_id, price_starting, price_type, location, provider_id, image_url, images) values
  ('c3d4e5f6-0001-4000-8000-000000000069',
   'Kitchen Renovation Design',
   'Complete kitchen design including layout, cabinetry, countertops, lighting, and finishes. Includes 3D renderings and contractor-ready plans.',
   'a1b2c3d4-0001-4000-8000-000000000005', 3500, 'starting_from', 'Denver, CO',
   'b2c3d4e5-0001-4000-8000-000000000005',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
   array['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000070',
   'Bathroom Remodel Design',
   'Spa-inspired bathroom redesign with fixture selection, tile layout, and lighting plan. Budget-conscious and luxury options available.',
   'a1b2c3d4-0001-4000-8000-000000000005', 2000, 'starting_from', 'Denver, CO',
   'b2c3d4e5-0001-4000-8000-000000000005',
   'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
   array['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000071',
   'Home Office Design',
   'Functional and inspiring home office design. Ergonomic layout, storage solutions, lighting, and decor tailored to how you work.',
   'a1b2c3d4-0001-4000-8000-000000000005', 800, 'starting_from', 'Chicago, IL',
   'b2c3d4e5-0001-4000-8000-000000000010',
   'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
   array['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000072',
   'Nursery Design',
   'Thoughtful nursery design balancing aesthetics with safety. Includes furniture sourcing, color palette, and a grow-with-baby plan.',
   'a1b2c3d4-0001-4000-8000-000000000005', 1200, 'starting_from', 'Chicago, IL',
   'b2c3d4e5-0001-4000-8000-000000000010',
   'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
   array['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000073',
   'Color Consultation',
   'Expert color consultation for any room or your entire home. Includes paint recommendations, swatches, and a written color plan.',
   'a1b2c3d4-0001-4000-8000-000000000005', 200, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000015',
   'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800',
   array['https://images.unsplash.com/photo-1615873968403-89e068629265?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000074',
   'Furniture Selection Service',
   'Curated furniture selection for any room based on your style, budget, and space. Includes sourcing, ordering, and delivery coordination.',
   'a1b2c3d4-0001-4000-8000-000000000005', 500, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000015',
   'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
   array['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000075',
   'Outdoor Living Space Design',
   'Design for patios, decks, and garden areas. Includes furniture layout, planting suggestions, lighting, and material recommendations.',
   'a1b2c3d4-0001-4000-8000-000000000005', 1500, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000015',
   'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800',
   array['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000076',
   'Apartment Staging',
   'Professional staging for apartment sales or rentals. Maximize perceived space and appeal with curated furnishings and styling.',
   'a1b2c3d4-0001-4000-8000-000000000005', 1000, 'starting_from', 'San Francisco, CA',
   'b2c3d4e5-0001-4000-8000-000000000015',
   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
   array['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000077',
   'Retail Store Design',
   'Retail space design focused on customer flow, product display, and brand experience. From boutiques to pop-up shops.',
   'a1b2c3d4-0001-4000-8000-000000000005', 4000, 'quote', 'Chicago, IL',
   'b2c3d4e5-0001-4000-8000-000000000010',
   'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800',
   array['https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000078',
   'Home Library Design',
   'Custom home library design with built-in shelving, reading nooks, and ambient lighting. Perfect for book lovers and collectors.',
   'a1b2c3d4-0001-4000-8000-000000000005', 2500, 'starting_from', 'Denver, CO',
   'b2c3d4e5-0001-4000-8000-000000000005',
   'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
   array['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000079',
   'Open Floor Plan Design',
   'Cohesive design for open-concept living, dining, and kitchen areas. Defines zones without walls using furniture, rugs, and lighting.',
   'a1b2c3d4-0001-4000-8000-000000000005', 2200, 'starting_from', 'Chicago, IL',
   'b2c3d4e5-0001-4000-8000-000000000010',
   'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
   array['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800']),

  ('c3d4e5f6-0001-4000-8000-000000000080',
   'Vacation Rental Styling',
   'Interior styling for Airbnb and vacation rental properties. Maximize bookings with inviting, photogenic interiors and durable materials.',
   'a1b2c3d4-0001-4000-8000-000000000005', 1800, 'starting_from', 'Denver, CO',
   'b2c3d4e5-0001-4000-8000-000000000005',
   'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
   array['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']);

-- ==================
-- Gallery images: expand all services to 5 images
-- Keeps each service's own hero image_url as image[1], adds 4 curated
-- category-specific images so the gallery full-grid layout is always shown.
-- ==================

-- Photography (extras sourced from confirmed service image_urls in this file)
update public.services set images = array[
  image_url,
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800'
] where category_id = 'a1b2c3d4-0001-4000-8000-000000000001';

-- Woodworking (extras sourced from confirmed service image_urls in this file)
update public.services set images = array[
  image_url,
  'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800',
  'https://images.unsplash.com/photo-1583063855677-13ba58984537?w=800',
  'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
] where category_id = 'a1b2c3d4-0001-4000-8000-000000000002';

-- Ceramics (extras sourced from confirmed service image_urls in this file)
update public.services set images = array[
  image_url,
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
  'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'
] where category_id = 'a1b2c3d4-0001-4000-8000-000000000003';

-- Illustration (extras sourced from confirmed service image_urls in this file)
update public.services set images = array[
  image_url,
  'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
  'https://images.unsplash.com/photo-1515041219749-89347f83291a?w=800',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'
] where category_id = 'a1b2c3d4-0001-4000-8000-000000000004';

-- Interior Design (extras sourced from confirmed service image_urls in this file)
update public.services set images = array[
  image_url,
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
  'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800'
] where category_id = 'a1b2c3d4-0001-4000-8000-000000000005';
