export interface DB<Entity, CreateDTO, UpdateDTO> {
  create: (dto: CreateDTO) => Entity;
  findAll: () => Entity[];
  findOne: (id: string) => Entity | undefined;
  update: (id: string, dto: UpdateDTO) => Entity;
  remove: (id: string) => void;
}
