import { Injectable, NotFoundException } from '@nestjs/common';
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
    const categorys = await this.categoryModel.find();

    if (!categorys) {
      throw new NotFoundException('Category Not Found');
    }

    return categorys;
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Job not found');
    }

    return category;
  }

  async findBike(bikeId: string) {
    const categories = await this.findAll();
    for (const category of categories) {
      const bike = category.bikes.find((b) => b._id.toString() === bikeId);
      if (bike) {
        return bike;
      }
    }
    throw new NotFoundException('Bike not found');
  }

  async incrementStock(bikeId: string) {
    try {
      const categories = await this.findAll();

      for (const category of categories) {
        const bike = category.bikes.find((b) => b._id.toString() === bikeId);
        if (bike) {
          // Bike found, increment its stock
          const bikeWithStock = bike as { stock: number };
          bikeWithStock.stock += 1;

          // Mark the category as modified and save
          category.markModified('bikes');
          await category.save();

          return; // Exit the function once the stock is incremented
        }
      }

      throw new NotFoundException('Bike not found');
    } catch (error) {
      throw new Error(`Failed to increment stock: ${error.message}`);
    }
  }

  async decrementStock(bikeId: string) {
    // Find all categories
    const categories = await this.findAll();

    // Iterate over each category to find the bike
    for (const category of categories) {
      const bike = category.bikes.find((b) => b._id.toString() === bikeId);
      if (bike) {
        // Bike found, decrement its stock
        const bikeWithStock = bike as { stock: number };
        if (bikeWithStock.stock > 0) {
          bikeWithStock.stock -= 1;
        } else {
          throw new Error('Stock is already 0');
        }

        // Mark the category as modified and save
        category.markModified('bikes');
        await category.save();

        console.log(category); // Log the updated category
        return; // Exit the function once the bike is found and stock is decremented
      }
    }

    // If the loop completes without finding the bike, throw NotFoundException
    throw new NotFoundException('Bike not found');
  }
}
