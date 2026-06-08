-- ============================================================
--  EQUUS — Schema MySQL (Hostinger)
--  Gerado para MVP: Marketplace + Rede Social Equestre
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  type          ENUM('buyer','seller','haras') NOT NULL DEFAULT 'buyer',
  name          VARCHAR(255)     NOT NULL,
  username      VARCHAR(100)     NOT NULL,
  email         VARCHAR(255)     NOT NULL,
  password_hash VARCHAR(255)     NOT NULL,
  phone         VARCHAR(20)      DEFAULT NULL,
  whatsapp      VARCHAR(20)      DEFAULT NULL,
  avatar_url    VARCHAR(600)     DEFAULT NULL,
  cover_url     VARCHAR(600)     DEFAULT NULL,
  bio           TEXT             DEFAULT NULL,
  city          VARCHAR(100)     DEFAULT NULL,
  state         CHAR(2)          DEFAULT NULL,
  verified      TINYINT(1)       NOT NULL DEFAULT 0,
  is_active     TINYINT(1)       NOT NULL DEFAULT 1,
  created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_username (username),
  UNIQUE KEY uq_email    (email),
  INDEX idx_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- HORSES (anúncios)
-- ------------------------------------------------------------
CREATE TABLE horses (
  id                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  owner_id            INT UNSIGNED  NOT NULL,

  -- Identificação
  name                VARCHAR(255)  NOT NULL,
  breed               VARCHAR(100)  NOT NULL,   -- raça
  color               VARCHAR(100)  NOT NULL,   -- pelagem
  gender              ENUM('Macho','Fêmea','Castrado') NOT NULL,
  age_years           TINYINT UNSIGNED DEFAULT 0,
  age_months          TINYINT UNSIGNED DEFAULT 0,

  -- Comercial
  price               DECIMAL(12,2) DEFAULT NULL,
  negotiable          TINYINT(1)    NOT NULL DEFAULT 1,
  horse_function      VARCHAR(100)  DEFAULT NULL,  -- vaquejada, laço, dressage…
  status              ENUM('active','sold','paused','draft') NOT NULL DEFAULT 'active',

  -- Localização
  state               CHAR(2)       NOT NULL,
  city                VARCHAR(100)  DEFAULT NULL,

  -- Descrição livre
  description         TEXT          DEFAULT NULL,

  -- Documentação / Exames
  has_gta             TINYINT(1)    NOT NULL DEFAULT 0,
  has_mormo_exam      TINYINT(1)    NOT NULL DEFAULT 0,
  mormo_exam_date     DATE          DEFAULT NULL,
  has_coggins         TINYINT(1)    NOT NULL DEFAULT 0,
  coggins_date        DATE          DEFAULT NULL,
  has_vaccination     TINYINT(1)    NOT NULL DEFAULT 0,

  -- Pedigree / Genealogia
  sire                VARCHAR(255)  DEFAULT NULL,  -- pai
  dam                 VARCHAR(255)  DEFAULT NULL,  -- mãe
  sire_sire           VARCHAR(255)  DEFAULT NULL,  -- avô paterno
  dam_dam             VARCHAR(255)  DEFAULT NULL,  -- avó materna
  registered          TINYINT(1)    NOT NULL DEFAULT 0,
  registration_entity VARCHAR(100)  DEFAULT NULL,  -- ABQM, ABCCMM…
  registration_number VARCHAR(100)  DEFAULT NULL,

  -- Métricas
  views               INT UNSIGNED  NOT NULL DEFAULT 0,

  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_horse_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_owner         (owner_id),
  INDEX idx_status        (status),
  INDEX idx_breed         (breed),
  INDEX idx_color         (color),
  INDEX idx_function      (horse_function),
  INDEX idx_state         (state),
  INDEX idx_price         (price),
  INDEX idx_created       (created_at),
  FULLTEXT INDEX ft_horse (name, description, breed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- HORSE IMAGES
-- ------------------------------------------------------------
CREATE TABLE horse_images (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  horse_id    INT UNSIGNED  NOT NULL,
  url         VARCHAR(600)  NOT NULL,
  order_index TINYINT UNSIGNED NOT NULL DEFAULT 0,
  is_cover    TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_img_horse FOREIGN KEY (horse_id) REFERENCES horses(id) ON DELETE CASCADE,
  INDEX idx_horse_img (horse_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SAVED HORSES (favoritos)
-- ------------------------------------------------------------
CREATE TABLE saved_horses (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  horse_id   INT UNSIGNED  NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_saved (user_id, horse_id),
  CONSTRAINT fk_saved_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_saved_horse FOREIGN KEY (horse_id) REFERENCES horses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- FOLLOWS (rede social)
-- ------------------------------------------------------------
CREATE TABLE follows (
  follower_id  INT UNSIGNED NOT NULL,
  following_id INT UNSIGNED NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT fk_follower  FOREIGN KEY (follower_id)  REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_following FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_following (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- POSTS (feed social)
-- ------------------------------------------------------------
CREATE TABLE posts (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  horse_id   INT UNSIGNED  DEFAULT NULL,   -- cavalo tagueado/vinculado (opcional)
  content    TEXT          DEFAULT NULL,
  type       ENUM('text','image','video','listing') NOT NULL DEFAULT 'text',
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_post_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_post_horse FOREIGN KEY (horse_id) REFERENCES horses(id) ON DELETE SET NULL,
  INDEX idx_post_user    (user_id),
  INDEX idx_post_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- POST IMAGES
-- ------------------------------------------------------------
CREATE TABLE post_images (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id     INT UNSIGNED NOT NULL,
  url         VARCHAR(600) NOT NULL,
  order_index TINYINT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  CONSTRAINT fk_pimg_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_post_img (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- POST TAGS (@ menção de usuários e cavalos)
-- ------------------------------------------------------------
CREATE TABLE post_tags (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id         INT UNSIGNED NOT NULL,
  tagged_user_id  INT UNSIGNED DEFAULT NULL,
  tagged_horse_id INT UNSIGNED DEFAULT NULL,

  PRIMARY KEY (id),
  CONSTRAINT fk_tag_post  FOREIGN KEY (post_id)         REFERENCES posts(id)  ON DELETE CASCADE,
  CONSTRAINT fk_tag_user  FOREIGN KEY (tagged_user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_tag_horse FOREIGN KEY (tagged_horse_id) REFERENCES horses(id) ON DELETE CASCADE,
  INDEX idx_tag_post (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- LIKES (posts e cavalos)
-- ------------------------------------------------------------
CREATE TABLE likes (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  post_id    INT UNSIGNED DEFAULT NULL,
  horse_id   INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_post_like  (user_id, post_id),
  UNIQUE KEY uq_horse_like (user_id, horse_id),
  CONSTRAINT fk_like_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_like_post  FOREIGN KEY (post_id)  REFERENCES posts(id)  ON DELETE CASCADE,
  CONSTRAINT fk_like_horse FOREIGN KEY (horse_id) REFERENCES horses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- CONVERSATIONS (uma conversa por [buyer + seller + horse])
-- ------------------------------------------------------------
CREATE TABLE conversations (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  horse_id        INT UNSIGNED DEFAULT NULL,
  buyer_id        INT UNSIGNED NOT NULL,
  seller_id       INT UNSIGNED NOT NULL,
  last_message_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_conversation (buyer_id, seller_id, horse_id),
  CONSTRAINT fk_conv_horse  FOREIGN KEY (horse_id)  REFERENCES horses(id) ON DELETE SET NULL,
  CONSTRAINT fk_conv_buyer  FOREIGN KEY (buyer_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_conv_seller FOREIGN KEY (seller_id) REFERENCES users(id)  ON DELETE CASCADE,
  INDEX idx_conv_buyer       (buyer_id),
  INDEX idx_conv_seller      (seller_id),
  INDEX idx_conv_last_msg    (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- MESSAGES
-- ------------------------------------------------------------
CREATE TABLE messages (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id INT UNSIGNED NOT NULL,
  sender_id       INT UNSIGNED NOT NULL,
  content         TEXT         NOT NULL,
  type            ENUM('text','image','whatsapp_redirect') NOT NULL DEFAULT 'text',
  read_at         TIMESTAMP    DEFAULT NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_msg_conv   FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id)       REFERENCES users(id)         ON DELETE CASCADE,
  INDEX idx_msg_conv    (conversation_id),
  INDEX idx_msg_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
CREATE TABLE notifications (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  type        ENUM('like','comment','follow','message','new_horse') NOT NULL,
  actor_id    INT UNSIGNED DEFAULT NULL,   -- quem gerou a notificação
  horse_id    INT UNSIGNED DEFAULT NULL,
  post_id     INT UNSIGNED DEFAULT NULL,
  read_at     TIMESTAMP    DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_notif_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_notif_actor FOREIGN KEY (actor_id) REFERENCES users(id)  ON DELETE SET NULL,
  INDEX idx_notif_user    (user_id),
  INDEX idx_notif_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
