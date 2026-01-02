import { Test, TestingModule } from '@nestjs/testing';
import { FilaController } from './fila.controller';

describe('FilaController', () => {
  let controller: FilaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilaController],
    }).compile();

    controller = module.get<FilaController>(FilaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
