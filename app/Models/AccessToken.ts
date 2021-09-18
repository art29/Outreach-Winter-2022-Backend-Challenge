import { DateTime } from 'luxon'
import Door from 'App/Models/Door'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class AccessToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public access_token: string

  @manyToMany(() => Door)
  public doors: ManyToMany<typeof Door>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
