import { Request, Response } from "express";
import knex from "../database/connection";


class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
    .split(',')
    .map(item => Number(item.trim()));

    if(isNaN(Number(parsedItems))){
      const points = await knex('points')
      .orWhere('city', String(city))
      .orWhere('uf', String(uf))
      .distinct()
      .select('points.*');  

      return response.json(points);
    } 
    

    const points = await knex('points')
    .join('points_items', 'points.id', '=', 'points_items.point_id')
    .orWhereIn('points_items.item_id', parsedItems)
    .orWhere('city', String(city))
    .orWhere('uf', String(uf))
    .distinct()
    .select('points.*');

    const serialedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://192.168.1.3:3333/uploads/${point.img}`
      };
    });
    

    return response.json(serialedPoints);
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
      img: request.file.filename,
      name, 
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    const insertedIds = await trx('points').insert(point);
  
    const point_id = insertedIds[0];
  
    const pointsItems = items.split(',')
    .map((item: String) => Number(item.trim()))
    .map((item_id: number) => {
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
    
    const serialedPoints = {
      ...point,
      image_url: `http://192.168.1.3:3333/uploads/${point.img}`
    };

    const items = await knex('items')
    .join('points_items', 'items.id', '=', 'points_items.item_id')
    .where('points_items.point_id', id)
    .select('items.title');

    return response.json({point:serialedPoints, items});
  }

}

export default PointsController;