import Door from 'App/Models/Door'
import {v4 as uuidv4} from 'uuid';
import AccessToken from 'App/Models/AccessToken'
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CardsController {

  public async create({ request, response } : HttpContextContract) {

    // Schema to validate the format
    const createSchema = schema.create({
      door_ids: schema.array().anyMembers(),
    })

    // Making the validation
    const paylod = await request.validate({ schema: createSchema });

    // Creating the array of Doors
    const door_model_ids : Door[] = []

    // Creating all doors that are not existent and needed for this access token
    for (let door_id of paylod.door_ids) {
      door_model_ids.push(await Door.firstOrCreate({door_id: door_id}))
    }

    // Generating the access token and sending it to DB
    let access_token = await AccessToken.create({access_token: uuidv4()})

    // Adding doors to the access token
    access_token.related('doors').saveMany(door_model_ids)

    response.status(201)

    // Returning the access token to the user
    return {'access_token': access_token.access_token}
  }

  public async validate({ request } : HttpContextContract) {
    // Schema to validate the format
    const validateSchema = schema.create({
      door_id: schema.string({ trim: true }),
      access_token: schema.string({ trim: true })
    })

    // Making the validation
    let payload = await request.validate({ schema: validateSchema })

    // Checking if token exists and fails if doesn't
    const token = await AccessToken.findBy('access_token', payload.access_token)

    if (token == null) {
      return {"access": "failed"}
    }

    // Grants access if door_id exists and fails if doesn't
    if (token.related('doors').query().where('door_id', payload.door_id).first() == null) {
      return {"access": "failed"}
    } else {
      return {"access": "granted"}
    }

  }

}
