import { Request, Response } from "express";
import knex from "../database/connection";


class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, item } = request.query;

    const parsedItems = String(item).split(',').map(item => Number(item.trim()));

    const point = await knex('points')
    .join('points_items', 'points.id', '=', 'points_items.point_id')
    .whereIn('points_items.item_id', parsedItems)
    .where('points.city', String(city))
    .where('points.uf', String(uf))
    .select('points.*');
  }
  
  async create(request: Request, response: Response) {
   
    const { 
      name, 
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;
  
    const trx = await knex.transaction();
    
    const point = {
      image: 'image-fake',
      name, 
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    const insertedIds = await trx('poins').insert(point);
  
    const point_id = insertedIds[0];
  
    const pointsItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id
      }
    });
  
    await trx('points_items').insert(pointsItems);

    trx.commit();
  
    return response.json({
      id: point_id,
      ...point
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.json({message: 'Point not found'});
    }

    const items = await knex('items')
    .join('points_items', 'items.id', '=', 'points_items.item_id')
    .where('points_items.point_id', id)
    .select('items.title');

    return response.json({point, items});
  }

}

export default PointsController;