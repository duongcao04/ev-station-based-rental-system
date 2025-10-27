-- Clear tables in dependency order
TRUNCATE TABLE "CarSpecification", "CarImage", "Car", "Brand", "Category", "SpecificationType" RESTART IDENTITY CASCADE;

-- ───────────────────────────────────────────────
-- SpecificationType (15)
-- ───────────────────────────────────────────────
INSERT INTO "SpecificationType" (id, "label", "icon", "description") VALUES
(gen_random_uuid(), 'Engine Power', 'engine.svg', 'Engine horsepower output'),
(gen_random_uuid(), 'Fuel Type', 'fuel.svg', 'Type of fuel used'),
(gen_random_uuid(), 'Transmission', 'gear.svg', 'Manual or automatic transmission'),
(gen_random_uuid(), 'Seating Capacity', 'seat.svg', 'Number of passengers'),
(gen_random_uuid(), 'Drive Type', 'drive.svg', 'FWD, RWD, or AWD'),
(gen_random_uuid(), 'Color', 'color.svg', 'Exterior color options'),
(gen_random_uuid(), 'Top Speed', 'speed.svg', 'Maximum achievable speed'),
(gen_random_uuid(), 'Acceleration', 'speedometer.svg', '0–100 km/h time'),
(gen_random_uuid(), 'Mileage', 'mileage.svg', 'Fuel efficiency rating'),
(gen_random_uuid(), 'Torque', 'torque.svg', 'Maximum torque output'),
(gen_random_uuid(), 'Weight', 'weight.svg', 'Curb weight of vehicle'),
(gen_random_uuid(), 'Dimensions', 'ruler.svg', 'Length, width, and height'),
(gen_random_uuid(), 'Warranty', 'shield.svg', 'Warranty duration'),
(gen_random_uuid(), 'Battery Capacity', 'battery.svg', 'For electric vehicles'),
(gen_random_uuid(), 'Safety Rating', 'star.svg', 'NCAP or equivalent rating');

-- ───────────────────────────────────────────────
-- Category (15)
-- ───────────────────────────────────────────────
INSERT INTO "Category" (id, "displayName", "description", "thumbnailUrl") VALUES
(gen_random_uuid(), 'SUV', 'Sport Utility Vehicle', 'https://loremflickr.com/320/240/suv,car?lock=1'),
(gen_random_uuid(), 'Sedan', 'Comfortable passenger car', 'https://loremflickr.com/320/240/sedan,car?lock=2'),
(gen_random_uuid(), 'Hatchback', 'Compact versatile car', 'https://loremflickr.com/320/240/hatchback,car?lock=3'),
(gen_random_uuid(), 'Coupe', 'Stylish 2-door car', 'https://loremflickr.com/320/240/coupe,car?lock=4'),
(gen_random_uuid(), 'Convertible', 'Open-top driving', 'https://loremflickr.com/320/240/convertible,car?lock=5'),
(gen_random_uuid(), 'Pickup Truck', 'Utility and cargo vehicle', 'https://loremflickr.com/320/240/pickup,truck?lock=6'),
(gen_random_uuid(), 'Van', 'Family and cargo transport', 'https://loremflickr.com/320/240/van,car?lock=7'),
(gen_random_uuid(), 'Crossover', 'Blend of SUV and car', 'https://loremflickr.com/320/240/crossover,car?lock=8'),
(gen_random_uuid(), 'Luxury', 'Premium performance and comfort', 'https://loremflickr.com/320/240/luxury,car?lock=9'),
(gen_random_uuid(), 'Sports Car', 'High performance car', 'https://loremflickr.com/320/240/sports,car?lock=10'),
(gen_random_uuid(), 'Electric', 'Battery-powered vehicle', 'https://loremflickr.com/320/240/electric,car?lock=11'),
(gen_random_uuid(), 'Hybrid', 'Electric + fuel combined', 'https://loremflickr.com/320/240/hybrid,car?lock=12'),
(gen_random_uuid(), 'Off-road', 'Built for rugged terrain', 'https://loremflickr.com/320/240/offroad,car?lock=13'),
(gen_random_uuid(), 'Compact', 'Small and efficient', 'https://loremflickr.com/320/240/compact,car?lock=14'),
(gen_random_uuid(), 'Minivan', 'Spacious passenger van', 'https://loremflickr.com/320/240/minivan,car?lock=15');

