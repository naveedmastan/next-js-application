export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: Address
  company: Company
}

export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

export interface Geo {
  lat: string
  lng: string
}

export interface Company {
  name: string
  catchPhrase: string
  bs: string
}

// Form-specific types
export interface CreateUserData extends Omit<User, 'id'> {}

export interface UpdateUserData extends Partial<Omit<User, 'id'>> {}

// API response types
export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
}
