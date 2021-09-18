import test from 'japa'
import supertest from 'supertest'
import { validate as uuidValidate } from 'uuid'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('create_with_one_item', async (assert) => {
    await supertest(BASE_URL)
      .post('/create')
      .send({ doorIds: [1] })
      .expect(201)
      .then((response) => {
        assert.isTrue(uuidValidate(response.body['accessToken']))
      })
  })

  test('create_with_multiple_items', async (assert) => {
    await supertest(BASE_URL)
      .post('/create')
      .send({ doorIds: [2, 3, 4] })
      .expect(201)
      .then((response) => {
        assert.isTrue(uuidValidate(response.body['accessToken']))
      })
  })

  test('create_with_strings_and_ints', async (assert) => {
    await supertest(BASE_URL)
      .post('/create')
      .send({ doorIds: ['12421', 5] })
      .expect(201)
      .then((response) => {
        assert.isTrue(uuidValidate(response.body['accessToken']))
      })
  })

  test('create_with_no_items', async (assert) => {
    await supertest(BASE_URL)
      .post('/create')
      .send({ doorIds: [] })
      .expect(422)
      .then((response) => {
        assert.equal(response.body['error'], 'No door ids in the body')
      })
  })

  test('create_with_no_params', async () => {
    await supertest(BASE_URL).post('/create').send({}).expect(422)
  })

  test('create_with_other_type', async () => {
    await supertest(BASE_URL).post('/create').send({ doorIds: false }).expect(422)
  })
})

test.group('Validate', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('validate_missing_both_params', async () => {
    await supertest(BASE_URL).post('/validate').send({}).expect(422)
  })

  test('validate_missing_accessToken', async () => {
    await supertest(BASE_URL).post('/validate').send({ doorId: 10 }).expect(422)
  })

  test('validate_missing_doorId', async () => {
    await supertest(BASE_URL)
      .post('/validate')
      .send({ doorId: '23264d31-2b66-4899-b02b-df4827b8ffbc' })
      .expect(422)
  })

  test('validate_token_not_valid', async (assert) => {
    await supertest(BASE_URL)
      .post('/validate')
      .send({ doorId: 11, accessToken: '23264d31-2b66-4899-b02b-df4827b8ffbc' })
      .expect(200)
      .then((response) => {
        assert.equal(response.body['access'], 'failed')
      })
  })

  test('validate_door_not_valid', async (assert) => {
    await supertest(BASE_URL)
      .post('/create')
      .send({ doorIds: [12] })
      .expect(201)
      .then(async (response) => {
        await supertest(BASE_URL)
          .post('/validate')
          .send({
            doorId: 24142,
            accessToken: response.body['accessToken'],
          })
          .expect(200)
          .then((response) => {
            assert.equal(response.body['access'], 'failed')
          })
      })
  })

  test('validate_works_with_int', async (assert) => {
    await supertest(BASE_URL)
      .post('/create')
      .send({ doorIds: [13] })
      .expect(201)
      .then(async (response) => {
        await supertest(BASE_URL)
          .post('/validate')
          .send({
            doorId: 13,
            accessToken: response.body['accessToken'],
          })
          .expect(200)
          .then((response) => {
            assert.equal(response.body['access'], 'granted')
          })
      })
  })

  test('validate_works_with_string', async (assert) => {
    await supertest(BASE_URL)
      .post('/create')
      .send({ doorIds: ['14', '15'] })
      .expect(201)
      .then(async (response) => {
        await supertest(BASE_URL)
          .post('/validate')
          .send({
            doorId: '14',
            accessToken: response.body['accessToken'],
          })
          .expect(200)
          .then((response) => {
            assert.equal(response.body['access'], 'granted')
          })
      })
  })
})
