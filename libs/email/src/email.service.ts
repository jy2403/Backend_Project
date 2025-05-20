import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { title } from 'process';

@Injectable()
export class EmailService {
  sendCreationEmail() {
    throw new Error('Method not implemented.');
  }
  private transporter;
  private appName: string;
  private appUrl: string;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: this.configService.get('EMAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    this.appName =
      this.configService.get('APP_NAME') || 'CENTRO DE DENUNCIAS CIUDADANAS';
    this.appUrl = this.configService.get('APP_URL') || 'https://CDC.com';
  }
  async sendVerificationEmail(
    email: string,
    name: string,
    code: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"${this.appName}" <${this.configService.get('EMAIL_USER')}>`,
      to: email,
      subject: 'Verifica tu dirección de correo electrónico',
      html: this.getVerificationEmailTemplate(name, code),
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendStatusEmail(
    email: string,
    name: string,
    tittle: string,
    status: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"${this.appName}" <${this.configService.get('EMAIL_USER')}>`,
      to: email,
      subject: tittle,
      html: this.getStatusEmailTemplate(name, tittle, status),
    };
    await this.transporter.sendMail(mailOptions);
  }
  private getStatusEmailTemplate(
    name: string,
    tittle: string,
    status: string,
  ): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Correo electrónico de estado</title>
      <style>
        /* Estilos generales */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eeeeee;
        }
        .logo {
          max-height: 60px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px 20px;
          text-align: center;
        }
        .verification-code {
          font-size: 32px;
          font-weight: bold;
          color: #4a6ee0;
          padding: 15px 25px;
          margin: 25px 0;
          display: inline-block;
          background-color: #f0f4ff;
          border-radius: 6px;
          letter-spacing: 4px;
          border: 1px dashed #b1c3ff;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          margin-top: 20px;
          color: #888888;
          font-size: 0.9em;
          border-top: 1px solid #eeeeee;
        }
        .text-highlight {
          color: #4a6ee0;
          font-weight: 600;
        }
        .btn {
          display: inline-block;
          background-color: #4a6ee0;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 5px;
          font-weight: bold;
          margin-top: 15px;
          transition: background-color 0.3s;
        }
        .btn:hover {
          background-color: #3a5dca;
        }
        .warning {
          background-color: #fff8e1;
          padding: 15px;
          border-radius: 5px;
          margin-top: 30px;
          font-size: 0.9em;
          color: #856404;
          border-left: 4px solid #ffd54f;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${this.appName}</h1>
        </div>
        <div class="content">
          <h2>Correo electrónico de estado del reporte</h2>
          <p>Hola <span class="text-highlight">${name}</span>,</p>
          <p>Tu denuncia <strong>${tittle} se encuentra en estado <strong>${status}</strong></p>
          
          <p>Las autoridades de seguridad han sido notificadas y están trabajando en la resolución de tu denuncia.</p>
          <p>Si hay mas informacion que puedas proporcionar, por favor pulsa el boton para actualizarla.</p>
          <a href="${this.appUrl}/verify" class="btn">Actualizar mi denuncia</a>
          
          <div class="warning">
            <p>  Si no reconoces esta actividad,puedes ignorar este correo..</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${this.appName}. Todos los derechos reservados.</p>
          <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  private getVerificationEmailTemplate(name: string, code: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verificación de correo electrónico</title>
      <style>
        /* Estilos generales */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eeeeee;
        }
        .logo {
          max-height: 60px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px 20px;
          text-align: center;
        }
        .verification-code {
          font-size: 32px;
          font-weight: bold;
          color: #4a6ee0;
          padding: 15px 25px;
          margin: 25px 0;
          display: inline-block;
          background-color: #f0f4ff;
          border-radius: 6px;
          letter-spacing: 4px;
          border: 1px dashed #b1c3ff;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          margin-top: 20px;
          color: #888888;
          font-size: 0.9em;
          border-top: 1px solid #eeeeee;
        }
        .text-highlight {
          color: #4a6ee0;
          font-weight: 600;
        }
        .btn {
          display: inline-block;
          background-color: #4a6ee0;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 5px;
          font-weight: bold;
          margin-top: 15px;
          transition: background-color 0.3s;
        }
        .btn:hover {
          background-color: #3a5dca;
        }
        .warning {
          background-color: #fff8e1;
          padding: 15px;
          border-radius: 5px;
          margin-top: 30px;
          font-size: 0.9em;
          color: #856404;
          border-left: 4px solid #ffd54f;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${this.appName}</h1>
        </div>
        <div class="content">
          <h2>Verificación de Correo Electrónico</h2>
          <p>Hola <span class="text-highlight">${name}</span>,</p>
          <p>Gracias por registrarte en <strong>${this.appName}</strong>. Para completar tu registro, por favor utiliza el siguiente código de verificación:</p>
          
          <div class="verification-code">${code}</div>
          
          <p>Este código expirará en <strong>5 minutos</strong>.</p>
          
          <a href="${this.appUrl}/verify" class="btn">Verificar mi cuenta</a>
          
          <div class="warning">
            <p>Si no solicitaste este código, puedes ignorar este correo. Si no reconoces esta actividad, por favor contacta a nuestro equipo de soporte.</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${this.appName}. Todos los derechos reservados.</p>
          <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
