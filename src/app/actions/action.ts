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
