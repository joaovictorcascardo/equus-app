-- ============================================================
--  EQUUS — Dados de Seed para Desenvolvimento Local
--  Senhas: todas usam bcrypt de "senha123"
--  Hash bcrypt 12 rounds de "senha123":
--  $2b$12$K.MxjF3PZTQ8VN7gzJeaweG5R8P7zW6tN5oJ.xE2UkYrR4KFdGXQm
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── Usuários ─────────────────────────────────────────────────
INSERT IGNORE INTO users (id, type, name, username, email, password_hash, whatsapp, bio, city, state, verified, avatar_url, cover_url) VALUES
(1, 'haras',  'Haras Boa Vista',    'harasboavista',   'haras@equus.dev',   '$2b$12$K.MxjF3PZTQ8VN7gzJeaweG5R8P7zW6tN5oJ.xE2UkYrR4KFdGXQm', '34991234567', 'Haras especializado em Quarto de Milha e Vaquejada. Mais de 20 anos criando campeões.', 'Uberlândia', 'MG', 1,
  'https://ui-avatars.com/api/?name=Haras+Boa+Vista&background=059669&color=fff&size=200',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'),
(2, 'seller', 'João Cavalcante',    'joaocavalcante',  'joao@equus.dev',    '$2b$12$K.MxjF3PZTQ8VN7gzJeaweG5R8P7zW6tN5oJ.xE2UkYrR4KFdGXQm', '11987654321', 'Criador de Mangalarga Marchador há 15 anos. Membro da ABCMM.', 'Campinas',    'SP', 0,
  'https://ui-avatars.com/api/?name=Joao+Cavalcante&background=3b82f6&color=fff&size=200',
  NULL),
(3, 'buyer',  'Maria Fernanda',     'mariafernanda',   'maria@equus.dev',   '$2b$12$K.MxjF3PZTQ8VN7gzJeaweG5R8P7zW6tN5oJ.xE2UkYrR4KFdGXQm', '81999887766', 'Apaixonada por cavalos e equitação. Praticante de dressage.', 'Recife',      'PE', 0,
  'https://ui-avatars.com/api/?name=Maria+Fernanda&background=ec4899&color=fff&size=200',
  NULL),
(4, 'haras',  'Haras Santa Clara',  'harassantaclara', 'santa@equus.dev',   '$2b$12$K.MxjF3PZTQ8VN7gzJeaweG5R8P7zW6tN5oJ.xE2UkYrR4KFdGXQm', '62998765432', 'Criadores de cavalos de elite para hipismo e dressage. Cavalos importados.', 'Goiânia',    'GO', 1,
  'https://ui-avatars.com/api/?name=Haras+Santa+Clara&background=8b5cf6&color=fff&size=200',
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80'),
(5, 'seller', 'Pedro Alves',        'pedroalves',      'pedro@equus.dev',   '$2b$12$K.MxjF3PZTQ8VN7gzJeaweG5R8P7zW6tN5oJ.xE2UkYrR4KFdGXQm', '71996543210', 'Vendedor de cavalos crioulos. Parceiro da ACBC.', 'Salvador',    'BA', 0,
  'https://ui-avatars.com/api/?name=Pedro+Alves&background=f59e0b&color=fff&size=200',
  NULL);

-- ── Cavalos ──────────────────────────────────────────────────
INSERT IGNORE INTO horses (id, owner_id, name, breed, color, gender, age_years, age_months, price, negotiable, horse_function, state, city, description, has_gta, has_mormo_exam, mormo_exam_date, has_coggins, coggins_date, has_vaccination, sire, dam, registered, registration_entity, registration_number, views) VALUES
(1, 1, 'Relâmpago da Serra',    'Quarto de Milha',      'Alazão Tostado', 'Macho',   5, 3,  85000.00, 1, 'Vaquejada', 'MG', 'Uberlândia', 'Animal excepcional com ótimo preparo para vaquejada. Filho do famoso Três Corações, um dos melhores reprodutores da região. Participou de competições regionais com excelente desempenho. Muito manso e dócil.', 1, 1, '2024-11-15', 1, '2024-10-02', 1, 'Três Corações', 'Estrela do Sul', 1, 'ABQM', 'ABQM-2019-45231', 347),
(2, 1, 'Trovão de Fogo',        'Quarto de Milha',      'Castanho Escuro','Macho',   7, 0,  55000.00, 1, 'Laço',      'MG', 'Uberlândia', 'Cavalo experiente para laço comprido. Participou de mais de 30 rodeios. Excelente para quem busca um animal já formado e sem vícios.', 1, 1, '2024-09-10', 1, '2024-08-20', 1, 'Trovão Real', 'Lua Cheia', 1, 'ABQM', 'ABQM-2017-33189', 215),
(3, 2, 'Marchador das Estrelas','Mangalarga Marchador',  'Tordilho',      'Macho',   4, 6,  120000.00,0, 'Cavalgada', 'SP', 'Campinas',   'Marchador de elite com andamento perfeito. Excelente para cavalgadas longas. Filho de campeão nacional. Documentação completa e atualizada.', 1, 1, '2024-10-01', 1, '2024-09-15', 1, 'Imperador das Gerais', 'Princesa Marchante', 1, 'ABCCMM', 'ABCCMM-2020-18765', 423),
(4, 2, 'Nuvem Dourada',         'Mangalarga Marchador',  'Palomino',      'Fêmea',   3, 0,  95000.00, 1, 'Reprodução','SP', 'Campinas',   'Égua de reprodução com pedigree impecável. Prenhez confirmada. Potro de excelente procedência. Ótima para quem quer iniciar um plantel de qualidade.', 1, 0, NULL, 1, '2024-10-15', 1, 'Rei do Marchão', 'Flor de Ipê', 1, 'ABCCMM', 'ABCCMM-2021-20341', 189),
(5, 4, 'Lusitano Imperial',      'Lusitano',             'Cinza',         'Macho',   8, 2,  280000.00,0, 'Dressage',  'GO', 'Goiânia',    'Lusitano importado de Portugal. Treinado até Grand Prix de Dressage. Participou de competições internacionais. Cavalo de elite para atletas de alto nível.', 1, 1, '2024-11-01', 1, '2024-10-28', 1, 'Dom Quixote VII', 'Princesa Lusitana', 1, 'APSL', 'APSL-2016-09823', 612),
(6, 4, 'Andaluz do Sol',         'Lusitano',             'Baio',          'Macho',   6, 4,  195000.00, 1, 'Hipismo',   'GO', 'Goiânia',    'Cavalo de hipismo com excelente desempenho em obstáculos. Altura 1,70m. Participou de competições nacionais. Treinador profissional disponível.', 1, 1, '2024-10-05', 1, '2024-09-22', 1, 'Sol de Andaluzia', 'Brisa Ibérica', 1, 'APSL', 'APSL-2018-11204', 298),
(7, 5, 'Crioulo Gaúcho',         'Crioulo',              'Overo',         'Macho',   9, 0,  35000.00,  1, 'Laço',      'BA', 'Salvador',   'Crioulo legítimo de trabalho. Excelente para lida campeira e laço. Animal resistente e de fácil manejo. Ideal para fazenda ou competições de trabalho.', 1, 1, '2024-08-15', 0, NULL, 1, NULL, NULL, 1, 'ACBC', 'ACBC-2015-55678', 178),
(8, 5, 'Pampa da Corcunda',      'Crioulo',              'Pampa',         'Fêmea',   5, 8,  48000.00,  1, 'Cavalgada', 'BA', 'Salvador',   'Linda égua pampa com temperamento dócil. Ótima para cavalgadas em família. Nunca brigou, excelente para iniciantes. Pelagem exuberante e única.', 1, 1, '2024-09-01', 1, '2024-08-10', 1, 'Pampeiro Clássico', 'Estrelinha do Sul', 0, NULL, NULL, 156);

-- ── Imagens dos cavalos ───────────────────────────────────────
INSERT IGNORE INTO horse_images (horse_id, url, order_index, is_cover) VALUES
(1, 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&q=80', 0, 1),
(1, 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=900&q=80', 1, 0),
(1, 'https://images.unsplash.com/photo-1534773729-uce3e82fa5a?w=900&q=80', 2, 0),
(2, 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=900&q=80', 0, 1),
(2, 'https://images.unsplash.com/photo-1449854742095-87b3e03b1fc4?w=900&q=80', 1, 0),
(3, 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=900&q=80', 0, 1),
(3, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80', 1, 0),
(4, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&q=80', 0, 1),
(5, 'https://images.unsplash.com/photo-1534773729-uce3e82fa5a?w=900&q=80', 0, 1),
(5, 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&q=80', 1, 0),
(5, 'https://images.unsplash.com/photo-1549116025-b8571f536e44?w=900&q=80', 2, 0),
(6, 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=900&q=80', 0, 1),
(7, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80', 0, 1),
(8, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&q=80', 0, 1),
(8, 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=900&q=80', 1, 0);

-- ── Posts do feed ─────────────────────────────────────────────
INSERT IGNORE INTO posts (id, user_id, horse_id, content, type) VALUES
(1, 1, 1, 'Hoje o Relâmpago da Serra treinou forte! Preparando para o próximo campeonato de vaquejada em Uberlândia. Ele está em excelente forma! 🐴🏆', 'text'),
(2, 2, 3, 'Novo vídeo do Marchador das Estrelas disponível! Andamento perfeito, filho de campeão nacional. Entre em contato para agendar visita.', 'text'),
(3, 4, 5, 'O Lusitano Imperial passou no exame veterinário com louvor! Pronto para nova temporada de competições. Que animal extraordinário 🌟', 'text'),
(4, 1, NULL, 'Haras Boa Vista completa 20 anos de história! Obrigado a todos os clientes e parceiros que confiaram em nós durante essa jornada incrível. Continuaremos criando campeões! 🎉', 'text'),
(5, 3, NULL, 'Primeira aula de dressage do meu novo cavalo. Muito nervosa mas ele foi incrível! Amor à primeira montada 💕', 'text'),
(6, 5, 7, 'Crioulo Gaúcho participou do laço e se saiu muito bem! Orgulho desse animal. Qualidade e procedência Crioula 🤠', 'text'),
(7, 2, NULL, 'Dica do dia: a alimentação correta é fundamental para a performance do seu cavalo. Consulte sempre um veterinário especializado em equinos! #Equus #CuidadosComCavalos', 'text'),
(8, 4, 6, 'Andaluz do Sol foi aprovado para competição de hipismo de julho. Primeiro lugar à vista! 🥇', 'text');

-- ── Post images ───────────────────────────────────────────────
INSERT IGNORE INTO post_images (post_id, url, order_index) VALUES
(1, 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80', 0),
(3, 'https://images.unsplash.com/photo-1534773729-uce3e82fa5a?w=800&q=80', 0),
(6, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80', 0);

-- ── Follows ───────────────────────────────────────────────────
INSERT IGNORE INTO follows (follower_id, following_id) VALUES
(2, 1), (3, 1), (3, 2), (5, 1), (5, 4),
(1, 4), (4, 1), (2, 4);

-- ── Likes ────────────────────────────────────────────────────
INSERT IGNORE INTO likes (user_id, post_id) VALUES
(2, 1), (3, 1), (4, 1), (5, 1),
(1, 2), (3, 2), (5, 2),
(2, 3), (3, 3),
(2, 4), (3, 4), (4, 4), (5, 4),
(1, 5), (2, 5), (4, 5),
(1, 6), (3, 6),
(1, 7), (3, 7), (4, 7), (5, 7);

-- ── Saved horses ─────────────────────────────────────────────
INSERT IGNORE INTO saved_horses (user_id, horse_id) VALUES
(3, 1), (3, 5), (3, 6),
(2, 5), (2, 6),
(5, 3), (5, 4);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Conta de teste (senha: senha123)
-- Email: haras@equus.dev  → Haras Boa Vista
-- Email: joao@equus.dev   → João Cavalcante (seller)
-- Email: maria@equus.dev  → Maria Fernanda (buyer)
-- Email: santa@equus.dev  → Haras Santa Clara
-- Email: pedro@equus.dev  → Pedro Alves (seller)
-- ============================================================
