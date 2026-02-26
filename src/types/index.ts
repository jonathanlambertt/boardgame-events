export type Event = {
  id: string
  title: string
  host_name: string
  host_email: string
  location: string
  scheduled_at: string
  total_players: number
  notes: string | null
  game_type: string
  image_url: string
  created_at: string
}

export type Attendee = {
  id: string
  event_id: string
  email: string
  joined_at: string
}
