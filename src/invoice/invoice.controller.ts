import { Controller, Body, Res, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Response } from 'express';
// import * as fs from 'fs';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('generate')
  async generateInvoice(
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    const { invoiceData, customTitle } = body;
    try {
      const fileName = await this.invoiceService.generateInvoice(
        invoiceData,
        customTitle,
        res,
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    } catch (error) {
      res.status(500).send(`Failed to generate invoice: ${error.message}`);
    }
  }
}
