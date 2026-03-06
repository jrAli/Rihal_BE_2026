import express from 'express';
import {listAllBranch, listBranchServiceByID} from '../controllers/branches.controller.js';

const branchesRouter = express.Router();

branchesRouter.get('/', listAllBranch);
branchesRouter.get('/:id/services', listBranchServiceByID);

export default branchesRouter;