const baseURL = import.meta.env.VITE_API_URL

export const getImageUrl = (path?: string) => {
  if (!path) {
    return "https://res.cloudinary.com/dvaoigpfv/image/upload/v1774317968/profile-default_opxczd.png"
  }

  return path.startsWith("http")
    ? path
    : `${baseURL}${path}`
}