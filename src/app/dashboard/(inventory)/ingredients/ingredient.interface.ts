import { ICatIngredient } from '../cat-ingredients/cat-ingredient.interface'
import { IUnit } from '../units/unit.interface'

export interface IIngredient {
  food_image(food_image: any): unknown
  igd_id: string
  igd_res_id?: string
  cat_igd_id?: string | ICatIngredient
  unt_id?: string | IUnit
  igd_name: string
  igd_image: string
  igd_description?: string
  igd_status?: 'enable' | 'disable'
}
