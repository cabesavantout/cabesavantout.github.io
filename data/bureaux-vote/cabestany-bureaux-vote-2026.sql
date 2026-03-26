insert into polling_stations (code, name)
values
  ('0001', 'Bureau 1 - Centre culturel'),
  ('0002', 'Bureau 2 - Centre culturel'),
  ('0003', 'Bureau 3 - Centre culturel'),
  ('0004', 'Bureau 4 - École Prévert'),
  ('0005', 'Bureau 5 - École Prévert'),
  ('0006', 'Bureau 6 - École Buffon'),
  ('0007', 'Bureau 7 - École Buffon'),
  ('0008', 'Bureau 8 - École Ludovic Masse'),
  ('0009', 'Bureau 9 - École Ludovic Masse')
on conflict (code) do update
set name = excluded.name;
