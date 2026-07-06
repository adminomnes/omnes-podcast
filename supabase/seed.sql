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
insert into public.podcasts (slug, title, description, color_primary, color_secondary, color_accent, vibe, category) values
  (
    'detras-del-espejo',
    'Detrás del Espejo',
    'Donde los reflejos revelan lo que los ojos no ven. Un viaje al corazón del misterio, lo inexplicable y lo oculto.',
    '#00d4ff', '#0066ff', '#7f00ff',
    'misterio', 'Misterio · Suspenso'
  ),
  (
    'me-gusta-que-te-guste',
    'Me gusta que te guste',
    'Caos, humor y conversaciones que no sabías que necesitabas. Cada episodio es una experiencia diferente.',
    '#ff6b6b', '#ffd93d', '#6bcb77',
    'divertido', 'Comedia · Entretenimiento'
  );

-- Hosts
insert into public.hosts (podcast_id, name, bio, social_links)
select p.id, 'Alex Miranda', 'Explorador de lo desconocido', '{"instagram":"@alexmiranda","twitter":"@alexmiranda"}'::jsonb
from public.podcasts p where p.slug = 'detras-del-espejo';

insert into public.hosts (podcast_id, name, bio, social_links)
select p.id, 'Carla Ruiz', 'Creadora de caos', '{"instagram":"@carlaruiz","tiktok":"@carlaruiz"}'::jsonb
from public.podcasts p where p.slug = 'me-gusta-que-te-guste';

-- Seasons
insert into public.seasons (podcast_id, number, title)
select p.id, 1, 'Temporada 1'
from public.podcasts p where p.slug = 'detras-del-espejo';

insert into public.seasons (podcast_id, number, title)
select p.id, 1, 'Temporada 1'
from public.podcasts p where p.slug = 'me-gusta-que-te-guste';

-- Episodes
insert into public.episodes (season_id, podcast_id, title, description, duration, tags, category, published_at, views, likes)
select s.id, p.id, 'El espejo roto', 'Exploramos los secretos detrás de los reflejos que cambiaron la historia. Un caso que desafía toda explicación.', 3600, array['misterio','reflejos','historia'], 'Misterio', '2025-03-15', 12500, 890
from public.podcasts p join public.seasons s on s.podcast_id = p.id where p.slug = 'detras-del-espejo';

insert into public.episodes (season_id, podcast_id, title, description, duration, tags, category, published_at, views, likes)
select s.id, p.id, 'La habitación sellada', 'Un caso real que desafía toda explicación lógica. Nadie entra, nadie sale.', 4200, array['misterio','casos reales'], 'Misterio', '2025-03-22', 9800, 720
from public.podcasts p join public.seasons s on s.podcast_id = p.id where p.slug = 'detras-del-espejo';

insert into public.episodes (season_id, podcast_id, title, description, duration, tags, category, published_at, views, likes)
select s.id, p.id, 'El susurro en la oscuridad', 'Historias que no deberías escuchar solo en la noche.', 3300, array['misterio','nocturno'], 'Misterio', '2025-04-05', 7200, 540
from public.podcasts p join public.seasons s on s.podcast_id = p.id where p.slug = 'detras-del-espejo';

insert into public.episodes (season_id, podcast_id, title, description, duration, tags, category, published_at, views, likes)
select s.id, p.id, 'El caos del primer episodio', 'Todo lo que podía salir mal, salió mal. Y fue increíble.', 2800, array['caos','humor'], 'Comedia', '2025-04-01', 15200, 1200
from public.podcasts p join public.seasons s on s.podcast_id = p.id where p.slug = 'me-gusta-que-te-guste';

insert into public.episodes (season_id, podcast_id, title, description, duration, tags, category, published_at, views, likes)
select s.id, p.id, 'Invitado sorpresa', 'Nunca sabes quién va a aparecer. Literalmente.', 3100, array['sorpresa','invitados'], 'Comedia', '2025-04-10', 11000, 890
from public.podcasts p join public.seasons s on s.podcast_id = p.id where p.slug = 'me-gusta-que-te-guste';

-- Guests
insert into public.guests (name, bio, social_links) values
  ('Dr. Elena Vázquez', 'Investigadora de fenómenos paranormales', '{}'::jsonb),
  ('Mike Johnson', 'Comediante y creador de contenido', '{}'::jsonb);

-- Episode guests
insert into public.episode_guests (episode_id, guest_id)
select e.id, g.id
from public.episodes e, public.guests g
where e.title = 'El espejo roto' and g.name = 'Dr. Elena Vázquez';

insert into public.episode_guests (episode_id, guest_id)
select e.id, g.id
from public.episodes e, public.guests g
where e.title = 'El caos del primer episodio' and g.name = 'Mike Johnson';
