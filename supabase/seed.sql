-- ============================================================
-- OMNES PODCAST — Seed data
-- ============================================================

-- Users
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'admin@omnes.com');
insert into public.users (id, email, name, role) values
  ('00000000-0000-0000-0000-000000000001', 'admin@omnes.com', 'Admin', 'admin');

-- Categories
insert into public.categories (name, slug) values
  ('Misterio', 'misterio'),
  ('Comedia', 'comedia'),
  ('Tecnología', 'tecnologia'),
  ('Ciencia', 'ciencia'),
  ('Historia', 'historia'),
  ('Música', 'musica'),
  ('Entretenimiento', 'entretenimiento'),
  ('Educación', 'educacion');

-- Podcasts
insert into public.podcasts (id, slug, title, description, color_primary, color_secondary, color_accent, vibe, category) values
  (
    'p1000000-0000-0000-0000-000000000001',
    'detras-del-espejo',
    'Detrás del Espejo',
    'Donde los reflejos revelan lo que los ojos no ven. Un viaje al corazón del misterio, lo inexplicable y lo oculto.',
    '#00d4ff', '#0066ff', '#7f00ff',
    'misterio', 'Misterio · Suspenso'
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'me-gusta-que-te-guste',
    'Me gusta que te guste',
    'Caos, humor y conversaciones que no sabías que necesitabas. Cada episodio es una experiencia diferente.',
    '#ff6b6b', '#ffd93d', '#6bcb77',
    'divertido', 'Comedia · Entretenimiento'
  );

-- Hosts
insert into public.hosts (id, podcast_id, name, bio, social_links) values
  (
    'h0000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000001',
    'Alex Miranda',
    'Explorador de lo desconocido',
    '{"instagram":"@alexmiranda","twitter":"@alexmiranda"}'::jsonb
  ),
  (
    'h0000000-0000-0000-0000-000000000002',
    'p1000000-0000-0000-0000-000000000002',
    'Carla Ruiz',
    'Creadora de caos',
    '{"instagram":"@carlaruiz","tiktok":"@carlaruiz"}'::jsonb
  );

-- Seasons
insert into public.seasons (id, podcast_id, number, title) values
  ('s0000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 1, 'Temporada 1'),
  ('s0000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000002', 1, 'Temporada 1');

-- Episodes
insert into public.episodes (id, season_id, podcast_id, title, description, duration, tags, category, published_at, views, likes) values
  (
    'e0000000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000001',
    'El espejo roto',
    'Exploramos los secretos detrás de los reflejos que cambiaron la historia. Un caso que desafía toda explicación.',
    3600, array['misterio','reflejos','historia'], 'Misterio',
    '2025-03-15', 12500, 890
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    's0000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000001',
    'La habitación sellada',
    'Un caso real que desafía toda explicación lógica. Nadie entra, nadie sale.',
    4200, array['misterio','casos reales'], 'Misterio',
    '2025-03-22', 9800, 720
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    's0000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000001',
    'El susurro en la oscuridad',
    'Historias que no deberías escuchar solo en la noche.',
    3300, array['misterio','nocturno'], 'Misterio',
    '2025-04-05', 7200, 540
  ),
  (
    'e0000000-0000-0000-0000-000000000004',
    's0000000-0000-0000-0000-000000000002',
    'p1000000-0000-0000-0000-000000000002',
    'El caos del primer episodio',
    'Todo lo que podía salir mal, salió mal. Y fue increíble.',
    2800, array['caos','humor'], 'Comedia',
    '2025-04-01', 15200, 1200
  ),
  (
    'e0000000-0000-0000-0000-000000000005',
    's0000000-0000-0000-0000-000000000002',
    'p1000000-0000-0000-0000-000000000002',
    'Invitado sorpresa',
    'Nunca sabes quién va a aparecer. Literalmente.',
    3100, array['sorpresa','invitados'], 'Comedia',
    '2025-04-10', 11000, 890
  );

-- Guests
insert into public.guests (id, name, bio, social_links) values
  ('g0000000-0000-0000-0000-000000000001', 'Dr. Elena Vázquez', 'Investigadora de fenómenos paranormales', '{}'::jsonb),
  ('g0000000-0000-0000-0000-000000000002', 'Mike Johnson', 'Comediante y creador de contenido', '{}'::jsonb);

-- Episode guests
insert into public.episode_guests (episode_id, guest_id) values
  ('e0000000-0000-0000-0000-000000000001', 'g0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000004', 'g0000000-0000-0000-0000-000000000002');
