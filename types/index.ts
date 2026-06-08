export type UserType = 'buyer' | 'seller' | 'haras'
export type HorseStatus = 'active' | 'sold' | 'paused' | 'draft'
export type HorseGender = 'Macho' | 'Fêmea' | 'Castrado'
export type MessageType = 'text' | 'image' | 'whatsapp_redirect'

export interface User {
  id: number
  type: UserType
  name: string
  username: string
  email: string
  phone?: string
  whatsapp?: string
  avatar_url?: string
  cover_url?: string
  bio?: string
  city?: string
  state?: string
  verified: boolean
  created_at: string
}

export interface HorseImage {
  id: number
  horse_id: number
  url: string
  order_index: number
  is_cover: boolean
}

export interface Horse {
  id: number
  owner_id: number
  name: string
  breed: string
  color: string
  gender: HorseGender
  age_years: number
  age_months: number
  price?: number
  negotiable: boolean
  horse_function?: string
  status: HorseStatus
  state: string
  city?: string
  description?: string
  has_gta: boolean
  has_mormo_exam: boolean
  mormo_exam_date?: string
  has_coggins: boolean
  coggins_date?: string
  has_vaccination: boolean
  sire?: string
  dam?: string
  sire_sire?: string
  dam_dam?: string
  registered: boolean
  registration_entity?: string
  registration_number?: string
  views: number
  created_at: string
  images: HorseImage[]
  owner: User
  saved?: boolean
  likes_count?: number
}

export interface Post {
  id: number
  user_id: number
  horse_id?: number
  content?: string
  type: 'text' | 'image' | 'video' | 'listing'
  created_at: string
  user: User
  horse?: Pick<Horse, 'id' | 'name' | 'breed' | 'images'>
  images: { url: string; order_index: number }[]
  likes_count: number
  liked: boolean
  comments_count: number
}

export interface Conversation {
  id: number
  horse_id?: number
  buyer_id: number
  seller_id: number
  last_message_at: string
  horse?: Pick<Horse, 'id' | 'name' | 'images'>
  other_user: User
  last_message?: string
  unread_count: number
}

export interface Message {
  id: number
  conversation_id: number
  sender_id: number
  content: string
  type: MessageType
  read_at?: string
  created_at: string
}

export interface HorseFilters {
  breed?: string
  color?: string
  function?: string
  state?: string
  minPrice?: number
  maxPrice?: number
  gender?: HorseGender
  registered?: boolean
  has_mormo?: boolean
  query?: string
}
