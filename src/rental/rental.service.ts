import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RentalDocument, Rental_MODEL } from 'src/schemas/rental/rental.schema';
import { Model } from 'mongoose';
import { BikeService } from 'src/bike/bike.service';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UsersService } from 'src/users/users.service';
import { CategoryService } from 'src/category/category.service';
import { EmailService } from 'src/email-service/email-service.service';
import { RewardsService } from 'src/rewards/rewards.service';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel(Rental_MODEL)
    private readonly rentalModel: Model<RentalDocument>,
    private readonly categoryService: CategoryService,
    private readonly usersService: UsersService,
    private readonly bikeService: BikeService,
    private readonly emailService: EmailService,
    private readonly rewardService: RewardsService,
  ) {}

  async findAll() {
    try {
      const RentalData = await this.rentalModel
        .find()
        .populate('bike')
        .populate('user');

      if (!RentalData) {
        throw new NotFoundException('RentalData Not Found');
      }

      return {
        status: true,
        message: 'Get All Rental Data SuccessFully',
        RentalData,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async uidVerify(UID: string, id: string) {
    try {
      const rentalData = await this.rentalModel.findById(id).exec();
      if (!rentalData) {
        return {
          status: false,
          message: 'Rental data is not found',
        };
      }
      const userId = rentalData.user.toString();
      const bikeId = rentalData.bike.toString();

      const rentalUID = rentalData.UID.toString().trim();
      if (rentalUID !== UID) {
        return {
          status: false,
          message: 'uid not matched',
        };
      } else {
        const reward = Math.floor(1 + Math.random() * 10);
        const currentDate = new Date();
        const nextMonthDate = new Date(currentDate);
        nextMonthDate.setMonth(currentDate.getMonth() + 1);
        console.log({
          reward,
          expiredDate: nextMonthDate,
        });
        await this.rewardService.createReward({
          reward,
          user: userId,
          expiredDate: nextMonthDate,
        });
        await this.DeleteByUID(id, userId, bikeId);
        return {
          uid: UID,
          status: true,
          message: 'uid Matched',
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  //   async create(createRentalDto: CreateRentalDto) {
  //     const user = await this.usersService.findOne(createRentalDto.userId);
  //     const bike = await this.bikeService.findOne(createRentalDto.bikeId);

  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     } else if (!bike) {
  //       throw new NotFoundException('Bike not found');
  //     }

  //     const existingBooking = await this.rentalModel.findOne({
  //       user: createRentalDto.userId,
  //       status: 'Booked',
  //       // date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Check for bookings on the current day
  //     });

  //     // console.log(existingBooking);

  //     if (existingBooking) {
  //       return {
  //         status: 204,
  //         message: 'User already has a rental booking for today',
  //       };
  //     }

  //     // Check age requirement
  //     if (createRentalDto.age <= 17) {
  //       return {
  //         message: '18 or 18+ age is required',
  //       };
  //     }

  //     const rentalId = this.generateUniqueId(15);
  //     const userData = {
  //       email: createRentalDto.email,
  //       subject: 'Password Reset Request',
  //       html: `
  //       <body>
  //     <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
  //         <tbody>
  //             <tr>
  //                 <td style="background: url('https://sukuto.com/images/home_search_background.webp'); padding: 50px 0;">
  //                     <table width="650" style="background-color: transparent; border: 1px solid #ccc; margin: 0 auto;" cellspacing="0" cellpadding="0" border="0" align="center">
  //                         <tbody>
  //                             <tr>
  //                                 <td style="padding: 30px;">
  //                                     <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
  //                                         <tbody>
  //                                             <tr>
  //                                                 <td align="center">
  //                                                     <h1 style="color: #FFF; font-size: 2em; margin: 0;">UID Verification</h1>
  //                                                     <h1 style="color: #FFF;">your booking is registered</h1>
  //                                                 </td>
  //                                             </tr>
  //                                             <tr>
  //                                                 <td>&nbsp;</td>
  //                                             </tr>
  //                                             <tr>
  //                                                 <td align="center">
  //                                                     <p style="font-size: 1.2em; color: #fff; margin: 0;">IT's Your UID</p>
  //                                                     <p style="font-size: 2em; color: #50bbe7; margin: 0; padding-top: 10px;"> ${rentalId}</p> <!-- Replace with dynamic OTP -->
  //                                                 </td>
  //                                             </tr>
  //                                             <tr>
  //                                                 <td>&nbsp;</td>
  //                                             </tr>
  //                                             <tr>
  //                                                 <td align="center">
  //                                                     <p style="font-size: 1.2em; color: red; margin: 0;">Please Do not Share Your UID</p>
  //                                                 </td>
  //                                             </tr>
  //                                         </tbody>
  //                                     </table>
  //                                 </td>
  //                             </tr>
  //                             <tr>
  //                                 <td width="100%" valign="middle" align="center" style="background-color: brown; padding: 20px 0;">
  //                                     <p style="font-size: 14px; color: #fff; margin: 0;">
  //                                         <a style="color: #fff; text-decoration: none;" href="https://example.com/terms" target="_blank">Terms of Use</a> |
  //                                         <a style="color: #fff; text-decoration: none;" href="https://example.com/privacy" target="_blank">Privacy Policy</a> |
  //                                         <a style="color: #fff; text-decoration: none;" href="https://example.com/compliance" target="_blank">Compliance</a>
  //                                     </p>
  //                                 </td>
  //                             </tr>
  //                         </tbody>
  //                     </table>
  //                 </td>
  //             </tr>
  //         </tbody>
  //     </table>
  // </body>
  //       `,
  //     };
  //     await this.emailService.sendEmail(userData);

  //     return this.rentalModel.create({
  //       ...createRentalDto,
  //       user: createRentalDto.userId,
  //       bike: createRentalDto.bikeId,
  //       UID: rentalId,
  //       isCompleted: true,
  //       status: 'Booked',
  //     });
  //   }

  async create(createRentalDto: CreateRentalDto) {
    try {
      const user = await this.usersService.findOne(createRentalDto.userId);
      const bike = await this.bikeService.findOne(createRentalDto.bikeId);

      if (!user) {
        throw new NotFoundException('User not found');
      } else if (!bike) {
        throw new NotFoundException('Bike not found');
      }

      const existingBooking = await this.rentalModel.findOne({
        user: createRentalDto.userId,
        status: 'Booked',
        // date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Check for bookings on the current day
      });

      if (existingBooking) {
        return {
          status: false,
          message: 'User already has a rental booking for today',
        };
      }
      if (createRentalDto.age <= 17) {
        return {
          status: false,
          message: '18 or 18+ age is required',
        };
      }

      const rentalId = this.generateUniqueId(15);
      const userData = {
        email: createRentalDto.email,
        subject: 'Password Reset Request',
        html: `
        <body>
      <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
          <tbody>
              <tr>
                  <td style="background: url('https://sukuto.com/images/home_search_background.webp'); padding: 50px 0;">
                      <table width="650" style="background-color: transparent; border: 1px solid #ccc; margin: 0 auto;" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tbody>
                              <tr>
                                  <td style="padding: 30px;">
                                      <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                          <tbody>
                                              <tr>
                                                  <td align="center">
                                                      <h1 style="color: #FFF; font-size: 2em; margin: 0;">UID Verification</h1>
                                                      <h1 style="color: #FFF;">your booking is registered</h1>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td>&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <p style="font-size: 1.2em; color: #fff; margin: 0;">IT's Your UID</p>
                                                      <p style="font-size: 2em; color: #50bbe7; margin: 0; padding-top: 10px;"> ${rentalId}</p> <!-- Replace with dynamic OTP -->
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td>&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <p style="font-size: 1.2em; color: red; margin: 0;">Please Do not Share Your UID</p>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td width="100%" valign="middle" align="center" style="background-color: brown; padding: 20px 0;">
                                      <p style="font-size: 14px; color: #fff; margin: 0;">
                                          <a style="color: #fff; text-decoration: none;" href="https://example.com/terms" target="_blank">Terms of Use</a> |
                                          <a style="color: #fff; text-decoration: none;" href="https://example.com/privacy" target="_blank">Privacy Policy</a> |
                                          <a style="color: #fff; text-decoration: none;" href="https://example.com/compliance" target="_blank">Compliance</a>
                                      </p>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
  </body>
        `,
      };
      await this.emailService.sendEmail(userData);

      const newRental = await this.rentalModel.create({
        ...createRentalDto,
        user: createRentalDto.userId,
        bike: createRentalDto.bikeId,
        UID: rentalId,
        isCompleted: true,
        status: 'Booked',
      });

      return {
        status: true,
        message: 'Rental Data Added SuccessFully',
        newRental,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  // Generate Unique Id
  generateUniqueId(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //Finde Single Data by UserId
  async findOne(userId: string) {
    try {
      const rentalData = await this.rentalModel
        .find({ user: userId })
        .populate('bike');

      if (!rentalData || rentalData.length === 0) {
        throw new NotFoundException('Rental data not found for the user');
      }

      return {
        status: true,
        message: 'Get Rental Data successFully',
        rentalData,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  //Find Rental Data By UserId
  async findBooking(userId: string) {
    try {
      const rentalData = await this.rentalModel
        .find({ user: userId })
        .populate('bike');

      if (!rentalData || rentalData.length === 0) {
        throw new NotFoundException('Rental data not found for the user');
      }

      return rentalData;
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  //Find Rental Data by ID
  async findById(id: string) {
    try {
      const rentalData = await this.rentalModel
        .findById(id)
        .populate('user')
        .populate('bike');

      if (!rentalData) {
        throw new NotFoundException('Rental data not found');
      }

      return rentalData;
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async update(id: string, updateRentalDto: UpdateRentalDto) {
    try {
      const updatedRentalData = await this.rentalModel.findByIdAndUpdate(
        id,
        updateRentalDto,
        { new: true },
      );

      if (!updatedRentalData) {
        return {
          status: false,
          message: 'Rental Data not found',
        };
      }

      return {
        status: true,
        data: updatedRentalData,
        message: 'Rental Data Updated SuccessFuly',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async CancelBookings(id: string, bikeId: string) {
    try {
      const rental = await this.rentalModel.findById(id);
      if (!rental) {
        return {
          message: 'Rental data is not found',
        };
      }
      rental.status = 'Cancel Booking';

      rental.markModified('rental');
      await rental.save();

      await this.categoryService.incrementStock(bikeId);
      return {
        status: true,
        message: 'Booking is Cancel Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async Delete(id: string, userId: string, bikeId: string) {
    try {
      const rental = await this.rentalModel.findById(id);
      if (!rental) {
        return {
          message: 'Rental data is not found',
        };
      }
      const CustomerId = rental.user.toString();
      const user = await this.usersService.findOne(userId);
      const Customer = await this.usersService.findOne(CustomerId);
      const Coin = Math.floor(1 + Math.random() * 5);
      if (!user) {
        return {
          message: 'User data is not found',
        };
      } else if (Object(user.user).role === 'admin') {
        Object(Customer.user).bookings += 1;
        Object(Customer.user).coins += Coin;

        rental.isCompleted = true;
        rental.isDeleted = false;
        rental.isCancel = false;
        rental.status = 'Completed';

        Object(Customer.user).markModified('user');
        await Object(Customer.user).save();

        rental.markModified('rental');
        await rental.save();
      } else if (Object(user.user).role === 'user') {
        rental.isCompleted = false;
        rental.isDeleted = false;
        rental.isCancel = true;
        rental.status = 'Cancel Booking';
        rental.markModified('rental');
        await rental.save();
      }

      console.log(rental);
      await this.categoryService.incrementStock(bikeId);

      return {
        _id: id,
        message: 'Rental data is Deleted successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async DeleteByUID(id: string, userId: string, bikeId: string) {
    try {
      const rental = await this.rentalModel.findById(id);
      if (!rental) {
        return {
          message: 'Rental data is not found',
        };
      }
      const CustomerId = rental.user.toString();
      const user = await this.usersService.findOne(userId);
      const Customer = await this.usersService.findOne(CustomerId);
      const Coin = Math.floor(1 + Math.random() * 5);
      if (!user) {
        return {
          message: 'User data is not found',
        };
      }

      Object(Customer.user).bookings += 1;
      Object(Customer.user).coins += Coin;
      Object(Customer.user).markModified('user');
      await Object(Customer.user).save();

      rental.isCompleted = true;
      rental.isDeleted = false;
      rental.isCancel = false;
      rental.status = 'Completed';
      rental.markModified('rental');
      await rental.save();

      await this.categoryService.incrementStock(bikeId);

      return {
        _id: id,
        message: 'Rental data is Deleted successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
