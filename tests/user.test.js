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
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
describe('User API', () => {
    it('should register and login a user in the test database', () => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = {
            name: 'Test User',
            email: `testuser+${Date.now()}@example.com`,
            password: 'Password123!',
            role: 'manager',
            team: 'test-team',
        };
        const registerRes = yield (0, supertest_1.default)(index_1.default)
            .post('/api/users/register')
            .send(testUser);
        expect(registerRes.status).toBe(201);
        expect(registerRes.body.message).toBe('User Registered');
        const loginRes = yield (0, supertest_1.default)(index_1.default)
            .post('/api/users/login')
            .send({ email: testUser.email, password: testUser.password });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.token).toBeDefined();
    }));
});