-- ───────────────────────────────────────────────
-- Brand (15)
-- ───────────────────────────────────────────────
INSERT INTO "Brand" (id, "displayName", "description", "thumbnailUrl") VALUES
(gen_random_uuid(), 'Toyota', 'Reliable Japanese manufacturer', 'https://logo.clearbit.com/toyota.com'),
(gen_random_uuid(), 'Honda', 'Innovative performance cars', 'https://logo.clearbit.com/honda.com'),
(gen_random_uuid(), 'Ford', 'American automotive icon', 'https://logo.clearbit.com/ford.com'),
(gen_random_uuid(), 'BMW', 'German engineering and luxury', 'https://logo.clearbit.com/bmw.com'),
(gen_random_uuid(), 'Audi', 'Progress through technology', 'https://logo.clearbit.com/audi.com'),
(gen_random_uuid(), 'Mercedes-Benz', 'Luxury and innovation', 'https://logo.clearbit.com/mercedes-benz.com'),
(gen_random_uuid(), 'Tesla', 'Electric car pioneer', 'https://logo.clearbit.com/tesla.com'),
(gen_random_uuid(), 'Hyundai', 'Affordable reliability', 'https://logo.clearbit.com/hyundai.com'),
(gen_random_uuid(), 'Kia', 'Stylish modern cars', 'https://logo.clearbit.com/kia.com'),
(gen_random_uuid(), 'Chevrolet', 'American performance vehicles', 'https://logo.clearbit.com/chevrolet.com'),
(gen_random_uuid(), 'Nissan', 'Innovation that excites', 'https://logo.clearbit.com/nissan.com'),
(gen_random_uuid(), 'Mazda', 'Driving matters', 'https://logo.clearbit.com/mazda.com'),
(gen_random_uuid(), 'Jeep', 'Go anywhere freedom', 'https://logo.clearbit.com/jeep.com'),
(gen_random_uuid(), 'Volkswagen', 'People’s car from Germany', 'https://logo.clearbit.com/vw.com'),
(gen_random_uuid(), 'Porsche', 'Luxury performance sports cars', 'https://logo.clearbit.com/porsche.com');

-- ───────────────────────────────────────────────
-- Car (15)
-- ───────────────────────────────────────────────
INSERT INTO "Car" (
  id, "regularPrice", "salePrice", "depositPrice",
  "quantity", "isInStock", "description", "thumbnailUrl", "brandId"
)
SELECT
  gen_random_uuid(),
  (30000 + random() * 70000)::numeric(10,2),
  (25000 + random() * 60000)::numeric(10,2),
  (5000 + random() * 5000)::numeric(10,2),
  (5 + floor(random() * 10))::int,
  true,
  'A high-quality ' || b."displayName" ||
  ' vehicle, offering excellent performance, modern features, and a comfortable ride. Perfect for both city driving and long-distance journeys.',
  'https://loremflickr.com/640/480/' || replace(b."displayName", ' ', '%20') || ',car?lock=' || (100 + (random() * 1000)::int)::text,
  b.id
FROM "Brand" b
LIMIT 15;

-- ───────────────────────────────────────────────
-- CarImage (15) - One image per car
-- ───────────────────────────────────────────────
INSERT INTO "CarImage" (id, "url", "sort", "carId")
SELECT
  gen_random_uuid(),
  'https://loremflickr.com/1280/720/car,side?lock=' || (1000 + c.row_num)::text AS url,
  1 AS sort,
  c.id
FROM (
  SELECT id, ROW_NUMBER() OVER () AS row_num
  FROM "Car"
  LIMIT 15
) c;

-- ───────────────────────────────────────────────
-- CarSpecification (75) - Assign 5 random specs to each car
-- ───────────────────────────────────────────────
INSERT INTO "CarSpecification" (id, "value", "carId", "specificationTypeId")
SELECT
  gen_random_uuid(),
  CASE st.label
    WHEN 'Engine Power'     THEN ((150 + floor(random()*200))::int)::text || ' HP'
    WHEN 'Fuel Type'        THEN (ARRAY['Petrol','Diesel','Hybrid','Electric'])[(floor(random()*4)+1)::int]
    WHEN 'Transmission'     THEN (ARRAY['Manual','Automatic'])[(floor(random()*2)+1)::int]
    WHEN 'Seating Capacity' THEN (2 + floor(random()*6))::int::text
    WHEN 'Drive Type'       THEN (ARRAY['FWD','RWD','AWD'])[(floor(random()*3)+1)::int]
    WHEN 'Color'            THEN (ARRAY['Black','White','Silver','Red','Blue','Grey'])[(floor(random()*6)+1)::int]
    WHEN 'Top Speed'        THEN ((180 + floor(random()*120))::int)::text || ' km/h'
    WHEN 'Acceleration'     THEN to_char((3.0 + random()*10), 'FM999D0') || ' s'
    WHEN 'Mileage'          THEN ((15 + floor(random()*25))::int)::text || ' km/L'
    WHEN 'Torque'           THEN ((200 + floor(random()*300))::int)::text || ' Nm'
    WHEN 'Weight'           THEN ((1200 + floor(random()*1000))::int)::text || ' kg'
    WHEN 'Dimensions'       THEN
         to_char((4.0 + random()), 'FM9D99') || 'm L x ' ||
         to_char((1.5 + random()*0.5), 'FM9D99') || 'm W x ' ||
         to_char((1.4 + random()*0.4), 'FM9D99') || 'm H'
    WHEN 'Warranty'         THEN ((3 + floor(random()*3))::int)::text || ' Years'
    WHEN 'Battery Capacity' THEN ((40 + floor(random()*60))::int)::text || ' kWh'
    WHEN 'Safety Rating'    THEN to_char((4 + random()), 'FM9D1') || ' Stars'
    ELSE 'N/A'
  END AS value,
  c.id,
  st.id
FROM "Car" c
CROSS JOIN LATERAL (
  -- Pick 5 distinct random spec types per car (respects unique(carId, specificationTypeId))
  SELECT id, label
  FROM "SpecificationType"
  ORDER BY random()
  LIMIT 5
) st;
