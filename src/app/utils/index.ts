export const isNumericString = (str: string) => {
  return /^[0-9]{10,}$/.test(str)
}
