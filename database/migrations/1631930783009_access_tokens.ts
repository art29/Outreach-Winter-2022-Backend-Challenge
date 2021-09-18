import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccessTokens extends BaseSchema {
  protected tableName = 'access_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('access_token')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
