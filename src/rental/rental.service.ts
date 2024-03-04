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
    const RentalData = await this.rentalModel
      .find()
      .populate('bike')
      .populate('user');
    if (!RentalData) {
      throw new NotFoundException('RentalData Not Found');
    }

    return RentalData;
  }

  async uidVerify(UID: string, id: string) {
    const rentalData = await this.rentalModel.findById(id).exec();
    if (!rentalData) {
      console.log('Rental data not found for id:', id);
      return {
        message: 'Rental data is not found',
      };
    }
    // console.log('rentalData:', rentalData);
    // console.log('UID:', UID);
    console.log(rentalData.bike);
    const userId = rentalData.user.toString();
    const bikeId = rentalData.bike.toString();

    const rentalUID = rentalData.UID.toString().trim(); // Ensure rentalData.UID is a string and trim any whitespace
    // console.log('rentalUID', rentalUID);
    if (rentalUID !== UID) {
      console.log('UID not matched:', rentalUID, UID);
      return {
        message: 'uid not matched',
      };
    } else {
      console.log('UID matched:', rentalUID, UID);
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
      await this.Delete(id, userId, bikeId);
      return {
        uid: UID,
        status: true,
        message: 'uid Matched',
      };
    }
  }

  async create(createRentalDto: CreateRentalDto) {
    const user = await this.usersService.findOne(createRentalDto.userId);
    const bike = await this.bikeService.findOne(createRentalDto.bikeId);

    console.log(createRentalDto);

    if (!user) {
      throw new NotFoundException('User not found');
    } else if (!bike) {
      throw new NotFoundException('Bike not found');
    }

    // Check if the user already has a rental booking for the current day
    const existingBooking = await this.rentalModel.findOne({
      user: createRentalDto.userId,
      status: 'Booked',
      // date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Check for bookings on the current day
    });

    console.log(existingBooking);

    if (existingBooking) {
      return {
        message: 'User already has a rental booking for today',
      };
    }

    // Check age requirement
    if (createRentalDto.age <= 17) {
      return {
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

    return this.rentalModel.create({
      ...createRentalDto,
      user: createRentalDto.userId,
      bike: createRentalDto.bikeId,
      UID: rentalId,
      isCompleted: true,
      status: 'Booked',
    });
  }

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

  async findOne(userId: string) {
    const RentalData = await this.rentalModel
      .find({ user: userId })
      .populate('bike');
    if (!RentalData || RentalData.length === 0) {
      throw new NotFoundException('RentalData not found for the user');
    }
    return RentalData;
  }

  async findBooking(userId: string) {
    const RentalData = await this.rentalModel
      .find({ user: userId })
      .populate('bike');
    // await this.checkStatus(userId);
    if (!RentalData || RentalData.length === 0) {
      throw new NotFoundException('RentalData not found for the user');
    }
    return RentalData;
  }

  async findById(id: string) {
    const RentalData = (
      await this.rentalModel.findById({ _id: id }).populate('user')
    ).populate('bike');
    if (!RentalData) {
      throw new NotFoundException('RentalData not found for the user');
    }
    return RentalData;
  }

  async update(id: string, updateRentalDto: UpdateRentalDto) {
    const UpdateRentalData = await this.rentalModel.findByIdAndUpdate(
      id,
      updateRentalDto,
      {
        new: true,
      },
    );

    if (!UpdateRentalData) {
      return {
        message: 'Rental Data not found',
      };
    }

    return UpdateRentalData;
  }

  async CancelBookings(id: string, bikeId: string) {
    try {
      const rental = await this.rentalModel.findById(id);
      if (!rental) {
        return {
          message: 'Rental data is not found',
        };
      }
      console.log(rental);
      rental.status = 'Cancel Booking';

      rental.markModified('rental');
      await rental.save();

      await this.categoryService.incrementStock(bikeId);
      return {
        status: true,
        message: 'Booking is Cancel Successfully',
      };
    } catch (error) {
      console.error('Error deleting rental:', error);
      throw error;
    }
  }

  async Delete(id: string, userId: string, bikeId: string) {
    try {
      console.log({ id, userId, bikeId });
      const rental = await this.rentalModel.findById(id);
      if (!rental) {
        return {
          message: 'Rental data is not found',
        };
      }

      const user = await this.usersService.findOne(userId);
      const Coin = Math.floor(1 + Math.random() * 5);
      console.log({ Coin });
      if (!user) {
        return {
          message: 'User data is not found',
        };
      } else if (user.role === 'admin') {
        user.bookings += 1;
        user.coins += Coin;

        user.markModified('user');
        await user.save();
      }

      rental.isCompleted = false;
      rental.isDeleted = true;
      rental.status = 'Completed';

      rental.markModified('rental');
      await rental.save();
      console.log({ user });
      await this.categoryService.incrementStock(bikeId);
      // console.log({ bike });

      // const deletedRental = await this.rentalModel.findByIdAndDelete(id);
      // if (!deletedRental) {
      //   return {
      //     message: 'Rental data is not found',
      //   };
      // }

      return {
        _id: id,
        message: 'Rental data is Deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting rental:', error);
      throw error;
    }
  }
}
