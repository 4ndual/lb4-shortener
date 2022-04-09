import {Entity, model, property} from '@loopback/repository';

@model()
export class Url extends Entity {
  @property({
    type: 'string',
    required: false,
    id: true,
  })
  urlCode: string;

  @property({
    type: 'string',
    required: true,
  })
  longUrl: string;

  @property({
    type: 'string',
    required: false,
  })
  shortUrl: string;

  @property({
    type: 'date',
    equired: false,
  })
  date: string;


  constructor(data?: Partial<Url>) {
    super(data);
  }
}

export interface UrlRelations {
  // describe navigational properties here
}

export type UrlWithRelations = Url & UrlRelations;
