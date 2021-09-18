import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccessTokenDoors extends BaseSchema {
  protected tableName = 'access_token_door'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('access_token_id').unsigned().references('access_tokens.id')
      table.integer('door_id').unsigned().references('doors.id')
      table.unique(['access_token_id', 'door_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
