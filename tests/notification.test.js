"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
const notification_1 = require("../src/utils/notification");
const nodemailerMock = ((_a = nodemailer_1.default.default) !== null && _a !== void 0 ? _a : nodemailer_1.default);
const twilioMock = twilio_1.default;
beforeEach(() => {
    jest.clearAllMocks();
});
describe('notification utils', () => {
    test('sendResetPasswordEmail sends an email when SMTP config present', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.SMTP_HOST = 'smtp.example.com';
        process.env.SMTP_PORT = '587';
        process.env.SMTP_USER = 'user';
        process.env.SMTP_PASS = 'pass';
        process.env.SMTP_SECURE = 'false';
        process.env.SMTP_FROM = 'no-reply@example.com';
        process.env.FRONTEND_URL = 'http://frontend.example';
        const sendMailMock = jest.fn().mockResolvedValue({});
        nodemailerMock.createTransport.mockReturnValue({
            sendMail: sendMailMock,
        });
        yield expect((0, notification_1.sendResetPasswordEmail)('to@example.com', 'tok123')).resolves.toBeUndefined();
        expect(nodemailerMock.createTransport).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
            to: 'to@example.com',
            subject: 'Reset your password',
        }));
    }));
    test('sendResetPasswordEmail throws when SMTP config missing', () => __awaiter(void 0, void 0, void 0, function* () {
        delete process.env.SMTP_HOST;
        delete process.env.SMTP_USER;
        delete process.env.SMTP_PASS;
        yield expect((0, notification_1.sendResetPasswordEmail)('a@b.com', 't')).rejects.toThrow('SMTP configuration is missing');
    }));
    test('sendResetPasswordSMS sends an SMS when Twilio config present', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.TWILIO_ACCOUNT_SID = 'AC123';
        process.env.TWILIO_AUTH_TOKEN = 'tok';
        process.env.TWILIO_PHONE_NUMBER = '+10000000000';
        const messagesCreateMock = jest.fn().mockResolvedValue({ sid: 'SM123' });
        twilioMock.mockImplementation(() => ({
            messages: { create: messagesCreateMock },
        }));
        yield expect((0, notification_1.sendResetPasswordSMS)('+15551234567', 'tok123')).resolves.toBeUndefined();
        expect(twilioMock).toHaveBeenCalled();
        expect(messagesCreateMock).toHaveBeenCalledWith(expect.objectContaining({
            to: '+15551234567',
            from: '+10000000000',
        }));
    }));
    test('sendResetPasswordSMS throws when Twilio config missing', () => __awaiter(void 0, void 0, void 0, function* () {
        delete process.env.TWILIO_ACCOUNT_SID;
        delete process.env.TWILIO_AUTH_TOKEN;
        delete process.env.TWILIO_PHONE_NUMBER;
        yield expect((0, notification_1.sendResetPasswordSMS)('+1', 't')).rejects.toThrow('Twilio configuration is missing');
    }));
});
