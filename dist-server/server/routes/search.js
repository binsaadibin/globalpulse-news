import express from 'express';
import { search } from '../modules/search/search.controller.js';
var router = express.Router();
router.get('/', search);
export default router;
