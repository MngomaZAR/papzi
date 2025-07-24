export interface User {
  id: string;
  email: string;
  role: 'client' | 'photographer' | 'admin';
  profile: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  verified: boolean;
  rating?: number;
  total_bookings?: number;
}

export interface Photographer extends UserProfile {
  specialties: string[];
  portfolio_images: string[];
  hourly_rate: number;
  availability: AvailabilitySlot[];
  reviews: Review[];
  badges: string[];
}

export interface AvailabilitySlot {
  id: string;
  photographer_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export interface Booking {
  id: string;
  client_id: string;
  photographer_id: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  special_requests?: string;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  client_id: string;
  photographer_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface PaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  signature?: string;
}