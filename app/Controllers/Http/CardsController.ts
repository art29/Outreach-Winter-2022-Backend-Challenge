import Door from 'App/Models/Door'
import { v4 as uuidv4 } from 'uuid'
import AccessToken from 'App/Models/AccessToken'
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CardsController {
  public async create({ request, response }: HttpContextContract) {
    // Cast body to string
    request.updateBody(CardsController.castBodyToString(request.body(), ['doorIds']))

    // Schema to validate the format
    const createSchema = schema.create({
      doorIds: schema.array().members(schema.string()),
    })

    // Making the validation
    const payload = await request.validate({
      schema: createSchema,
      messages: {
        required: 'The doorIds are required for this endpoint',
      },
    })

    // Giving errors if there is nothing in the array
    if (payload.doorIds.length === 0) {
      response.status(422)
      return { error: 'No door ids in the body' }
    }

    // Creating the array of Doors
    const doorModelIds: Door[] = []

    // Creating all doors that are not existent and needed for this access token
    for (let doorId of payload.doorIds) {
      doorModelIds.push(await Door.firstOrCreate({ door_identifier: doorId }))
    }

    // Generating the access token and sending it to DB
    let access_token = await AccessToken.create({ access_token: uuidv4() })

    // Adding doors to the access token
    await access_token.related('doors').saveMany(doorModelIds)

    response.status(201)

    // Returning the access token to the user
    return { accessToken: access_token.access_token }
  }

  public async validate({ request }: HttpContextContract) {
    // Cast body to string
    request.updateBody(CardsController.castBodyToString(request.body(), ['doorId', 'accessToken']))

    // Schema to validate the format
    const validateSchema = schema.create({
      doorId: schema.string(),
      accessToken: schema.string(),
    })

    // Making the validation
    let payload = await request.validate({
      schema: validateSchema,
      messages: {
        required: 'The {{ field }} is required for this endpoint',
      },
    })

    // Checking if token exists and fails if doesn't
    const token = await AccessToken.findBy('access_token', payload.accessToken)

    if (token === null) {
      return { access: 'failed' }
    }

    // Grants access if doorId exists and fails if doesn't
    let door = await token.related('doors').query().where('door_identifier', payload.doorId).first()
    if (door == null) {
      return { access: 'failed' }
    } else {
      return { access: 'granted' }
    }
  }

  private static castBodyToString(body, arrayToCast: string[]) {
    // Cast up to 2 levels the body to strings to only have one type to use

    for (let el of arrayToCast) {
      try {
        if (body[el] !== undefined) {
          if (Array.isArray(body[el])) {
            body[el] = body[el].map(String)
          } else {
            body[el] = String(body[el])
          }
        }
      } catch (Error) {
        console.log('An error occured while casting to String : ', Error)
      } finally {
      }
    }

    return body
  }
}
