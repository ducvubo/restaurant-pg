'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
export async function deleteCookiesAndRedirect() {
  cookies().delete('access_token_rtr')
  cookies().delete('refresh_token_rtr')
  cookies().delete('access_token_epl')
  cookies().delete('refresh_token_epl')
  redirect('/auth/login')
}

export async function deleteCookiesAndRedirectGuest() {
  cookies().delete('access_token_guest')
  cookies().delete('refresh_token_guest')
  redirect('/')
}

export const getCookie = async (name: string) => {
  return await cookies().get(name)?.value
}
