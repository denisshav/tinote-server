export type note = {
  _id: string
  title: string
  content: string
  folder: string
  date: Date
}

export type folder = {
  name: string
  color: string
  _id: string
  icon: string
}

export type user = {
  _id: string
  email: string
  password: string
}
