import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { USER_MODEL, UserDocument } from 'src/schemas/user/user.schema';
import { CreateUserDto, EmptyUser, User } from './dto/create-user.dto';
import { LoginDto } from 'src/Common-DTO/Login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email-service/email-service.service';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class UsersService {
  findById: any;
  constructor(
    @InjectModel(USER_MODEL) private readonly userModule: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
  ) {}

  async findAll() {
    try {
      const user = await this.userModule.find();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        status: true,
        message: 'Get All Users Data SuccessFully',
        user,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, phone, role } = createUserDto;

      const existingUserWithEmail = await this.userModule.findOne({ email });
      if (existingUserWithEmail) {
        existingUserWithEmail.status = 'Active';

        existingUserWithEmail.markModified('user');
        await existingUserWithEmail.save();
        return {
          status: true,
          message: 'Account Created Successfuly',
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModule.create({
          name,
          email,
          password: hashedPassword,
          phone,
          role,
        });

        return {
          status: true,
          message: 'User Register SuccessFully',
          user,
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.userModule.findOne({ email });
      if (!user) {
        return {
          statusCode: 404, // Not Found
          status: false,
          message: 'User Not Found',
        };
      } else if (user.status === 'Deactivate') {
        return {
          statusCode: 403, // Forbidden
          status: false,
          message: 'User Deactivated',
        };
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        return {
          statusCode: 401, // Unauthorized
          status: false,
          message: 'Invalid email or password',
        };
      }

      const token = this.jwtService.sign({ id: user._id });
      return { statusCode: 200, data: user, token }; // Success
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      const user = await this.userModule.findOne({ email });
      if (!user) {
        return {
          status: false,
          message: 'User not found',
        };
      }
      const token = this.jwtService.sign({ email });
      const GenratedOtp = await this.otpService.generateOtp(email);
      const userData = {
        email: email,
        subject: 'Password Reset Request',
        html: `
      <body>
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
        <tbody>
            <tr>
                <td style="background-color: #f5f5f5; padding: 50px 0;">
                    <table width="650" style="background-color: #ffffff; border: 1px solid #ccc; margin: 0 auto;" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 30px;">
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <h1 style="color: #55bde8; font-size: 2em; margin: 0;">OTP Verification</h1>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="font-size: 1.2em; color: #000; margin: 0;">Your One-Time Password (OTP) is:</p>
                                                    <p style="font-size: 2em; color: #50bbe7; margin: 0; padding-top: 10px;"> ${GenratedOtp}</p> <!-- Replace with dynamic OTP -->
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="font-size: 1.2em; color: #000; margin: 0;">This OTP is valid for 10 minutes.</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" valign="middle" align="center" style="background-color: #33bdbd; padding: 20px 0;">
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
      const sendEmail = await this.emailService.sendEmail(userData);
      console.log(sendEmail);

      if (!sendEmail) {
        return {
          status: false,
          message: 'Facing issue while Sent Email For Reset PassWord',
        };
      }

      console.log('token', token);
      return {
        status: true,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async findUserByEmail(email: string) {
    return this.userModule.findOne({ email }).exec();
  }

  async findUserAndUpdatePasswordByEmail(email: any, newPassword: string) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userModule
        .findByIdAndUpdate(user._id, { password: hashedPassword })
        .exec();
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async AccountDelete(email: string, password: string) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          status: false,
          message: 'Invalid Password',
        };
      } else {
        user.status = 'Deactivate';
        user.markModified('user');
        await user.save();
        return {
          status: true,
          message: 'User Account Deleted SuccessFully',
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async findOne(id: string): Promise<User | EmptyUser> {
    try {
      const user = await this.userModule.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      console.log(user, 'user');
      return {
        status: true,
        user: user,
        message: '',
      };
    } catch (error) {
      return {
        status: true,
        user: {},
        message: error.message || 'Internal server error',
      };
    }
  }
}
