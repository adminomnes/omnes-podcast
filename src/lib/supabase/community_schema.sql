-- SALA DEL CAOS - SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- 1. Actualizar tabla profiles existente (agregando columnas de comunidad)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Disponible';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_podcast TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_song TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. Create rooms table
CREATE TYPE room_type AS ENUM ('permanent', 'temporary', 'episode', 'live');

CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type room_type DEFAULT 'permanent',
  associated_entity_id TEXT, -- e.g., podcast episode ID or live stream ID
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rooms are viewable by everyone." ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create temporary rooms." ON public.rooms FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  timestamp_sync INTEGER, -- Second in the episode for time-synced comments
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages are viewable by everyone." ON public.messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert messages." ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own messages." ON public.messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own messages." ON public.messages FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER on_messages_updated
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- 4. Create message reactions table
CREATE TABLE public.message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(message_id, user_id, emoji) -- User can only react once with same emoji per message
);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reactions are viewable by everyone." ON public.message_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reactions." ON public.message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions." ON public.message_reactions FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime for relevant tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Pre-seed some default rooms
INSERT INTO public.rooms (name, description, type) VALUES
('🎙 General', 'Conversaciones generales sobre OMNES PODCAST.', 'permanent'),
('😂 Me gusta que te guste', 'Sala oficial del podcast de comedia.', 'permanent'),
('🪞 Detrás del Espejo', 'Teorías y debates profundos del podcast.', 'permanent'),
('🎵 Música', 'Comparte lo que estás escuchando.', 'permanent'),
('🤖 Inteligencia Artificial', 'Debates sobre el futuro de la IA.', 'permanent'),
('☕ Random', 'Para hablar de cualquier cosa.', 'permanent');
