import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Category_MODEL,
  CategoryDocument,
} from 'src/schemas/category/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category_MODEL)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll() {
    try {
      const categories = await this.categoryModel.find();
      return Object(categories);
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async findByType(type: string) {
    const category = await this.categoryModel.find({ type: type });

    if (!category) {
      return {
        status: false,
        message: 'Category Not Found',
      };
    }

    return category;
  }

  async addBikeToCategory(categoryId: string, newBikeData: any) {
    const category = await this.categoryModel.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category Not Found');
    }

    category.bikes.push(newBikeData);
    // console.log(category.bikes, 'bikes');
    const result = await category.save();
    return result;
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Job not found');
    }

    return category;
  }

  async findBike(bikeId: string) {
    try {
      const categories = await this.findAll();

      for (const category of categories) {
        const bike = category.bikes.find((b) => b._id.toString() === bikeId);
        if (bike) {
          return {
            status: true,
            message: 'Get Bike by Id SuccessFully',
            bike,
          };
        }
      }

      throw new NotFoundException('Bike not found');
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async findBikeUpdate(bikeId: string) {
    try {
      const categories = await this.findAll();
      for (const category of categories) {
        const bike = category.bikes.find((b) => b._id.toString() === bikeId);
        if (!bike) {
          return {
            status: false,
            message: 'Bike Data is Not Found',
          };
        } else if (bike.status === 'Deactivate') {
          bike.status = 'Active';
          category.markModified('bikes');
          await category.save();
          return {
            status: true,
            message: 'Bike status updated successfully',
            bike,
          };
        } else if (bike.status === 'Active') {
          bike.status = 'Deactivate';
          category.markModified('bikes');
          await category.save();
          return {
            status: true,
            message: 'Bike status updated successfully',
            bike,
          };
        } else {
          return {
            status: false,
            message: 'Bike Data is not Updated',
          };
        }
      }
      throw new NotFoundException('Bike not found');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow NotFoundException if it's already the specific error
      } else {
        throw new InternalServerErrorException(
          'An error occurred while updating bike status',
        );
      }
    }
  }

  async deleteBike(Id: string) {
    try {
      const categories = await this.findAll();
      for (const category of categories) {
        const index = category.bikes.findIndex((b) => b._id.toString() === Id);
        console.log(index);
        if (index !== -1) {
          category.bikes.splice(index, 1);
          await category.save();
          return { status: true, message: 'Bike deleted successfully' };
        }
      }
      throw new NotFoundException('Bike not found');
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async incrementStock(bikeId: string) {
    try {
      const categories = await this.findAll();

      for (const category of categories) {
        const bike = category.bikes.find((b) => b._id.toString() === bikeId);
        if (bike) {
          const bikeWithStock = bike as { stock: number };
          bikeWithStock.stock += 1;
          category.markModified('bikes');
          await category.save();
          return;
        }
      }

      throw new NotFoundException('Bike not found');
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async decrementStock(bikeId: string) {
    try {
      const categories = await this.findAll();
      for (const category of categories) {
        const bike = category.bikes.find((b) => b._id.toString() === bikeId);
        if (bike) {
          const bikeWithStock = bike as { stock: number };
          if (bikeWithStock.stock > 0) {
            bikeWithStock.stock -= 1;
          } else {
            throw new Error('Stock is already 0');
          }
          category.markModified('bikes');
          await category.save();
          console.log(category);
          return;
        }
      }

      throw new NotFoundException('Bike not found');
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
