"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let TransferInput = class TransferInput {
};
exports.TransferInput = TransferInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{10}$/, { message: 'Receiver mobile must be a 10-digit number' }),
    __metadata("design:type", String)
], TransferInput.prototype, "receiverMobile", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'Amount must be positive' }),
    (0, class_validator_1.Min)(0.01, { message: 'Minimum transfer amount is $0.01' }),
    __metadata("design:type", Number)
], TransferInput.prototype, "amount", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferInput.prototype, "idempotencyKey", void 0);
exports.TransferInput = TransferInput = __decorate([
    (0, graphql_1.InputType)()
], TransferInput);
//# sourceMappingURL=transfer.input.js.map