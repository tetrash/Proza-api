export interface DataMapper<Domain, Entity> {
  toDomain(entity: Entity): Domain;
  toEntity(domain: Domain): Entity;
}
