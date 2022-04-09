import {
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  put,
  del,
  requestBody,
  response,RestBindings,RequestContext, RequestBody, Response, ErrorWriterOptions, LogError, HttpErrors
} from '@loopback/rest';
import {Url} from '../models';
import {UrlRepository} from '../repositories';
import { nanoid } from 'nanoid'
import {inject} from '@loopback/core';
import validUrl from 'valid-url';
require('dotenv').config()

export class UrlController {
  
  constructor(
    @inject(RestBindings.SequenceActions.LOG_ERROR)
    protected logError: LogError,
    @inject(RestBindings.Http.CONTEXT)
    protected reqContext: RequestContext,
    @repository(UrlRepository)
    public urlRepository : UrlRepository,
    @inject(RestBindings.ERROR_WRITER_OPTIONS, {optional: true})
    protected errorWriterOptions?: ErrorWriterOptions,
  ) {}

  @post('/short')
  @response(200, {
    description: 'Url model instance',
    content: {'application/json': {schema: getModelSchemaRef(Url)}},
  })
  
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Url, {
            title: 'NewUrl',
            
          }),
        },
      },
    })
    url: Url,
  
  ): Promise<Url | Response> {
    

    const {longUrl}= url
    const res= await this.urlRepository.findOne({ where: { longUrl: longUrl } })
    if (res){
      return res
    }else{
    
      const urlCode = nanoid(12)
      const shortUrl = process.env.host  + '/' + urlCode
      const date:any= new Date()
      if (!validUrl.isUri(shortUrl)) {
        const result:Response=this.reqContext.response.status(401).json('Invalid base url');
        return result
      }
      if (!validUrl.isUri(longUrl)) {
        const result:Response=this.reqContext.response.status(401).json('Invalid long ure');
        return result
      }
      return this.urlRepository.create({urlCode,longUrl,shortUrl,date})
    }
    
  }
  
  

  @get('/short')
  @response(200, {
    description: 'Array of Url model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Url, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Url) filter?: Filter<Url>,
  ): Promise<Url[]> {
    
    console.log( this.urlRepository)
    return this.urlRepository.find(filter);
  }

  @get('/{id}')
 
  @response(200, {
    description: 'Url model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Url, {includeRelations: true}),
      },
    },
    
  })
  async redi(
    @param.path.string('id') id: string,
    @param.filter(Url, {exclude: 'where'}) filter?: FilterExcludingWhere<Url>
  ): Promise<Url> {

    const  result:Url =  await this.urlRepository.findById(id, filter)

    if (result){
   
        this.reqContext.response.redirect(result.longUrl)
      }
    
    return result  
  }

  @get('/short/{id}')
  @response(200, {
    description: 'Url model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Url, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Url, {exclude: 'where'}) filter?: FilterExcludingWhere<Url>
  ): Promise<Url> {

    return await this.urlRepository.findById(id, filter)

   
  }

  @put('/short/{id}')
  @response(204, {
    description: 'Url PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() url: Url,
  ): Promise<void> {
    await this.urlRepository.replaceById(id, url);
  }

  @del('/short/{id}')
  @response(204, {
    description: 'Url DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.urlRepository.deleteById(id);
  }
}





