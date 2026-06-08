/**
 * Script de seed para desenvolvimento local
 * Uso: node scripts/seed.mjs
 *
 * Requer: npm install bcryptjs mysql2 dotenv
 * Lê as variáveis de .env.local automaticamente
 */

import { readFileSync } from 'fs'
import { createConnection } from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

// Carrega .env.local manualmente
const envPath = join(__dir, '..', '.env.local')
try {
  const env = readFileSync(envPath, 'utf-8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.trim().split('=')
    if (k && v.length) process.env[k] = v.join('=')
  }
} catch {
  console.log('Aviso: .env.local não encontrado, usando variáveis de ambiente existentes')
}

const db = await createConnection({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

console.log('✓ Conectado ao banco de dados')

// Gerar hash de senha
const SENHA = 'senha123'
const hash  = await bcrypt.hash(SENHA, 12)
console.log(`✓ Hash gerado para "${SENHA}"`)

// Usuários
await db.execute('SET FOREIGN_KEY_CHECKS = 0')
await db.execute('SET NAMES utf8mb4')

const users = [
  [1, 'haras',  'Haras Boa Vista',    'harasboavista',   'haras@equus.dev',   hash, '34991234567', 'Haras especializado em Quarto de Milha e Vaquejada. Mais de 20 anos criando campeões.', 'Uberlândia', 'MG', 1, 'https://ui-avatars.com/api/?name=Haras+Boa+Vista&background=059669&color=fff&size=200', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'],
  [2, 'seller', 'João Cavalcante',    'joaocavalcante',  'joao@equus.dev',    hash, '11987654321', 'Criador de Mangalarga Marchador há 15 anos.', 'Campinas', 'SP', 0, 'https://ui-avatars.com/api/?name=Joao+Cavalcante&background=3b82f6&color=fff&size=200', null],
  [3, 'buyer',  'Maria Fernanda',     'mariafernanda',   'maria@equus.dev',   hash, '81999887766', 'Apaixonada por cavalos e equitação. Praticante de dressage.', 'Recife', 'PE', 0, 'https://ui-avatars.com/api/?name=Maria+Fernanda&background=ec4899&color=fff&size=200', null],
  [4, 'haras',  'Haras Santa Clara',  'harassantaclara', 'santa@equus.dev',   hash, '62998765432', 'Criadores de cavalos de elite para hipismo e dressage.', 'Goiânia', 'GO', 1, 'https://ui-avatars.com/api/?name=Haras+Santa+Clara&background=8b5cf6&color=fff&size=200', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80'],
  [5, 'seller', 'Pedro Alves',        'pedroalves',      'pedro@equus.dev',   hash, '71996543210', 'Vendedor de cavalos crioulos. Parceiro da ACBC.', 'Salvador', 'BA', 0, 'https://ui-avatars.com/api/?name=Pedro+Alves&background=f59e0b&color=fff&size=200', null],
]

for (const u of users) {
  await db.execute(
    'INSERT IGNORE INTO users (id, type, name, username, email, password_hash, whatsapp, bio, city, state, verified, avatar_url, cover_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
    u
  )
}
console.log('✓ Usuários inseridos')

// Cavalos
const horses = [
  [1, 1, 'Relâmpago da Serra', 'Quarto de Milha', 'Alazão Tostado', 'Macho', 5, 3, 85000, 1, 'Vaquejada', 'MG', 'Uberlândia', 'Animal excepcional com ótimo preparo para vaquejada. Filho do famoso Três Corações. Muito manso e dócil.', 1, 1, '2024-11-15', 1, '2024-10-02', 1, 'Três Corações', 'Estrela do Sul', null, null, 1, 'ABQM', 'ABQM-2019-45231', 347],
  [2, 1, 'Trovão de Fogo', 'Quarto de Milha', 'Castanho Escuro', 'Macho', 7, 0, 55000, 1, 'Laço', 'MG', 'Uberlândia', 'Cavalo experiente para laço comprido. Participou de mais de 30 rodeios.', 1, 1, '2024-09-10', 1, '2024-08-20', 1, 'Trovão Real', 'Lua Cheia', null, null, 1, 'ABQM', 'ABQM-2017-33189', 215],
  [3, 2, 'Marchador das Estrelas', 'Mangalarga Marchador', 'Tordilho', 'Macho', 4, 6, 120000, 0, 'Cavalgada', 'SP', 'Campinas', 'Marchador de elite com andamento perfeito. Filho de campeão nacional.', 1, 1, '2024-10-01', 1, '2024-09-15', 1, 'Imperador das Gerais', 'Princesa Marchante', null, null, 1, 'ABCCMM', 'ABCCMM-2020-18765', 423],
  [4, 2, 'Nuvem Dourada', 'Mangalarga Marchador', 'Palomino', 'Fêmea', 3, 0, 95000, 1, 'Reprodução', 'SP', 'Campinas', 'Égua de reprodução com pedigree impecável. Prenhez confirmada.', 1, 0, null, 1, '2024-10-15', 1, 'Rei do Marchão', 'Flor de Ipê', null, null, 1, 'ABCCMM', 'ABCCMM-2021-20341', 189],
  [5, 4, 'Lusitano Imperial', 'Lusitano', 'Cinza', 'Macho', 8, 2, 280000, 0, 'Dressage', 'GO', 'Goiânia', 'Lusitano importado de Portugal. Treinado até Grand Prix de Dressage.', 1, 1, '2024-11-01', 1, '2024-10-28', 1, 'Dom Quixote VII', 'Princesa Lusitana', null, null, 1, 'APSL', 'APSL-2016-09823', 612],
  [6, 4, 'Andaluz do Sol', 'Lusitano', 'Baio', 'Macho', 6, 4, 195000, 1, 'Hipismo', 'GO', 'Goiânia', 'Cavalo de hipismo com excelente desempenho em obstáculos. Altura 1,70m.', 1, 1, '2024-10-05', 1, '2024-09-22', 1, 'Sol de Andaluzia', 'Brisa Ibérica', null, null, 1, 'APSL', 'APSL-2018-11204', 298],
  [7, 5, 'Crioulo Gaúcho', 'Crioulo', 'Overo', 'Macho', 9, 0, 35000, 1, 'Laço', 'BA', 'Salvador', 'Crioulo legítimo de trabalho. Excelente para lida campeira.', 1, 1, '2024-08-15', 0, null, 1, null, null, null, null, 1, 'ACBC', 'ACBC-2015-55678', 178],
  [8, 5, 'Pampa da Corcunda', 'Crioulo', 'Pampa', 'Fêmea', 5, 8, 48000, 1, 'Cavalgada', 'BA', 'Salvador', 'Linda égua pampa com temperamento dócil. Ideal para iniciantes.', 1, 1, '2024-09-01', 1, '2024-08-10', 1, 'Pampeiro Clássico', 'Estrelinha do Sul', null, null, 0, null, null, 156],
]

for (const h of horses) {
  await db.execute(
    `INSERT IGNORE INTO horses
      (id, owner_id, name, breed, color, gender, age_years, age_months, price, negotiable, horse_function, state, city, description,
       has_gta, has_mormo_exam, mormo_exam_date, has_coggins, coggins_date, has_vaccination,
       sire, dam, sire_sire, dam_dam, registered, registration_entity, registration_number, views)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    h
  )
}
console.log('✓ Cavalos inseridos')

// Horse images
const imgs = [
  [1, 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&q=80', 0, 1],
  [1, 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=900&q=80', 1, 0],
  [2, 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=900&q=80', 0, 1],
  [3, 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=900&q=80', 0, 1],
  [3, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80', 1, 0],
  [4, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&q=80', 0, 1],
  [5, 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&q=80', 0, 1],
  [5, 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=900&q=80', 1, 0],
  [6, 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=900&q=80', 0, 1],
  [7, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80', 0, 1],
  [8, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&q=80', 0, 1],
  [8, 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=900&q=80', 1, 0],
]

for (const [hid, url, order, is_cover] of imgs) {
  await db.execute('INSERT IGNORE INTO horse_images (horse_id, url, order_index, is_cover) VALUES (?,?,?,?)', [hid, url, order, is_cover])
}
console.log('✓ Imagens dos cavalos inseridas')

// Posts
const posts = [
  [1, 1, 1, 'Hoje o Relâmpago da Serra treinou forte! Preparando para o próximo campeonato de vaquejada. Ele está em excelente forma! 🐴🏆', 'text'],
  [2, 2, 3, 'Novo vídeo do Marchador das Estrelas disponível! Andamento perfeito, filho de campeão nacional. Entre em contato para agendar visita.', 'text'],
  [3, 4, 5, 'O Lusitano Imperial passou no exame veterinário com louvor! Pronto para nova temporada de competições. Que animal extraordinário 🌟', 'text'],
  [4, 1, null, 'Haras Boa Vista completa 20 anos de história! Obrigado a todos os clientes e parceiros. Continuaremos criando campeões! 🎉', 'text'],
  [5, 3, null, 'Primeira aula de dressage do meu novo cavalo. Muito nervosa mas ele foi incrível! Amor à primeira montada 💕', 'text'],
  [6, 5, 7, 'Crioulo Gaúcho participou do laço e se saiu muito bem! Orgulho desse animal. 🤠', 'text'],
  [7, 2, null, 'Dica do dia: a alimentação correta é fundamental para a performance do seu cavalo. Consulte sempre um veterinário! #Equus', 'text'],
  [8, 4, 6, 'Andaluz do Sol foi aprovado para competição de hipismo de julho. Primeiro lugar à vista! 🥇', 'text'],
]

for (const [id, uid, hid, content, type] of posts) {
  await db.execute('INSERT IGNORE INTO posts (id, user_id, horse_id, content, type) VALUES (?,?,?,?,?)', [id, uid, hid, content, type])
}
console.log('✓ Posts inseridos')

// Post images
const postImgs = [[1, 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80', 0], [3, 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=800&q=80', 0]]
for (const [pid, url, order] of postImgs) {
  await db.execute('INSERT IGNORE INTO post_images (post_id, url, order_index) VALUES (?,?,?)', [pid, url, order])
}

// Follows
const follows = [[2,1],[3,1],[3,2],[5,1],[5,4],[1,4],[4,1],[2,4]]
for (const [a, b] of follows) await db.execute('INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?,?)', [a, b])
console.log('✓ Follows inseridos')

// Likes
const likes = [[2,1],[3,1],[4,1],[5,1],[1,2],[3,2],[5,2],[2,3],[3,3],[2,4],[3,4],[4,4],[5,4],[1,5],[2,5],[4,5],[1,6],[3,6],[1,7],[3,7],[4,7],[5,7]]
for (const [uid, pid] of likes) await db.execute('INSERT IGNORE INTO likes (user_id, post_id) VALUES (?,?)', [uid, pid])
console.log('✓ Likes inseridos')

// Saved horses
const saved = [[3,1],[3,5],[3,6],[2,5],[2,6],[5,3],[5,4]]
for (const [uid, hid] of saved) await db.execute('INSERT IGNORE INTO saved_horses (user_id, horse_id) VALUES (?,?)', [uid, hid])
console.log('✓ Salvos inseridos')

await db.execute('SET FOREIGN_KEY_CHECKS = 1')
await db.end()

console.log('\n✅ Seed concluído com sucesso!')
console.log('\nContas de teste (senha: senha123):')
console.log('  haras@equus.dev  → Haras Boa Vista')
console.log('  joao@equus.dev   → João Cavalcante (seller)')
console.log('  maria@equus.dev  → Maria Fernanda (buyer)')
console.log('  santa@equus.dev  → Haras Santa Clara')
console.log('  pedro@equus.dev  → Pedro Alves (seller)')
