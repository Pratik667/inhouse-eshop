jest.mock('nodemailer', () => {
  return {
    __esModule: true,
    default: {
      createTransport: jest.fn(),
    },
  };
});

jest.mock('twilio', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn(),
    },
  }));
});

import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { sendResetPasswordEmail, sendResetPasswordSMS } from '../src/utils/notification';

const nodemailerMock = ((nodemailer as any).default ?? nodemailer) as any;
const twilioMock = (twilio as unknown) as jest.MockedFunction<any>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('notification utils', () => {
  test('sendResetPasswordEmail sends an email when SMTP config present', async () => {
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
    process.env.SMTP_SECURE = 'false';
    process.env.SMTP_FROM = 'no-reply@example.com';
    process.env.FRONTEND_URL = 'http://frontend.example';

    const sendMailMock = jest.fn().mockResolvedValue({});
    (nodemailerMock.createTransport as jest.Mock).mockReturnValue({ sendMail: sendMailMock });

    await expect(sendResetPasswordEmail('to@example.com', 'tok123')).resolves.toBeUndefined();

    expect(nodemailerMock.createTransport).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'to@example.com',
        subject: 'Reset your password',
      })
    );
  });

  test('sendResetPasswordEmail throws when SMTP config missing', async () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    await expect(sendResetPasswordEmail('a@b.com', 't')).rejects.toThrow('SMTP configuration is missing');
  });

  test('sendResetPasswordSMS sends an SMS when Twilio config present', async () => {
    process.env.TWILIO_ACCOUNT_SID = 'AC123';
    process.env.TWILIO_AUTH_TOKEN = 'tok';
    process.env.TWILIO_PHONE_NUMBER = '+10000000000';

    const messagesCreateMock = jest.fn().mockResolvedValue({ sid: 'SM123' });
    (twilioMock as jest.Mock).mockImplementation(() => ({ messages: { create: messagesCreateMock } }));

    await expect(sendResetPasswordSMS('+15551234567', 'tok123')).resolves.toBeUndefined();

    expect((twilioMock as jest.Mock)).toHaveBeenCalled();
    expect(messagesCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '+15551234567',
        from: '+10000000000',
      })
    );
  });

  test('sendResetPasswordSMS throws when Twilio config missing', async () => {
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_PHONE_NUMBER;

    await expect(sendResetPasswordSMS('+1', 't')).rejects.toThrow('Twilio configuration is missing');
  });
});
