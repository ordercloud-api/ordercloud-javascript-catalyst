"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.post('/shippingrates', function (req, res, next) {
    res.send('ship rates');
});
router.post('/ordercalculate', function (req, res, next) {
    res.send('order calculate');
});
router.post('/ordersubmit', function (req, res, next) {
    res.send('order submit');
});
exports.default = router;
//# sourceMappingURL=CheckoutIntegrationEvents.js.map