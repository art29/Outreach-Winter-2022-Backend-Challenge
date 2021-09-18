import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import AccessToken from 'App/Models/AccessToken'

export default class Door extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public door_identifier: string

  @manyToMany(() => AccessToken)
  public access_tokens: ManyToMany<typeof AccessToken>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
