import {getAllBranch, getBranchServiceByID} from '../services/branches.services.js';

export const listAllBranch = async (req, res) => {
  try{
    const branches = await getAllBranch();
    res.json({branches});
  }catch(error){
    res.status(500).json({error: error.message});
  }
};

export const listBranchServiceByID = async (req, res) => {
  try{
    const { id } = req.params; // extracts id from /:id/service
    const branchService = await getBranchServiceByID(id);
    res.json({service: branchService});
  }catch(error){
    console.log('[Error] something went wrong in controller');
    res.status(500).json({error: error.message});
  }
}